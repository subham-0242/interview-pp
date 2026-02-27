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
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function HRInterview() {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [transcripts, setTranscripts] = useState([
    { role: 'interviewer', text: 'Hello! Welcome to the interview. Can you tell me about yourself?' },
  ]);
  const [stressLevel, setStressLevel] = useState(20);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Simulate voice stress levels
  useEffect(() => {
    const interval = setInterval(() => {
      setStressLevel(prev => {
        const change = Math.floor(Math.random() * 10) - 5;
        return Math.min(Math.max(prev + change, 10), 60);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col lg:flex-row gap-6">
      {/* Video Feed Area */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1 bg-zinc-900 rounded-[40px] relative overflow-hidden shadow-2xl">
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
              <div className="w-32 h-32 rounded-full bg-zinc-700 flex items-center justify-center">
                <User className="w-16 h-16 text-zinc-500" />
              </div>
            </div>
          )}

          {/* Overlay UI */}
          <div className="absolute top-6 left-6 flex items-center gap-3">
            <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white text-xs font-bold uppercase tracking-widest">Live Interview</span>
            </div>
            <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-white text-xs font-bold uppercase tracking-widest">AI Analysis Active</span>
            </div>
          </div>

          {/* Voice Visualizer */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-end gap-1 h-12">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: [10, Math.random() * 40 + 10, 10] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                className="w-1 bg-emerald-500 rounded-full opacity-60"
              />
            ))}
          </div>

          {/* Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <button 
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-4 rounded-2xl transition-all ${isMicOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 text-white'}`}
            >
              {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
            <button 
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`p-4 rounded-2xl transition-all ${isCameraOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 text-white'}`}
            >
              {isCameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2">
              <X className="w-5 h-5" />
              End Session
            </button>
          </div>
        </div>

        {/* AI Analysis Panel */}
        <div className="h-32 bg-white rounded-[32px] border border-zinc-200 p-6 flex items-center gap-8 shadow-sm">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Voice Stress Level</p>
              <span className={`text-xs font-bold ${stressLevel > 50 ? 'text-orange-500' : 'text-emerald-500'}`}>
                {stressLevel > 50 ? 'High' : 'Normal'}
              </span>
            </div>
            <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${stressLevel}%` }}
                className={`h-full transition-all duration-500 ${stressLevel > 50 ? 'bg-orange-500' : 'bg-emerald-500'}`}
              />
            </div>
          </div>
          <div className="w-px h-full bg-zinc-100" />
          <div className="flex-1">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Sentiment Analysis</p>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <p className="text-sm font-bold text-zinc-900">Confident & Professional</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Sidebar */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-[40px] border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold text-zinc-900">Real-time Transcript</h3>
        </div>
        
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {transcripts.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${t.role === 'interviewer' ? 'items-start' : 'items-end'}`}
            >
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                {t.role === 'interviewer' ? 'AI Interviewer' : 'You'}
              </span>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                t.role === 'interviewer' 
                  ? 'bg-zinc-100 text-zinc-900 rounded-tl-none' 
                  : 'bg-emerald-500 text-white rounded-tr-none'
              }`}>
                {t.text}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-6 border-t border-zinc-100">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Type your response..."
              className="w-full pl-4 pr-12 py-3 rounded-xl bg-zinc-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const text = e.currentTarget.value;
                  if (!text) return;
                  setTranscripts([...transcripts, { role: 'user', text }]);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
