import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  ChevronRight,
  Target,
  BarChart3,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ResumeAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<null | {
    score: number;
    feedback: string[];
    missingKeywords: string[];
  }>(null);

  const handleUpload = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult({
        score: 82,
        feedback: [
          'Strong action verbs used throughout.',
          'Quantifiable achievements are well-documented.',
          'Clean, ATS-friendly layout detected.'
        ],
        missingKeywords: ['Kubernetes', 'CI/CD', 'System Design']
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-zinc-900">AI Resume Analyzer</h1>
        <p className="text-zinc-500 mt-2">Get instant feedback on your resume and improve your ATS score.</p>
      </div>

      {!result && !isAnalyzing ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-16 rounded-[40px] border-2 border-dashed border-zinc-200 text-center space-y-8 shadow-sm"
        >
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
            <Upload className="w-12 h-12 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-900">Drop your resume here</h3>
            <p className="text-zinc-500 mt-2 max-w-sm mx-auto">
              Our AI will scan your resume for keywords, formatting, and impact. Supports PDF and DOCX.
            </p>
          </div>
          <button 
            onClick={handleUpload}
            className="bg-zinc-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10"
          >
            Select File
          </button>
        </motion.div>
      ) : isAnalyzing ? (
        <div className="bg-white p-16 rounded-[40px] border border-zinc-200 text-center space-y-8 shadow-sm">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-zinc-100" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="w-10 h-10 text-emerald-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-zinc-900">Scanning Resume...</h3>
            <p className="text-zinc-500">Extracting skills and analyzing impact scores.</p>
          </div>
          <div className="max-w-md mx-auto h-2 bg-zinc-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3 }}
              className="h-full bg-emerald-500"
            />
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Score Card */}
          <div className="lg:col-span-1 bg-zinc-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap className="w-40 h-40" />
            </div>
            <h3 className="text-xl font-bold mb-8">ATS Score</h3>
            <div className="flex flex-col items-center justify-center py-10">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="12"
                  />
                  <motion.circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeDasharray={552.92}
                    initial={{ strokeDashoffset: 552.92 }}
                    animate={{ strokeDashoffset: 552.92 * (1 - result!.score / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold">{result!.score}</span>
                  <span className="text-zinc-400 text-sm font-medium">Out of 100</span>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-white/10 rounded-2xl border border-white/10">
              <p className="text-sm text-zinc-400 text-center">
                Your resume is in the <span className="text-emerald-400 font-bold">top 15%</span> of applicants for Software Engineer roles.
              </p>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-zinc-200 shadow-sm">
              <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                Key Strengths
              </h3>
              <div className="space-y-4">
                {result!.feedback.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm text-emerald-900 font-medium">{f}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-zinc-200 shadow-sm">
              <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-orange-500" />
                Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-3">
                {result!.missingKeywords.map((k, i) => (
                  <span key={i} className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-xl text-sm font-bold border border-zinc-200">
                    {k}
                  </span>
                ))}
              </div>
              <button className="mt-8 w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Re-analyze Resume
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function RotateCcw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
