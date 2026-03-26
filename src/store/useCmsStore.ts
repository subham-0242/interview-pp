import { create } from 'zustand';
import { supabaseService } from '../services/supabaseService';

export type RoundType = 'resume' | 'aptitude' | 'coding' | 'hr' | 'gd';

export interface InterviewRound {
  id: string;
  type: RoundType;
  duration: number; // in minutes
  cutoff?: number; // percentage
  config?: {
    topics?: string[];
    questionCount?: number;
  };
}

export interface AptitudeQuestion {
  id: string;
  qn: string;
  question: string;
  options: string[];
  answer: string;
  topic: string;
}

export interface CodingQuestion {
  id: string;
  companyId: string;
  title: string;
  problemStatement: string;
  boilerplate: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  targetRole: string;
  workflow: InterviewRound[];
}

interface CmsState {
  companies: Company[];
  globalAptitudeBank: AptitudeQuestion[];
  codingBank: CodingQuestion[];
  isLoading: boolean;
  error: string | null;
  
  fetchInitialData: () => Promise<void>;
  addCompany: (company: Omit<Company, 'id'>) => Promise<void>;
  updateCompany: (id: string, company: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  setGlobalAptitudeBank: (questions: AptitudeQuestion[]) => Promise<void>;
  addCodingQuestion: (question: Omit<CodingQuestion, 'id'>) => Promise<void>;
  deleteCodingQuestion: (id: string) => Promise<void>;
}

export const useCmsStore = create<CmsState>((set, get) => ({
  companies: [],
  globalAptitudeBank: [],
  codingBank: [],
  isLoading: false,
  error: null,

  fetchInitialData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [companies, aptitudeQuestions, codingQuestions] = await Promise.all([
        supabaseService.getCompanies(),
        supabaseService.getAptitudeQuestions(),
        supabaseService.getCodingQuestions()
      ]);
      set({ 
        companies, 
        globalAptitudeBank: aptitudeQuestions, 
        codingBank: codingQuestions,
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addCompany: async (company) => {
    set({ isLoading: true });
    try {
      const newCompany = await supabaseService.saveCompany(company);
      set((state) => ({
        companies: [...state.companies, newCompany],
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateCompany: async (id, company) => {
    set({ isLoading: true });
    try {
      const updatedCompany = await supabaseService.updateCompany(id, company);
      set((state) => ({
        companies: state.companies.map((c) => (c.id === id ? updatedCompany : c)),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteCompany: async (id) => {
    set({ isLoading: true });
    try {
      await supabaseService.deleteCompany(id);
      set((state) => ({
        companies: state.companies.filter((c) => c.id !== id),
        codingBank: state.codingBank.filter((q) => q.companyId !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setGlobalAptitudeBank: async (questions) => {
    set({ isLoading: true });
    try {
      // For bulk upload, we might want a more efficient way, but for now:
      const savedQuestions = await supabaseService.saveAptitudeQuestions(questions);
      set({ globalAptitudeBank: savedQuestions, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addCodingQuestion: async (question) => {
    set({ isLoading: true });
    try {
      const newQuestion = await supabaseService.saveCodingQuestion(question);
      set((state) => ({
        codingBank: [...state.codingBank, newQuestion],
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteCodingQuestion: async (id) => {
    set({ isLoading: true });
    try {
      await supabaseService.deleteCodingQuestion(id);
      set((state) => ({
        codingBank: state.codingBank.filter((q) => q.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
