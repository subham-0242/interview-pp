import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  ArrowUpRight,
  TrendingUp,
  Clock,
  Mail,
  Phone,
  MapPin,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart
} from 'recharts';

const students = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', score: 88, tests: 12, lastActive: '2 hours ago' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', score: 72, tests: 8, lastActive: '5 hours ago' },
  { id: '3', name: 'Charlie Davis', email: 'charlie@example.com', score: 94, tests: 15, lastActive: '1 day ago' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', score: 81, tests: 10, lastActive: '3 days ago' },
];

const radarData = [
  { subject: 'Aptitude', A: 85, fullMark: 100 },
  { subject: 'Coding', A: 70, fullMark: 100 },
  { subject: 'Soft Skills', A: 90, fullMark: 100 },
  { subject: 'Resume', A: 75, fullMark: 100 },
];

export default function AdminAnalytics() {
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedStudent) {
    return (
      <div className="space-y-8">
        <button 
          onClick={() => setSelectedStudent(null)}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Students
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-3xl font-bold mx-auto mb-4 border-4 border-white shadow-lg">
                {selectedStudent.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">{selectedStudent.name}</h2>
              <p className="text-zinc-500 mb-6">{selectedStudent.email}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 p-4 rounded-2xl">
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Avg Score</p>
                  <p className="text-2xl font-bold text-zinc-900">{selectedStudent.score}%</p>
                </div>
                <div className="bg-zinc-50 p-4 rounded-2xl">
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Tests Taken</p>
                  <p className="text-2xl font-bold text-zinc-900">{selectedStudent.tests}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm space-y-4">
              <h3 className="font-bold text-zinc-900">Contact Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-zinc-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{selectedStudent.email}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+1 (555) 000-0000</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Deep Dive */}
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm">
                <h3 className="font-bold text-zinc-900 mb-6">Skill Analysis</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#e4e4e7" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 12 }} />
                      <Radar
                        name="Skills"
                        dataKey="A"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm">
                <h3 className="font-bold text-zinc-900 mb-6">Test History</h3>
                <div className="space-y-4">
                  {[
                    { company: 'Google', score: 85, date: 'Oct 12, 2023' },
                    { company: 'Meta', score: 92, date: 'Oct 05, 2023' },
                    { company: 'Amazon', score: 78, date: 'Sep 28, 2023' },
                  ].map((test, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
                      <div>
                        <p className="font-bold text-zinc-900">{test.company}</p>
                        <p className="text-xs text-zinc-500">{test.date}</p>
                      </div>
                      <p className="text-lg font-bold text-emerald-600">{test.score}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Student Analytics</h1>
          <p className="text-zinc-500 mt-1">Monitor and analyze student performance across the platform.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white px-4 py-2 rounded-xl border border-zinc-200 text-sm font-medium flex items-center gap-2 hover:bg-zinc-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 text-zinc-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Avg Score</th>
                <th className="px-6 py-4">Tests</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredStudents.map((student) => (
                <tr 
                  key={student.id} 
                  className="hover:bg-zinc-50/50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedStudent(student)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">{student.name}</p>
                        <p className="text-xs text-zinc-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500" 
                          style={{ width: `${student.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-zinc-900">{student.score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 font-medium">{student.tests} tests</td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{student.lastActive}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors">
                      <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
