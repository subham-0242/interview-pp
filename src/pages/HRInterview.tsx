import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  MessageSquare, 
  Activity,
  User,
  Sparkles,
  Send,
  X,
  Clock,
  Briefcase,
  Target,
  Info,
  Lightbulb,
  RotateCcw,
  Camera,
  AlertCircle,
  Loader2,
  CheckCircle2,
  StopCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore, useAppStore } from '../store/useStore';
import { useCmsStore } from '../store/useCmsStore';
import { generateRoundFeedback, generateHRQuestion, processHRAudio } from '../services/geminiService';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function HRInterview() {
  const { user } = useAuthStore();
  const { currentSession, hrGender, hrTone, submitRound, resumeAnalysis } = useAppStore();
  const { companies } = useCmsStore();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [currentSentiment, setCurrentSentiment] = useState('Neutral');
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [turnCount, setTurnCount] = useState(0);
  const [finalTranscript, setFinalTranscript] = useState('');

  const selectedCompany = companies.find(c => c.id === currentSession?.companyId);
  const hrRound = selectedCompany?.workflow.find(r => r.type === 'hr');
  const maxTurns = hrRound?.config?.questionCount || 5;

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  const hrImages = {
    female: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    male: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'
  };

  // Initialize Interview
  useEffect(() => {
    const initInterview = async () => {
      setIsProcessing(true);
      try {
        const skills = resumeAnalysis?.topSkills || ['Software Engineering', 'Problem Solving'];
        const firstQuestion = await generateHRQuestion(skills, []);
        setTranscripts([{
          role: 'interviewer',
          text: firstQuestion,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } catch (error) {
        console.error("Failed to init interview:", error);
      } finally {
        setIsProcessing(false);
      }
    };
    initInterview();
  }, [resumeAnalysis]);

  // Camera Setup
  useEffect(() => {
    const startCamera = async () => {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720 }, 
          audio: true 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.error("Error accessing media devices:", err);
        setCameraError("Failed to access camera/mic. Please check permissions.");
        setIsCameraOn(false);
      }
    };

    if (isCameraOn) startCamera();
    else if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    return () => streamRef.current?.getTracks().forEach(track => track.stop());
  }, [isCameraOn]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscriptAccumulator = '';
        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscriptAccumulator += event.results[i][0].transcript + ' ';
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setFinalTranscript(finalTranscriptAccumulator);
        setLiveTranscript(interimTranscript);
      };
    }
  }, []);

  const startRecording = () => {
    if (!streamRef.current) return;
    
    setLiveTranscript('');
    setFinalTranscript('');
    audioChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      await handleTurnCompletion(audioBlob);
    };

    mediaRecorder.start();
    setIsRecording(true);
    recognitionRef.current?.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    recognitionRef.current?.stop();
  };

  const handleTurnCompletion = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const base64Audio = await blobToBase64(audioBlob);
      const lastQuestion = transcripts[transcripts.length - 1].text;
      
      // Process Audio with Gemini 2.0 Flash
      const { transcript, evaluation, sentiment } = await processHRAudio(base64Audio, 'audio/webm', lastQuestion);
      
      setCurrentSentiment(sentiment);
      
      const userTurn = {
        role: 'user',
        text: transcript,
        evaluation,
        sentiment,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setTranscripts(prev => [...prev, userTurn]);
      const nextTurnCount = turnCount + 1;
      setTurnCount(nextTurnCount);

      if (nextTurnCount < maxTurns) {
        // Generate Next Question
        const nextQuestion = await generateHRQuestion(resumeAnalysis?.topSkills || [], [...transcripts, userTurn]);
        setTranscripts(prev => [...prev, {
          role: 'interviewer',
          text: nextQuestion,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        // Auto-submit when turns are complete
        await handleSubmit();
      }
    } catch (error) {
      console.error("Turn processing failed:", error);
    } finally {
      setIsProcessing(false);
      setLiveTranscript('');
      setFinalTranscript('');
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const feedback = await generateRoundFeedback('HR Interview', { transcripts, hrTone, hrGender });
      const score = Math.floor(Math.random() * 20) + 75;
      submitRound(score, feedback);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-240px)] flex flex-col bg-white rounded-[40px] overflow-hidden border border-zinc-200 shadow-sm">
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat & HR Image */}
        <div className="flex-1 flex flex-col min-w-0 bg-white border-r border-zinc-200 relative">
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* HR Image */}
            <div className="flex justify-center mb-12">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <div className="absolute -inset-4 bg-emerald-500/10 rounded-[40px] blur-2xl group-hover:bg-emerald-500/20 transition-all" />
                <div className="relative w-48 h-48 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl">
                  <img src={hrImages[hrGender]} alt="HR Interviewer" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white text-[10px] font-bold text-center capitalize">AI Interviewer ({hrTone})</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Transcripts */}
            <div className="space-y-8 max-w-3xl mx-auto">
              {transcripts.map((t, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${t.role === 'interviewer' ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    t.role === 'interviewer' ? 'bg-emerald-500 text-white' : 'bg-zinc-100 text-zinc-400'
                  }`}>
                    {t.role === 'interviewer' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={`flex flex-col ${t.role === 'interviewer' ? 'items-start' : 'items-end'} max-w-[80%]`}>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm border ${
                      t.role === 'interviewer' 
                        ? 'bg-white text-zinc-900 border-zinc-100 rounded-tl-none' 
                        : 'bg-emerald-50 text-emerald-900 border-emerald-100 rounded-tr-none'
                    }`}>
                      {t.text}
                      {t.sentiment && (
                        <div className="mt-2 pt-2 border-t border-emerald-100 flex items-center gap-2">
                          <span className="text-[8px] font-bold uppercase text-emerald-600">Tone: {t.sentiment}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
                      {t.role === 'interviewer' ? 'AI Interviewer' : 'You'} • {t.time}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Live Transcript Feedback */}
              {isRecording && liveTranscript && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-row-reverse gap-4">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center shrink-0 mt-1">
                    <Activity className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-2xl rounded-tr-none max-w-[80%]">
                    <p className="text-sm text-zinc-500 italic">{finalTranscript}{liveTranscript}...</p>
                  </div>
                </motion.div>
              )}

              {/* Processing State */}
              {isProcessing && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 px-4 py-3 rounded-2xl flex gap-1 items-center">
                    <span className="text-xs text-zinc-400 font-bold uppercase">AI is thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Camera Preview */}
          <div className="absolute bottom-6 right-6 w-48 aspect-video bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-white z-20 group">
            {isCameraOn && !cameraError ? (
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-800 p-4 text-center">
                <VideoOff className="w-6 h-6 text-zinc-600 mb-2" />
                <p className="text-[8px] text-zinc-400 font-bold uppercase">Camera Off</p>
              </div>
            )}
            <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 flex items-center gap-1">
              <div className={`w-1 h-1 rounded-full ${isCameraOn ? 'bg-red-500 animate-pulse' : 'bg-zinc-500'}`} />
              <span className="text-[6px] text-white font-bold uppercase tracking-widest">You</span>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 border-t border-zinc-100 bg-white">
            <div className="max-w-4xl mx-auto flex items-center justify-center gap-6">
              {!isRecording ? (
                <button 
                  onClick={startRecording}
                  disabled={isProcessing || turnCount >= maxTurns}
                  className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center gap-3 shadow-xl shadow-emerald-500/20 disabled:opacity-50"
                >
                  <Mic className="w-5 h-5" />
                  Start Speaking
                </button>
              ) : (
                <button 
                  onClick={stopRecording}
                  className="bg-red-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-red-600 transition-all flex items-center gap-3 shadow-xl shadow-red-500/20"
                >
                  <StopCircle className="w-5 h-5" />
                  Stop & Submit Answer
                </button>
              )}
              
              {turnCount >= 1 && (
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || isProcessing}
                  className="bg-zinc-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-xl shadow-zinc-900/10 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  Stop Interview
                </button>
              )}
            </div>
            <p className="text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-4">
              {turnCount} / {maxTurns} Questions Answered
            </p>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-72 bg-zinc-50/50 p-6 overflow-y-auto space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tone Analysis</span>
              <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Real-time</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900">{currentSentiment}</p>
                <p className="text-[8px] text-zinc-500 font-medium">Current State</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-5">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Context</span>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Role</p>
                  <p className="text-[10px] font-bold text-zinc-900">{selectedCompany?.targetRole || 'Candidate'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Focus</p>
                  <p className="text-[10px] font-bold text-zinc-900">{hrTone} Interview</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex gap-3">
            <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-[10px] text-emerald-800 leading-relaxed font-medium">
              <span className="font-bold">Tip:</span> Your live transcript is shown as you speak. AI will analyze your tone and content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

