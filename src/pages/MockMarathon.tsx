import React, { useState } from 'react';
import { useAppStore } from '../store/useStore';
import { 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Upload, 
  Brain, 
  Code, 
  MessageSquare,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const steps = [
  { id: 1, name: 'Company Selection', icon: Search },
  { id: 2, name: 'Resume Upload', icon: Upload },
  { id: 3, name: 'Aptitude Test', icon: Brain },
  { id: 4, name: 'Coding Lab', icon: Code },
  { id: 5, name: 'HR Interview', icon: MessageSquare },
];

export default function MockMarathon() {
  const { companies, currentSession, startSession, updateSession } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentStep = currentSession?.step || 1;

  const handleCompanySelect = (id: string) => {
    startSession(id);
  };

  const nextStep = () => {
    if (currentSession) {
      updateSession({ step: currentStep + 1 });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search for a company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-zinc-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-lg"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.map((company) => (
                <motion.button
                  key={company.id}
                  whileHover={{ y: -4 }}
                  onClick={() => handleCompanySelect(company.id)}
                  className="bg-white p-6 rounded-3xl border border-zinc-200 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/5 transition-all text-left group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-zinc-50 p-3 mb-4 group-hover:bg-emerald-50 transition-colors">
                    <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-1">{company.name}</h3>
                  <p className="text-sm text-zinc-500 line-clamp-2">{company.description}</p>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-zinc-200 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-10 h-10 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-zinc-900">Upload your Resume</h3>
                <p className="text-zinc-500 mt-2">Drag and drop your PDF or DOCX file here.</p>
              </div>
              <button 
                onClick={() => {
                  setIsScanning(true);
                  setTimeout(() => {
                    setIsScanning(false);
                    updateSession({ resumeScore: 85 });
                    nextStep();
                  }, 3000);
                }}
                className="bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all disabled:opacity-50"
                disabled={isScanning}
              >
                {isScanning ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Scanning Resume...
                  </span>
                ) : 'Select File'}
              </button>
            </div>
            
            {isScanning && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 space-y-4"
              >
                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3 }}
                    className="h-full bg-emerald-500"
                  />
                </div>
                <p className="text-center text-sm font-medium text-zinc-500">Analyzing keywords and ATS compatibility...</p>
              </motion.div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-zinc-900">Step {currentStep} Content</h3>
            <p className="text-zinc-500 mt-2">This feature is coming in the next module.</p>
            <button 
              onClick={nextStep}
              className="mt-8 bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-all"
            >
              Simulate Completion
            </button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-zinc-900">Mock Marathon</h1>
        <p className="text-zinc-500 mt-2">Complete the 5-step journey to land your dream job.</p>
      </div>

      {/* Stepper */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-200 -translate-y-1/2" />
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            return (
              <div key={step.id} className="flex flex-col items-center gap-4 bg-zinc-50 px-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all relative z-10",
                  isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
                  isActive ? "bg-white border-emerald-500 text-emerald-600 shadow-lg shadow-emerald-500/20" :
                  "bg-white border-zinc-200 text-zinc-400"
                )}>
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
                </div>
                <span className={cn(
                  "text-xs font-bold uppercase tracking-wider",
                  isActive ? "text-emerald-600" : "text-zinc-400"
                )}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-zinc-100/50 p-8 rounded-[40px] min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
