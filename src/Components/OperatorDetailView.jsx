import React, { useState, useEffect } from 'react';
import { X, MapPin, Mail, User, Building, Calendar, TrendingUp, AlertTriangle, CheckCircle, Activity, Clock, Zap, ArrowLeft, Shield, Award, Target, MessageSquare, Check, XCircle } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const OperatorDetailView = ({ operator, onBack, getSeverityColor, getCategoryColor }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  
  // Feedback state
  const [feedback, setFeedback] = useState({
    verifiedFraudOperator: null, // true/false
    verifiedNonFraudOperator: null, // true/false
    verifiedMachineCloning: null, // 'checked-cloning' / 'checked-no-cloning' / null
    machineCloningSuspect: '', // remark text
    verifiedPacketAnomaly: null, // true/false
    oddHourPacketsAllowed: null // true/false
  });

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 50);
    window.scrollTo(0, 0);
  }, []);

  // Prepare radar chart data
  const radarData = [
    { 
      metric: 'Quality', 
      score: 100 - ((operator.qc_error_rate_current_month || 0) * 10),
      fullMark: 100 
    },
    { 
      metric: 'Speed', 
      score: Math.max(0, 100 - (operator.pkt_creation_duration_avg * 10)),
      fullMark: 100 
    },
    { 
      metric: 'Rejection', 
      score: 100 - ((operator.pkt_updt_rejection_rate || 0) * 5),
      fullMark: 100 
    },
    { 
      metric: 'Productivity', 
      score: Math.min(100, operator.pkt_create_daily_avg * 5),
      fullMark: 100 
    },
    { 
      metric: 'Compliance', 
      score: operator.daysSinceSync > 7 ? 50 : 100,
      fullMark: 100 
    },
    { 
      metric: 'Geographic', 
      score: 100 - (operator.outDistrictPercentage * 2),
      fullMark: 100 
    }
  ];

  // Risk meter calculation
  const riskPercentage = operator.risk_score * 100;
  const riskAngle = (riskPercentage / 100) * 180;

  const getRiskLevel = () => {
    if (riskPercentage >= 15) return { level: 'HIGH RISK', color: '#ef4444', bgColor: '#fee2e2' };
    if (riskPercentage >= 10) return { level: 'MEDIUM RISK', color: '#f59e0b', bgColor: '#fef3c7' };
    return { level: 'LOW RISK', color: '#10b981', bgColor: '#d1fae5' };
  };

  const riskLevel = getRiskLevel();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
        }
        .pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
      
        <div className="bg-gradient-to-r from-[#d2c5e7] via-[#e3d9f0] to-white text-gray-800 shadow-2xl backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <button 
                    onClick={onBack}
                    className="group bg-white/80 hover:bg-white rounded-xl px-5 py-2.5 transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg border border-[#d2c5e7]"
                  >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform text-[#9b7bb5]" />
                    <span className="font-semibold text-[#9b7bb5]">Back to List</span>
                  </button>
                  <div className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md animate-pulse ${
                    operator.is_active 
                      ? 'bg-green-500/40 border-2 border-green-600 text-green-800' 
                      : 'bg-red-500/40 border-2 border-red-600 text-red-800'
                  }`}>
                    {operator.is_active ? '● ACTIVE' : '● INACTIVE'}
                  </div>
                </div>
                <div className="space-y-3">
                  <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg animate-fade-in text-gray-800">
                    {operator.opt_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm backdrop-blur-sm bg-white/60 rounded-xl px-5 py-3 w-fit border border-[#d2c5e7] text-gray-700">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-mono font-semibold">{operator.opt_uid}</span>
                    </span>
                    <span className="text-[#d2c5e7]">|</span>
                    <span className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span>{operator.opt_ea}</span>
                    </span>
                    <span className="text-[#d2c5e7]">|</span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{operator.opt_district}, {operator.opt_state}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mt-6 border-t border-[#d2c5e7] border-opacity-60 pt-4 flex-wrap">
              {[
                { id: 'overview', label: 'Overview', icon: Shield },
                { id: 'performance', label: 'Performance', icon: TrendingUp },
                { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
                { id: 'details', label: 'Details', icon: User },
                { id: 'feedback', label: 'Feedback', icon: MessageSquare }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                    activeSection === tab.id 
                      ? 'bg-white text-[#9b7bb5] shadow-lg scale-105 border-2 border-[#d2c5e7]' 
                      : 'bg-[#e8dff2] hover:bg-[#d2c5e7] text-[#9b7bb5] hover:scale-102 border border-[#d2c5e7]'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overview & Performance Section */}
          {(activeSection === 'overview' || activeSection === 'performance') && (
            <div className="space-y-6 animate-fade-in">
              {/* Risk Meter and KPIs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Enhanced Risk Meter */}
                <div className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-gray-100 hover:shadow-3xl transition-all duration-500 relative overflow-hidden pulse-glow">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 opacity-10 rounded-full blur-3xl"></div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 relative z-10">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Shield className="w-6 h-6 text-indigo-600" />
                    </div>
                    Risk Assessment
                  </h3>
                  
                  {/* Semi-circle meter */}
                  <div className="relative w-72 h-36 mx-auto mb-6">
                    <svg viewBox="0 0 200 100" className="w-full h-full drop-shadow-lg">
                      <defs>
                        <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                          <stop offset="50%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      <path d="M 20 80 A 80 80 0 0 1 180 80" fill="none" stroke="#e5e7eb" strokeWidth="22" strokeLinecap="round" />
                      <path d="M 20 80 A 80 80 0 0 1 180 80" fill="none" stroke="url(#riskGradient)" strokeWidth="22" strokeLinecap="round" opacity="0.3" />
                      <path 
                        d="M 20 80 A 80 80 0 0 1 180 80" 
                        fill="none" 
                        stroke={riskLevel.color} 
                        strokeWidth="22" 
                        strokeLinecap="round" 
                        strokeDasharray={`${(riskAngle / 180) * 251.2} 251.2`}
                        filter="url(#glow)"
                      />
                      <line x1="100" y1="80" x2={100 + Math.cos((Math.PI - (riskAngle * Math.PI / 180))) * 70} y2={80 - Math.sin((Math.PI - (riskAngle * Math.PI / 180))) * 70} stroke={riskLevel.color} strokeWidth="4" strokeLinecap="round" />
                      <circle cx="100" cy="80" r="6" fill={riskLevel.color} filter="url(#glow)" />
                    </svg>
                  </div>

                  <div className="text-center relative z-10">
                    <div className="text-5xl font-extrabold mb-3 drop-shadow" style={{ color: riskLevel.color }}>
                      {riskPercentage.toFixed(1)}%
                    </div>
                    <div className="inline-block px-6 py-3 rounded-full font-bold text-base shadow-lg" style={{ backgroundColor: riskLevel.bgColor, color: riskLevel.color }}>
                      {riskLevel.level}
                    </div>
                    <div className="mt-5 p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">Anomaly Score</div>
                      <div className="text-3xl font-bold text-gray-900">{operator.anomalyScore}<span className="text-lg text-gray-500">/100</span></div>
                    </div>
                  </div>
                </div>

                {/* Enhanced KPIs */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <div className="p-2 bg-[#e8dff2] rounded-lg">
                      <Award className="w-6 h-6 text-[#9b7bb5]" />
                    </div>
                    Key Performance Indicators
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-[#f5f2f8] to-[#e8dff2] border-l-4 border-[#d2c5e7] rounded-xl p-5 hover:scale-105 transition-transform duration-300 shadow-md">
                      <div className="flex items-center gap-2 text-[#9b7bb5] mb-2">
                        <Activity className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wide">Daily Production</span>
                      </div>
                      <div className="text-3xl font-extrabold text-[#7a5f93]">{operator.pkt_create_daily_avg}</div>
                      <div className="text-xs text-[#9b7bb5] font-medium mt-1">packets/day</div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500 rounded-xl p-5 hover:scale-105 transition-transform duration-300 shadow-md">
                      <div className="flex items-center gap-2 text-red-700 mb-2">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wide">Rejection Rate</span>
                      </div>
                      <div className="text-3xl font-extrabold text-red-900">{operator.pkt_updt_rejection_rate || 0}%</div>
                      <div className="text-xs text-red-600 font-medium mt-1">update rejections</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 rounded-xl p-5 hover:scale-105 transition-transform duration-300 shadow-md">
                      <div className="flex items-center gap-2 text-green-700 mb-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wide">QC Error Rate</span>
                      </div>
                      <div className="text-3xl font-extrabold text-green-900">{operator.qc_error_rate_current_month || 0}%</div>
                      <div className="text-xs text-green-600 font-medium mt-1">current month</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500 rounded-xl p-5 hover:scale-105 transition-transform duration-300 shadow-md">
                      <div className="flex items-center gap-2 text-purple-700 mb-2">
                        <Clock className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wide">Avg Duration</span>
                      </div>
                      <div className="text-3xl font-extrabold text-purple-900">{operator.pkt_creation_duration_avg}</div>
                      <div className="text-xs text-purple-600 font-medium mt-1">minutes/packet</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-100 via-yellow-100 to-orange-100 border-l-4 border-orange-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-orange-800 mb-2">
                          <Target className="w-5 h-5" />
                          <span className="text-sm font-bold uppercase tracking-wide">Anomalies Detected</span>
                        </div>
                        <div className="text-4xl font-extrabold text-orange-900">{operator.anomalyCount}</div>
                        <div className="text-xs text-orange-700 font-medium mt-1">Issues require attention</div>
                      </div>
                      <div className="text-7xl opacity-20">⚠️</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Radar Chart */}
              {activeSection === 'performance' && (
                <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:shadow-2xl transition-shadow duration-300 animate-fade-in">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    Performance Metrics Radar
                  </h3>
                  <ResponsiveContainer width="100%" height={450}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e5e7eb" strokeWidth={2} />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#374151', fontSize: 15, fontWeight: 700 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 13 }} />
                      <Radar name="Performance" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.7} strokeWidth={3} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #8b5cf6', borderRadius: '12px', padding: '12px' }} formatter={(value) => [`${value.toFixed(1)}`, 'Score']} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="text-center text-sm text-gray-600 mt-4 bg-gray-50 p-3 rounded-lg">
                    💡 Higher scores indicate better performance in each metric
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Details Section */}
          {activeSection === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              {/* Operator Info */}
              <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 border-b pb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  Operator Information
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-gray-600 font-medium">Operator ID</span>
                    <span className="font-bold text-gray-900">{operator.opt_id}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-gray-600 font-medium">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${operator.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {operator.is_active ? '● Active' : '● Inactive'}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Mail className="w-4 h-4" />
                      <span className="font-medium">Email</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm break-all">{operator.opt_email}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">Location</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="font-semibold text-gray-900">{operator.opt_district}, {operator.opt_state}</div>
                      <div className="text-gray-700">PIN: <span className="font-bold">{operator.opt_pincode}</span></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-gray-600 font-medium">Registrar</span>
                    <span className="font-bold text-gray-900">{operator.opt_reg}</span>
                  </div>
                </div>
              </div>

              {/* Machine Status */}
              <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 border-b pb-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Zap className="w-5 h-5 text-yellow-600" />
                  </div>
                  Machine Status
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-gray-600 font-medium">Machine Count</span>
                    <span className="font-bold text-2xl text-gray-900">{operator.machine_count}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 font-medium">Last Sync</span>
                      <span className={`font-bold text-lg ${operator.daysSinceSync > 7 ? 'text-red-600' : 'text-green-600'}`}>
                        {operator.daysSinceSync} days ago
                      </span>
                    </div>
                    {operator.daysSinceSync > 7 && (
                      <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-500 rounded text-xs text-red-700">
                        ⚠️ Machine sync is overdue - requires immediate attention
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-gray-600 font-medium">Sync Duration</span>
                    <span className="font-bold text-gray-900">{operator.machine_avg_sync_duration_mins?.toFixed(0) || 'N/A'} min</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="text-gray-600 font-medium mb-2">Last Sync Time</div>
                    <div className="font-semibold text-gray-900 text-sm">{new Date(operator.machine_last_sync_time).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Anomalies Section */}
          {activeSection === 'anomalies' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  Detected Anomalies
                </h3>
                {operator.anomalies.length > 0 ? (
                  <div className="space-y-4">
                    {operator.anomalies.map((anomaly, idx) => (
                      <div key={idx} className={`p-5 rounded-xl border-l-4 hover:scale-102 transition-all duration-300 shadow-md ${
                        anomaly.severity === 'high' ? 'bg-red-50 border-red-500' :
                        anomaly.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                        anomaly.severity === 'positive' ? 'bg-green-50 border-green-500' :
                        'bg-gray-50 border-gray-400'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-lg text-gray-900">{anomaly.type}</h4>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getCategoryColor(anomaly.category)} text-white shadow-sm`}>
                              {anomaly.category}
                            </span>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-extrabold shadow-md ${
                            anomaly.severity === 'high' ? 'bg-red-100 text-red-700 border-2 border-red-300' :
                            anomaly.severity === 'medium' ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300' :
                            anomaly.severity === 'positive' ? 'bg-green-100 text-green-700 border-2 border-green-300' :
                            'bg-gray-100 text-gray-700 border-2 border-gray-300'
                          }`}>
                            {anomaly.value}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{anomaly.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
                    <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-500" />
                    <p className="text-xl font-bold text-gray-900 mb-2">No anomalies detected</p>
                    <p className="text-sm text-gray-600">This operator is performing within normal parameters</p>
                  </div>
                )}
              </div>

              {/* QC Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-[#f5f2f8] to-[#e8dff2] rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform duration-300">
                  <div className="text-sm text-[#9b7bb5] mb-2 font-bold uppercase tracking-wide">QC Processed</div>
                  <div className="text-4xl font-extrabold text-[#7a5f93]">{operator.qc_disp_count}</div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform duration-300">
                  <div className="text-sm text-red-700 mb-2 font-bold uppercase tracking-wide">QC Errors</div>
                  <div className="text-4xl font-extrabold text-red-900">{operator.qc_error_count}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform duration-300">
                  <div className="text-sm text-purple-700 mb-2 font-bold uppercase tracking-wide">Out-District</div>
                  <div className="text-4xl font-extrabold text-purple-900">{operator.pkt_outdistrict_daily_avg}</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform duration-300">
                  <div className="text-sm text-orange-700 mb-2 font-bold uppercase tracking-wide">DOB Changes</div>
                  <div className="text-4xl font-extrabold text-orange-900">{operator.updt_child_to_adult_dob_count}</div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Section */}
          {activeSection === 'feedback' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-[#e8dff2] to-[#d2c5e7] rounded-lg">
                    <MessageSquare className="w-6 h-6 text-[#9b7bb5]" />
                  </div>
                  Operator Verification & Feedback
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Please review and provide feedback on the following verification parameters for this operator.
                </p>

                <div className="space-y-6">
                  {/* 1. Verified Fraud Operator */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-white to-gray-50">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">1</div>
                      Verified Fraud Operator
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">Has this operator been verified as fraudulent?</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setFeedback({...feedback, verifiedFraudOperator: true})}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          feedback.verifiedFraudOperator === true
                            ? 'bg-red-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-300'
                        }`}
                      >
                        <XCircle className="w-5 h-5" />
                        Yes - Fraud Detected
                      </button>
                      <button
                        onClick={() => setFeedback({...feedback, verifiedFraudOperator: false})}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          feedback.verifiedFraudOperator === false
                            ? 'bg-green-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-300'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                        No - Not Fraud
                      </button>
                    </div>
                  </div>

                  {/* 2. Verified Non-Fraud Operator */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-white to-gray-50">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">2</div>
                      Verified Non-Fraud Operator
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">Has this operator been verified as legitimate/non-fraudulent?</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setFeedback({...feedback, verifiedNonFraudOperator: true})}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          feedback.verifiedNonFraudOperator === true
                            ? 'bg-green-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-300'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                        Yes - Verified Legitimate
                      </button>
                      <button
                        onClick={() => setFeedback({...feedback, verifiedNonFraudOperator: false})}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          feedback.verifiedNonFraudOperator === false
                            ? 'bg-red-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-300'
                        }`}
                      >
                        <XCircle className="w-5 h-5" />
                        No - Not Verified
                      </button>
                    </div>
                  </div>

                  {/* 3. Verified Machine Cloning */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-white to-gray-50">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">3</div>
                      Verified Machine Cloning
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">Check if operator is found to be cloning machines</p>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => setFeedback({...feedback, verifiedMachineCloning: 'checked-cloning'})}
                          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                            feedback.verifiedMachineCloning === 'checked-cloning'
                              ? 'bg-red-500 text-white shadow-lg scale-105'
                              : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-300'
                          }`}
                        >
                          <AlertTriangle className="w-5 h-5" />
                          Checked - Cloning Detected
                        </button>
                        <button
                          onClick={() => setFeedback({...feedback, verifiedMachineCloning: 'checked-no-cloning'})}
                          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                            feedback.verifiedMachineCloning === 'checked-no-cloning'
                              ? 'bg-green-500 text-white shadow-lg scale-105'
                              : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-300'
                          }`}
                        >
                          <Check className="w-5 h-5" />
                          Checked - No Cloning
                        </button>
                      </div>
                      
                      {feedback.verifiedMachineCloning === 'checked-cloning' && (
                        <div className="mt-4 animate-fade-in">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Cloning Suspect Remarks <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={feedback.machineCloningSuspect}
                            onChange={(e) => setFeedback({...feedback, machineCloningSuspect: e.target.value})}
                            placeholder="Please provide detailed remarks about the machine cloning suspicion..."
                            rows={4}
                            className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {feedback.machineCloningSuspect.length} characters
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4. Verified Packet Anomaly */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-white to-gray-50">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">4</div>
                      Verified Packet Anomaly
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">Have packet anomalies been verified for this operator?</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setFeedback({...feedback, verifiedPacketAnomaly: true})}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          feedback.verifiedPacketAnomaly === true
                            ? 'bg-red-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-300'
                        }`}
                      >
                        <AlertTriangle className="w-5 h-5" />
                        Yes - Anomaly Verified
                      </button>
                      <button
                        onClick={() => setFeedback({...feedback, verifiedPacketAnomaly: false})}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          feedback.verifiedPacketAnomaly === false
                            ? 'bg-green-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-300'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                        No - No Anomaly
                      </button>
                    </div>
                  </div>

                  {/* 5. Odd Hour Packets Allowed */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-white to-gray-50">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">5</div>
                      Odd Hour Packets Allowed
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">Is this operator allowed to create packets during odd hours?</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setFeedback({...feedback, oddHourPacketsAllowed: true})}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          feedback.oddHourPacketsAllowed === true
                            ? 'bg-green-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-300'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                        Yes - Allowed
                      </button>
                      <button
                        onClick={() => setFeedback({...feedback, oddHourPacketsAllowed: false})}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          feedback.oddHourPacketsAllowed === false
                            ? 'bg-red-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-300'
                        }`}
                      >
                        <XCircle className="w-5 h-5" />
                        No - Not Allowed
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end gap-4 border-t pt-6">
                  <button
                    onClick={() => setFeedback({
                      verifiedFraudOperator: null,
                      verifiedNonFraudOperator: null,
                      verifiedMachineCloning: null,
                      machineCloningSuspect: '',
                      verifiedPacketAnomaly: null,
                      oddHourPacketsAllowed: null
                    })}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-all duration-300"
                  >
                    Reset Feedback
                  </button>
                  <button
                    onClick={() => {
                      console.log('Feedback submitted:', feedback);
                      alert('Feedback submitted successfully!');
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-[#9b7bb5] to-[#d2c5e7] hover:from-[#7a5f93] hover:to-[#9b7bb5] text-white rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>

              {/* Feedback Summary Card */}
              <div className="bg-gradient-to-br from-[#f5f2f8] to-[#e8dff2] rounded-2xl shadow-lg p-6 border border-[#d2c5e7]">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#9b7bb5]" />
                  Feedback Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">Fraud Operator:</span>
                    <span className={`font-bold ${
                      feedback.verifiedFraudOperator === true ? 'text-red-600' :
                      feedback.verifiedFraudOperator === false ? 'text-green-600' :
                      'text-gray-400'
                    }`}>
                      {feedback.verifiedFraudOperator === true ? 'Yes' : 
                       feedback.verifiedFraudOperator === false ? 'No' : 'Not Set'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">Non-Fraud Verified:</span>
                    <span className={`font-bold ${
                      feedback.verifiedNonFraudOperator === true ? 'text-green-600' :
                      feedback.verifiedNonFraudOperator === false ? 'text-red-600' :
                      'text-gray-400'
                    }`}>
                      {feedback.verifiedNonFraudOperator === true ? 'Yes' : 
                       feedback.verifiedNonFraudOperator === false ? 'No' : 'Not Set'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">Machine Cloning:</span>
                    <span className={`font-bold ${
                      feedback.verifiedMachineCloning === 'checked-cloning' ? 'text-red-600' :
                      feedback.verifiedMachineCloning === 'checked-no-cloning' ? 'text-green-600' :
                      'text-gray-400'
                    }`}>
                      {feedback.verifiedMachineCloning === 'checked-cloning' ? 'Detected' : 
                       feedback.verifiedMachineCloning === 'checked-no-cloning' ? 'Not Detected' : 'Not Checked'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">Packet Anomaly:</span>
                    <span className={`font-bold ${
                      feedback.verifiedPacketAnomaly === true ? 'text-red-600' :
                      feedback.verifiedPacketAnomaly === false ? 'text-green-600' :
                      'text-gray-400'
                    }`}>
                      {feedback.verifiedPacketAnomaly === true ? 'Verified' : 
                       feedback.verifiedPacketAnomaly === false ? 'Not Found' : 'Not Set'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg md:col-span-2">
                    <span className="font-medium text-gray-700">Odd Hour Packets:</span>
                    <span className={`font-bold ${
                      feedback.oddHourPacketsAllowed === true ? 'text-green-600' :
                      feedback.oddHourPacketsAllowed === false ? 'text-red-600' :
                      'text-gray-400'
                    }`}>
                      {feedback.oddHourPacketsAllowed === true ? 'Allowed' : 
                       feedback.oddHourPacketsAllowed === false ? 'Not Allowed' : 'Not Set'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperatorDetailView;
