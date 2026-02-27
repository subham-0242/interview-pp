import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Brain, 
  Code, 
  MessageSquare,
  ChevronRight,
  Upload
} from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { motion } from 'motion/react';

export default function AdminCMS() {
  const { companies } = useAppStore();
  const [activeTab, setActiveTab] = useState<'companies' | 'questions'>('companies');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Content Management</h1>
          <p className="text-zinc-500 mt-1">Manage companies, question banks, and test mappings.</p>
        </div>
        <button className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New {activeTab === 'companies' ? 'Company' : 'Question'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-zinc-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('companies')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'companies' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          Companies
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'questions' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          Question Bank
        </button>
      </div>

      {activeTab === 'companies' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <motion.div 
              key={company.id}
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-50 p-3">
                  <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400 hover:text-zinc-900">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-zinc-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">{company.name}</h3>
              <p className="text-sm text-zinc-500 mb-6 line-clamp-2">{company.description}</p>
              
              <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-700">APT</div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-700">COD</div>
                  <div className="w-8 h-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-orange-700">HR</div>
                </div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">3 Question Sets</span>
              </div>
            </motion.div>
          ))}
          
          <button className="border-2 border-dashed border-zinc-200 rounded-[32px] p-6 flex flex-col items-center justify-center gap-4 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-bold text-zinc-400 group-hover:text-emerald-600">Add Company</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search questions..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm"
              />
            </div>
          </div>
          <div className="divide-y divide-zinc-100">
            {[
              { type: 'Aptitude', title: 'Logical Reasoning Set A', questions: 20, company: 'Google' },
              { type: 'Coding', title: 'Dynamic Programming Basics', questions: 3, company: 'Amazon' },
              { type: 'HR', title: 'Behavioral Questions v2', questions: 10, company: 'Meta' },
            ].map((set, i) => (
              <div key={i} className="p-6 hover:bg-zinc-50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    set.type === 'Aptitude' ? 'bg-emerald-50 text-emerald-600' :
                    set.type === 'Coding' ? 'bg-blue-50 text-blue-600' :
                    'bg-orange-50 text-orange-600'
                  }`}>
                    {set.type === 'Aptitude' ? <Brain className="w-6 h-6" /> :
                     set.type === 'Coding' ? <Code className="w-6 h-6" /> :
                     <MessageSquare className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900">{set.title}</h4>
                    <p className="text-xs text-zinc-500 font-medium">{set.questions} Questions • Linked to {set.company}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-zinc-200">
                    <Edit3 className="w-4 h-4 text-zinc-400" />
                  </button>
                  <button className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-zinc-200">
                    <Trash2 className="w-4 h-4 text-zinc-400" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-900 transition-colors self-center ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
