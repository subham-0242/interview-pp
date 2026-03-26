import { supabase } from '../lib/supabase';
import { Company, AptitudeQuestion, CodingQuestion } from '../store/useCmsStore';

export const supabaseService = {
  // Companies
  async getCompanies() {
    const { data, error } = await supabase
      .from('companies')
      .select('*');
    if (error) throw error;
    return data as Company[];
  },

  async saveCompany(company: Omit<Company, 'id'>) {
    const { data, error } = await supabase
      .from('companies')
      .insert([company])
      .select();
    if (error) throw error;
    return data[0] as Company;
  },

  async updateCompany(id: string, company: Partial<Company>) {
    const { data, error } = await supabase
      .from('companies')
      .update(company)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0] as Company;
  },

  async deleteCompany(id: string) {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Aptitude Questions
  async getAptitudeQuestions() {
    const { data, error } = await supabase
      .from('aptitude_questions')
      .select('*');
    if (error) throw error;
    return data as AptitudeQuestion[];
  },

  async saveAptitudeQuestions(questions: Omit<AptitudeQuestion, 'id'>[]) {
    const { data, error } = await supabase
      .from('aptitude_questions')
      .insert(questions)
      .select();
    if (error) throw error;
    return data as AptitudeQuestion[];
  },

  // Coding Questions
  async getCodingQuestions() {
    const { data, error } = await supabase
      .from('coding_questions')
      .select('*');
    if (error) throw error;
    return data as CodingQuestion[];
  },

  async saveCodingQuestion(question: Omit<CodingQuestion, 'id'>) {
    const { data, error } = await supabase
      .from('coding_questions')
      .insert([question])
      .select();
    if (error) throw error;
    return data[0] as CodingQuestion;
  },

  async deleteCodingQuestion(id: string) {
    const { error } = await supabase
      .from('coding_questions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
