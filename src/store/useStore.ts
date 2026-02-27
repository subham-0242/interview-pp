import { create } from 'zustand';

export type UserRole = 'student' | 'admin' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole, name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (role, name) => set({ 
    user: { 
      id: Math.random().toString(36).substr(2, 9), 
      name, 
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`, 
      role 
    }, 
    isAuthenticated: true 
  }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
}

export interface TestSession {
  companyId: string | null;
  step: number;
  resumeScore: number | null;
  aptitudeScore: number | null;
  codingScore: number | null;
  hrScore: number | null;
}

export type HRGender = 'male' | 'female';
export type HRTone = 'professional' | 'friendly' | 'strict';

export interface ResumeAnalysis {
  atsScore: number;
  summary: string;
  topSkills: string[];
  missingKeywords: string[];
  formattingScore: number;
  actionItems: string[];
}

interface AppState {
  companies: Company[];
  selectedCompany: Company | null;
  currentSession: TestSession | null;
  hrGender: HRGender;
  hrTone: HRTone;
  resumeAnalysis: ResumeAnalysis | null;
  setCompanies: (companies: Company[]) => void;
  selectCompany: (company: Company) => void;
  startSession: (companyId: string) => void;
  updateSession: (updates: Partial<TestSession>) => void;
  resetSession: () => void;
  setHRSettings: (gender: HRGender, tone: HRTone) => void;
  setResumeAnalysis: (analysis: ResumeAnalysis) => void;
}

export const useAppStore = create<AppState>((set) => ({
  companies: [
    { id: '1', name: 'Google', logo: 'https://logo.clearbit.com/google.com', description: 'Search and Cloud computing leader.' },
    { id: '2', name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com', description: 'Software, services, and hardware giant.' },
    { id: '3', name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com', description: 'E-commerce and cloud infrastructure.' },
    { id: '4', name: 'Meta', logo: 'https://logo.clearbit.com/meta.com', description: 'Social media and metaverse pioneer.' },
    { id: '5', name: 'Apple', logo: 'https://logo.clearbit.com/apple.com', description: 'Consumer electronics and software.' },
  ],
  selectedCompany: null,
  currentSession: null,
  hrGender: 'female',
  hrTone: 'professional',
  resumeAnalysis: null,
  setCompanies: (companies) => set({ companies }),
  selectCompany: (company) => set({ selectedCompany: company }),
  startSession: (companyId) => set({ 
    currentSession: { 
      companyId, 
      step: 1, 
      resumeScore: null, 
      aptitudeScore: null, 
      codingScore: null, 
      hrScore: null 
    } 
  }),
  updateSession: (updates) => set((state) => ({
    currentSession: state.currentSession ? { ...state.currentSession, ...updates } : null
  })),
  resetSession: () => set({ currentSession: null, selectedCompany: null }),
  setHRSettings: (gender, tone) => set({ hrGender: gender, hrTone: tone }),
  setResumeAnalysis: (analysis) => set({ resumeAnalysis: analysis }),
}));
