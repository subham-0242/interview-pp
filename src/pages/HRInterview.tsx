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
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore, useAppStore } from '../store/useStore';

export default function HRInterview() {
  const { user } = useAuthStore();
  const { hrGender, hrTone } = useAppStore();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [transcripts, setTranscripts] = useState([
    { role: 'interviewer', text: "That's a very insightful answer, " + (user?.name?.split(' ')[0] || 'Candidate') + ". Following up on that, can you describe a time when you had to advocate for a user experience decision that conflicted with a business requirement? How did you handle that negotiation?", time: '11:04 AM' },
    { role: 'user', text: "In my previous role at a fintech startup, we were pushed to include several dark patterns to increase conversion rates for insurance add-ons. I organized a stakeholder workshop where I presented usability test results showing that while short-term conversion might rise, user trust scores were dropping significantly...", time: '11:06 AM' },
  ]);
  const [stressLevel, setStressLevel] = useState(20);
  const videoRef = useRef<HTMLVideoElement>(null);

  const hrImages = {
    female: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    male: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'
  };

  useEffect(() => {
    if (isCameraOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Error accessing media devices:", err));
    } else {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    }
  }, [isCameraOn]);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col bg-zinc-50/50 -m-8">
      {/* Top Navigation Bar */}
      <div className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900">HR Round: Senior UI Designer</h2>
            <p className="text-[10px] text-zinc-500 font-medium">Candidate: {user?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Progress</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`h-1 w-6 rounded-full ${i <= 3 ? 'bg-emerald-500' : 'bg-zinc-200'}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-zinc-900">
            <Clock className="w-4 h-4 text-red-500" />
            <span className="text-sm font-bold">14:32</span>
            <span className="text-[10px] text-zinc-400 font-medium">Time remaining</span>
          </div>
          <button className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition-all border border-red-100">
            End Interview
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat & HR Image */}
        <div className="flex-1 flex flex-col min-w-0 bg-white border-r border-zinc-200">
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* HR Image (The "Interviewer") */}
            <div className="flex justify-center mb-12">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <div className="absolute -inset-4 bg-emerald-500/10 rounded-[40px] blur-2xl group-hover:bg-emerald-500/20 transition-all" />
                <div className="relative w-64 h-64 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl">
                  <img 
                    src={hrImages[hrGender]} 
                    alt="HR Interviewer" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white text-xs font-bold text-center capitalize">AI Interviewer ({hrTone})</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Transcript Bubbles */}
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
                    <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-sm border ${
                      t.role === 'interviewer' 
                        ? 'bg-white text-zinc-900 border-zinc-100 rounded-tl-none' 
                        : 'bg-emerald-50 text-emerald-900 border-emerald-100 rounded-tr-none italic'
                    }`}>
                      {t.text}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
                      {t.role === 'interviewer' ? 'AI Interviewer' : 'You (Voice Input)'} • {t.time}
                    </span>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-zinc-50 border border-zinc-100 px-4 py-3 rounded-2xl flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Input Area */}
          <div className="p-6 border-t border-zinc-100 bg-white">
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Audio Waveform Simulation */}
              <div className="flex justify-center items-end gap-1 h-8">
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, Math.random() * 20 + 4, 4] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.05 }}
                    className="w-1 bg-emerald-400 rounded-full"
                  />
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button className="p-3 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="Type your response or use voice..."
                    className="w-full pl-6 pr-12 py-4 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-medium"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <button className={`p-4 rounded-2xl transition-all shadow-lg ${isMicOn ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-red-500 text-white shadow-red-500/20'}`}>
                  {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </button>
              </div>
              <p className="text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                Press and hold Spacebar to talk, or type your answer above.
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Analysis & Context */}
        <div className="w-80 bg-zinc-50/50 p-6 overflow-y-auto space-y-6">
          {/* Live Preview (Candidate) */}
          <div className="space-y-3">
            <div className="relative aspect-video bg-zinc-900 rounded-2xl overflow-hidden shadow-lg border border-white">
              {isCameraOn ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                  <User className="w-10 h-10 text-zinc-600" />
                </div>
              )}
              <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[8px] text-white font-bold uppercase tracking-widest">Live Preview</span>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">AI Analysis</span>
              <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Real-time</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900">Confident & Clear</p>
                <p className="text-[10px] text-zinc-500 font-medium">Emotion Indicator</p>
              </div>
            </div>
          </div>

          {/* Interview Context */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-5">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Interview Context</span>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Role</p>
                  <p className="text-xs font-bold text-zinc-900">Senior UI/UX Designer</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Focus Area</p>
                  <p className="text-xs font-bold text-zinc-900">Conflict Resolution & Leadership</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Instructions</p>
                  <p className="text-xs text-zinc-600 leading-relaxed">Speak clearly. The AI will evaluate your communication skills and behavioral responses.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tip Box */}
          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex gap-3">
            <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
              <span className="font-bold">Tip:</span> Use the STAR method (Situation, Task, Action, Result) for behavioral questions.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="h-8 bg-white border-t border-zinc-200 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Micro: Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Cam: Active</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Latency: 24ms</span>
          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Session ID: HR-992-AXL</span>
        </div>
      </div>
    </div>
  );
}

