import React, { useState, useEffect } from 'react';
import { X, MapPin, Mail, User, Building, Calendar, TrendingUp, AlertTriangle, CheckCircle, Activity, Clock, Zap, ArrowLeft, Shield, Award, Target, MessageSquare, Check, XCircle, FileText, Phone, Hash, MapPinned, CreditCard, CheckSquare, XSquare, Timer } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import EnrollmentReview from './EnrollmentReview';

const OperatorDetailView = ({ operator, onBack, getSeverityColor, getCategoryColor }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('details');
  
  // Feedback state
  const [feedback, setFeedback] = useState({
    verifiedFraudOperator: null, // true/false
    verifiedLegitimateOperator: null, // true/false
    workedWithClonedMachine: null, // true/false
    unsystematicBiometricCapture: null, // true/false
    packetAnomalyIdentified: null // true/false
  });

  // Document upload and remarks state
  const [documents, setDocuments] = useState({
    fraudulent: null,
    clonedMachine: null,
    biometricCapture: null,
    packetAnomaly: null
  });

  const [remarks, setRemarks] = useState({
    fraudulent: '',
    legitimate: '',
    clonedMachine: '',
    biometricCapture: '',
    packetAnomaly: ''
  });

  // Feedback history state
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  
  // Packet review data state
  const [packetData, setPacketData] = useState([]);
  const [anomalyData, setAnomalyData] = useState({});
  const [showAnomalyModal, setShowAnomalyModal] = useState(false);
  const [selectedPacket, setSelectedPacket] = useState(null);
  const [anomalyRemarks, setAnomalyRemarks] = useState('');

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 50);
    window.scrollTo(0, 0);
    loadFeedbackHistory();
    loadPacketData();
  }, []);

  // Load existing feedback history
  const loadFeedbackHistory = () => {
    try {
      const existingFeedback = localStorage.getItem(`feedback_${operator.opt_id || operator.operator_id}`);
      if (existingFeedback) {
        const parsedFeedback = JSON.parse(existingFeedback);
        setFeedbackHistory(Array.isArray(parsedFeedback) ? parsedFeedback : [parsedFeedback]);
      }
    } catch (error) {
      console.error('Error loading feedback history:', error);
    }
  };

  // Load packet review data
  const loadPacketData = async () => {
    try {
      const response = await fetch('/src/resources/packetReview.json');
      const data = await response.json();
      const operatorId = operator.opt_id || operator.operator_id;
      if (data[operatorId]) {
        setPacketData(data[operatorId]);
      }
    } catch (error) {
      console.error('Error loading packet data:', error);
      // Fallback to local data if fetch fails
      try {
        const packetReviewData = require('../resources/packetReview.json');
        const operatorId = operator.opt_id || operator.operator_id;
        if (packetReviewData[operatorId]) {
          setPacketData(packetReviewData[operatorId]);
        }
      } catch (importError) {
        console.error('Error importing packet data:', importError);
      }
    }
  };

  // Helper function to calculate days since last sync
  const calculateDaysSince = (syncTime) => {
    if (!syncTime) return 'N/A';
    try {
      const now = new Date();
      const sync = new Date(syncTime);
      const diffTime = Math.abs(now - sync);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (error) {
      return 'N/A';
    }
  };

  // Helper function to format sync duration
  const formatSyncDuration = (seconds) => {
    if (!seconds || seconds === 0) return 'N/A';
    const numSeconds = parseInt(seconds);
    if (isNaN(numSeconds)) return 'N/A';
    if (numSeconds < 60) return `${numSeconds} sec`;
    if (numSeconds < 3600) return `${Math.round(numSeconds / 60)} min`;
    if (numSeconds < 86400) return `${Math.round(numSeconds / 3600)} hr`;
    return `${Math.round(numSeconds / 86400)} days`;
  };

  // Smart feedback handler with logical validation
  const handleSmartFeedback = (key, value) => {
    setFeedback(prev => {
      const newFeedback = { ...prev, [key]: value };
      
      // Smart validation logic
      if (key === 'verifiedFraudOperator' && value === true) {
        // If marked as fraudulent, cannot be legitimate
        newFeedback.verifiedLegitimateOperator = false;
      } else if (key === 'verifiedLegitimateOperator' && value === true) {
        // If marked as legitimate, cannot be fraudulent
        newFeedback.verifiedFraudOperator = false;
      }
      
      return newFeedback;
    });
  };

  // Handle document upload
  const handleDocumentUpload = (category, file) => {
    if (file && file.type === 'application/pdf') {
      setDocuments(prev => ({ ...prev, [category]: file }));
    } else {
      alert('Please upload only PDF files.');
    }
  };

  // Handle remarks change
  const handleRemarksChange = (category, value) => {
    setRemarks(prev => ({ ...prev, [category]: value }));
  };

  // Submit feedback with JSON creation
  const submitFeedback = () => {
    const feedbackData = {
      operatorId: operator.opt_id || operator.operator_id,
      username: 'Current User', // Replace with actual username from auth context
      timestamp: new Date().toISOString(),
      feedback: feedback,
      remarks: remarks,
      documents: Object.keys(documents).reduce((acc, key) => {
        if (documents[key]) {
          acc[key] = {
            name: documents[key].name,
            size: documents[key].size,
            uploadTime: new Date().toISOString()
          };
        }
        return acc;
      }, {})
    };

    try {
      // Get existing feedback or create new array
      const existingFeedback = localStorage.getItem(`feedback_${feedbackData.operatorId}`);
      let feedbackArray = [];
      
      if (existingFeedback) {
        const parsed = JSON.parse(existingFeedback);
        feedbackArray = Array.isArray(parsed) ? parsed : [parsed];
      }
      
      // Add new feedback
      feedbackArray.push(feedbackData);
      
      // Save to localStorage (in real app, this would be sent to server)
      localStorage.setItem(`feedback_${feedbackData.operatorId}`, JSON.stringify(feedbackArray));
      
      console.log('Feedback JSON created:', feedbackData);
      alert('Feedback submitted successfully!');
      
      // Reset form
      setFeedback({
        verifiedFraudOperator: null,
        verifiedLegitimateOperator: null,
        workedWithClonedMachine: null,
        unsystematicBiometricCapture: null,
        packetAnomalyIdentified: null
      });
      setRemarks({
        fraudulent: '',
        legitimate: '',
        clonedMachine: '',
        biometricCapture: '',
        packetAnomaly: ''
      });
      setDocuments({
        fraudulent: null,
        clonedMachine: null,
        biometricCapture: null,
        packetAnomaly: null
      });
      
      // Reload feedback history
      loadFeedbackHistory();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    }
  };

  // Handle anomaly marking
  const handleMarkAnomaly = (packet) => {
    setSelectedPacket(packet);
    setAnomalyRemarks('');
    setShowAnomalyModal(true);
  };

  const submitAnomalyReport = () => {
    if (!anomalyRemarks.trim()) {
      alert('Please provide remarks before submitting the anomaly report.');
      return;
    }

    const anomalyReport = {
      packetId: selectedPacket.pkt_eid,
      operatorId: operator.opt_id || operator.operator_id,
      remarks: anomalyRemarks,
      reportedBy: 'Current User', // Replace with actual user
      reportedAt: new Date().toISOString(),
      packetDetails: selectedPacket
    };

    // Store anomaly data
    const newAnomalyData = {
      ...anomalyData,
      [selectedPacket.pkt_eid]: anomalyReport
    };
    setAnomalyData(newAnomalyData);

    // Save to localStorage
    localStorage.setItem(`anomalies_${operator.opt_id || operator.operator_id}`, JSON.stringify(newAnomalyData));

    console.log('Anomaly reported:', anomalyReport);
    alert('Anomaly reported successfully!');
    
    setShowAnomalyModal(false);
    setSelectedPacket(null);
    setAnomalyRemarks('');
  };

  // Check for high packet production anomaly
  const pktsPerDay = parseInt(operator.pkt_per_day) || 0;
  const hasHighPacketAnomaly = pktsPerDay > 150;

  // Define risk threshold (0.5 or higher is considered anomaly)
  const riskThreshold = 0.5;

  // Check for various risk-based anomalies
  const detectedAnomalies = [
    {
      key: 'work_machinesync_risk',
      value: parseFloat(operator.work_machinesync_risk) || 0,
      title: 'Stale Machine Sync',
      category: 'Work Pattern',
      description: 'The operator\'s average sync durations are more than 48 hours which exceeds the expected sync frequency. This indicates potential machine connectivity issues or irregular work patterns.'
    },
    {
      key: 'packet_mobchange_risk',
      value: parseFloat(operator.packet_mobchange_risk) || 0,
      title: 'Suspicious Mobile Update Packets',
      category: 'Packet Integrity',
      description: 'High frequency of mobile number changes in packets processed by this operator, which may indicate fraudulent activity or data manipulation.'
    },
    {
      key: 'packet_namechange_risk',
      value: parseFloat(operator.packet_namechange_risk) || 0,
      title: 'Suspicious Name Change Packets',
      category: 'Packet Integrity',
      description: 'Unusual pattern of name changes in packets processed by this operator, potentially indicating identity fraud or document tampering.'
    },
    {
      key: 'document_pob_risk',
      value: parseFloat(operator.document_pob_risk) || 0,
      title: 'Unverified Proof of Birth Documents',
      category: 'Document Verification',
      description: 'High number of proof of birth documents that are declared by the operator but not properly verified, raising concerns about document authenticity.'
    },
    {
      key: 'biometric_mfc_risk',
      value: parseFloat(operator.biometric_mfc_risk) || 0,
      title: 'Unsystematic Biometric Capture',
      category: 'Biometric Quality',
      description: 'Biometric packets found with unsystematic capture patterns, indicating potential quality issues or fraudulent biometric submission.'
    },
    {
      key: 'packet_outstate_risk',
      value: parseFloat(operator.packet_outstate_risk) || 0,
      title: 'Out of State Enrollments',
      category: 'Performance',
      description: 'High number of out-of-state enrollments processed by this operator, which may indicate jurisdiction violations or fraudulent activities.'
    },
    {
      key: 'packet_hof_risk',
      value: parseFloat(operator.packet_hof_risk) || 0,
      title: 'Operator as Head of Family',
      category: 'Relationship Fraud',
      description: 'Unusually high number of packets where the operator is acting as Head of Family, potentially indicating relationship fraud or identity manipulation.'
    },
    {
      key: 'hardware_biodev_risk',
      value: parseFloat(operator.hardware_biodev_risk) || 0,
      title: 'Frequent Biometric Device Changes',
      category: 'Hardware Security',
      description: 'Frequent changes of biometric devices on the machine used by the operator, which may indicate hardware tampering or security violations.'
    },
    {
      key: 'document_grave_risk',
      value: parseFloat(operator.document_grave_risk) || 0,
      title: 'Grave Document Errors',
      category: 'Document Quality',
      description: 'Grave errors identified by QC in documents scanned by the operator, indicating serious document handling or scanning issues.'
    },
    {
      key: 'hardware_machinechange_risk',
      value: parseFloat(operator.hardware_machinechange_risk) || 0,
      title: 'Machine Cloning Risk',
      category: 'Hardware Security',
      description: 'High possibility of machine being cloned that the operator is using, indicating potential hardware security breach or unauthorized machine duplication.'
    },
    {
      key: 'work_optname_risk',
      value: parseFloat(operator.work_optname_risk) || 0,
      title: 'Multiple Operator Names',
      category: 'Identity Verification',
      description: 'Operator ID linked with multiple operator names, potentially indicating identity fraud or account sharing violations.'
    }
  ].filter(anomaly => anomaly.value >= riskThreshold);

  const getSeverityFromRisk = (riskValue) => {
    if (riskValue >= 0.8) return 'high';
    if (riskValue >= 0.6) return 'medium';
    return 'positive';
  };

  const getCategoryColorFromName = (category) => {
    const colors = {
      'Work Pattern': 'bg-blue-500',
      'Performance': 'bg-green-500',
      'Packet Integrity': 'bg-red-500',
      'Document Verification': 'bg-yellow-500',
      'Document Quality': 'bg-orange-500',
      'Biometric Quality': 'bg-purple-500',
      'Relationship Fraud': 'bg-pink-500',
      'Hardware Security': 'bg-indigo-500',
      'Identity Verification': 'bg-teal-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  // Prepare risk radar chart data using actual anomaly scores
  const riskRadarData = [
    { 
      metric: 'Hardware Security', 
      score: Math.max(0, Math.min(100, (parseFloat(operator.hardwareAnomalyScore) || 0) * 100)),
      fullMark: 100 
    },
    { 
      metric: 'Performance', 
      score: Math.max(0, Math.min(100, (parseFloat(operator.workAnomalyScore) || 0) * 100)),
      fullMark: 100 
    },
    { 
      metric: 'Document Verification', 
      score: Math.max(0, Math.min(100, (parseFloat(operator.documentAnomalyScore) || 0) * 100)),
      fullMark: 100 
    },
    { 
      metric: 'Biometric Quality', 
      score: Math.max(0, Math.min(100, (parseFloat(operator.biometricAnomalyScore) || 0) * 100)),
      fullMark: 100 
    },
    { 
      metric: 'Packet Integrity', 
      score: Math.max(0, Math.min(100, (parseFloat(operator.packetAnomalyScore) || 0) * 100)),
      fullMark: 100 
    }
  ];

  // Debug logging to check radar data
  console.log('Operator Data:', {
    hardwareAnomalyScore: operator.hardwareAnomalyScore,
    workAnomalyScore: operator.workAnomalyScore,
    documentAnomalyScore: operator.documentAnomalyScore,
    biometricAnomalyScore: operator.biometricAnomalyScore,
    packetAnomalyScore: operator.packetAnomalyScore
  });
  console.log('Risk Radar Data:', riskRadarData);

  // Risk meter calculation - use optRiskScore from JSON or fallback to risk_score
  const riskScore = parseFloat(operator.optRiskScore || operator.risk_score || 0);
  const riskPercentage = riskScore * 100;
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

      <div className="max-w-[1920px] mx-auto">
      
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
                    operator.active_status === '1' 
                      ? 'bg-green-500/40 border-2 border-green-600 text-green-800' 
                      : 'bg-red-500/40 border-2 border-red-600 text-red-800'
                  }`}>
                    {operator.active_status === '1' ? '● ACTIVE' : '● INACTIVE'}
                  </div>
                </div>
                <div className="space-y-3">
                  <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg animate-fade-in text-gray-800">
                    {operator.opt_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm backdrop-blur-sm bg-white/60 rounded-xl px-5 py-3 w-fit border border-[#d2c5e7] text-gray-700">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-mono font-semibold">{operator.opt_uid || operator.opt_id}</span>
                    </span>
                    <span className="text-[#d2c5e7]">|</span>
                    <span className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span>{operator.optEa || operator.opt_ea || 'N/A'}</span>
                    </span>
                    <span className="text-[#d2c5e7]">|</span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{operator.district || 'Unknown'}, {operator.state || 'Unknown'}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mt-6 border-t border-[#d2c5e7] border-opacity-60 pt-4 flex-wrap">
              {[
                { id: 'details', label: 'Details', icon: User },
                { id: 'overview', label: 'Overview', icon: Shield },
                { id: 'performance', label: 'Risk Analysis', icon: TrendingUp },
                { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
                { id: 'enrollmentReview', label: `Packet Review (${packetData.length})`, icon: FileText },
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
              {/* Risk Meter and Radar (Performance) OR KPIs (Overview) */}
              {activeSection === 'performance' && riskScore > 0 && (
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
                  <div className="relative w-full h-52 mx-auto mb-4">
                    <svg viewBox="0 0 320 180" className="w-full h-full drop-shadow-lg">
                      <defs>
                        <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                          <stop offset="50%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      <path d="M 40 140 A 120 120 0 0 1 280 140" fill="none" stroke="#e5e7eb" strokeWidth="28" strokeLinecap="round" />
                      <path d="M 40 140 A 120 120 0 0 1 280 140" fill="none" stroke="url(#riskGradient)" strokeWidth="28" strokeLinecap="round" opacity="0.3" />
                      <path 
                        d="M 40 140 A 120 120 0 0 1 280 140" 
                        fill="none" 
                        stroke={riskLevel.color} 
                        strokeWidth="28" 
                        strokeLinecap="round" 
                        strokeDasharray={`${(riskAngle / 180) * 377.0} 377.0`}
                        filter="url(#glow)"
                      />
                      <line x1="160" y1="140" x2={160 + Math.cos((Math.PI - (riskAngle * Math.PI / 180))) * 100} y2={140 - Math.sin((Math.PI - (riskAngle * Math.PI / 180))) * 100} stroke={riskLevel.color} strokeWidth="6" strokeLinecap="round" />
                      <circle cx="160" cy="140" r="8" fill={riskLevel.color} filter="url(#glow)" />
                    </svg>
                  </div>

                  <div className="text-center relative z-10">
                    <div className="text-5xl font-extrabold mb-3 drop-shadow" style={{ color: riskLevel.color }}>
                      {riskPercentage.toFixed(1)}%
                    </div>
                    <div className="inline-block px-6 py-3 rounded-full font-bold text-base shadow-lg" style={{ backgroundColor: riskLevel.bgColor, color: riskLevel.color }}>
                      {riskLevel.level}
                    </div>
                  </div>
                </div>

                {/* Risk Radar Chart for Performance tab */}
                {activeSection === 'performance' ? (
                  <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                      Risk Analysis Radar
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={riskRadarData.length > 0 && riskRadarData.some(d => d.score > 0) ? riskRadarData : [
                        { metric: 'Hardware Security', score: 30, fullMark: 100 },
                        { metric: 'Performance', score: 25, fullMark: 100 },
                        { metric: 'Document Verification', score: 40, fullMark: 100 },
                        { metric: 'Biometric Quality', score: 20, fullMark: 100 },
                        { metric: 'Packet Integrity', score: 35, fullMark: 100 }
                      ]}>
                        <PolarGrid stroke="#e5e7eb" strokeWidth={2} />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: '#374151', fontSize: 15, fontWeight: 700 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 13 }} />
                        <Radar name="Risk Score" dataKey="score" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} strokeWidth={3} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #ef4444', borderRadius: '12px', padding: '12px' }} formatter={(value) => [`${value.toFixed(1)}%`, 'Risk Score']} />
                      </RadarChart>
                    </ResponsiveContainer>
                    <div className="text-center text-sm text-gray-600 mt-4 bg-red-50 p-3 rounded-lg border border-red-200">
                      ⚠️ Higher scores indicate higher risk levels in each category
                    </div>
                  </div>
                ) : null}
                </div>
              )}
              
              {/* Show message when risk score is 0 */}
              {activeSection === 'performance' && riskScore === 0 && (
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 text-center border-2 border-green-200 animate-fade-in">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Risk Analysis Available</h3>
                  <p className="text-gray-600">This operator has a risk score of 0 and requires no risk analysis at this time.</p>
                </div>
              )}
              </div>
              )}

              {/* KPIs for Overview */}
              {activeSection === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <div className="p-2 bg-[#e8dff2] rounded-lg">
                        <Award className="w-6 h-6 text-[#9b7bb5]" />
                      </div>
                      Key Performance Indicators
                    </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`border-l-4 rounded-xl p-5 hover:scale-105 transition-transform duration-300 shadow-md ${
                      hasHighPacketAnomaly 
                        ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-500' 
                        : 'bg-gradient-to-br from-[#f5f2f8] to-[#e8dff2] border-[#d2c5e7]'
                    }`}>
                      <div className={`flex items-center gap-2 mb-2 ${hasHighPacketAnomaly ? 'text-red-700' : 'text-[#9b7bb5]'}`}>
                        <Activity className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wide">Daily Production</span>
                        {hasHighPacketAnomaly && <AlertTriangle className="w-4 h-4 text-red-600" />}
                      </div>
                      <div className={`text-3xl font-extrabold ${hasHighPacketAnomaly ? 'text-red-900' : 'text-[#7a5f93]'}`}>
                        {operator.pkt_per_day || 0}
                      </div>
                      <div className={`text-xs font-medium mt-1 ${hasHighPacketAnomaly ? 'text-red-600' : 'text-[#9b7bb5]'}`}>
                        packets/day {hasHighPacketAnomaly && '⚠️ Above threshold (150)'}
                      </div>
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
              )
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
                    <span className="font-bold text-gray-900 font-mono text-right">{operator.opt_id}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-gray-600 font-medium">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${operator.active_status === '1' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {operator.active_status === '1' ? '● Active' : '● Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="font-medium">Email</span>
                    </div>
                    <span className="font-bold text-gray-900 text-sm break-all text-right max-w-[60%]">{operator.opt_email || 'operator@example.com'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">Location</span>
                    </div>
                    <div className="text-right max-w-[60%]">
                      <div className="font-bold text-gray-900 text-sm">{operator.opt_address || `${operator.district || 'Unknown District'}, ${operator.state || 'Unknown State'}`}</div>
                      <div className="text-gray-700 text-xs">PIN: <span className="font-bold">{operator.opt_pincode || operator.pincode || '000000'}</span></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-gray-600 font-medium">Registrar</span>
                    <span className="font-bold text-gray-900 text-right max-w-[60%] break-words">{operator.optReg || operator.opt_reg || 'N/A'}</span>
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
                    <span className="font-bold text-2xl text-gray-900 text-right">{operator.machine_count || '1'}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 font-medium">Last Sync</span>
                      <span className={`font-bold text-lg ${calculateDaysSince(operator.last_sync_time) > 7 ? 'text-red-600' : 'text-green-600'}`}>
                        {calculateDaysSince(operator.last_sync_time)} days ago
                      </span>
                    </div>
                    {calculateDaysSince(operator.last_sync_time) > 7 && (
                      <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-500 rounded text-xs text-red-700">
                        ⚠️ Machine sync is overdue - requires immediate attention
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-gray-600 font-medium">Sync Duration</span>
                    <span className="font-bold text-gray-900 text-right">{formatSyncDuration(operator.avg_sync_duration)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Last Sync Time</span>
                    </div>
                    <span className="font-bold text-gray-900 text-sm text-right max-w-[60%] break-words">{operator.last_sync_time ? new Date(operator.last_sync_time).toLocaleString() : 'No sync data available'}</span>
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
                {(operator.anomalies && operator.anomalies.length > 0) || hasHighPacketAnomaly || detectedAnomalies.length > 0 ? (
                  <div className="space-y-4">
                    {/* High Packet Production Anomaly */}
                    {hasHighPacketAnomaly && (
                      <div className="p-5 rounded-xl border-l-4 bg-red-50 border-red-500 hover:scale-102 transition-all duration-300 shadow-md">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-lg text-gray-900">High Packet Production</h4>
                            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-orange-500 text-white shadow-sm">
                              Performance
                            </span>
                          </div>
                          <span className="px-4 py-2 rounded-full text-sm font-extrabold shadow-md bg-red-100 text-red-700 border-2 border-red-300">
                            {pktsPerDay} pkts/day
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          This operator is producing {pktsPerDay} packets per day, which exceeds the normal threshold of 150 packets/day. 
                          This high production rate may indicate potential irregularities and requires investigation.
                        </p>
                      </div>
                    )}
                    
                    {/* Risk-based anomalies */}
                    {detectedAnomalies.map((anomaly, idx) => (
                      <div key={anomaly.key} className={`p-5 rounded-xl border-l-4 hover:scale-102 transition-all duration-300 shadow-md ${
                        getSeverityFromRisk(anomaly.value) === 'high' ? 'bg-red-50 border-red-500' :
                        getSeverityFromRisk(anomaly.value) === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                        'bg-blue-50 border-blue-500'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-lg text-gray-900">{anomaly.title}</h4>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getCategoryColorFromName(anomaly.category)} text-white shadow-sm`}>
                              {anomaly.category}
                            </span>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-extrabold shadow-md ${
                            getSeverityFromRisk(anomaly.value) === 'high' ? 'bg-red-100 text-red-700 border-2 border-red-300' :
                            getSeverityFromRisk(anomaly.value) === 'medium' ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300' :
                            'bg-blue-100 text-blue-700 border-2 border-blue-300'
                          }`}>
                            {(anomaly.value * 100).toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{anomaly.description}</p>
                      </div>
                    ))}
                    
                    {/* Existing anomalies from JSON */}
                    {operator.anomalies && operator.anomalies.map((anomaly, idx) => (
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

          {/* Enrollment Review Section */}
          {activeSection === 'enrollmentReview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-gray-100 hover:shadow-3xl transition-all duration-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-[#e8dff2] to-[#d2c5e7] rounded-lg">
                    <FileText className="w-6 h-6 text-[#9b7bb5]" />
                  </div>
                  Packet Review Dashboard
                </h3>
                
                {packetData.length > 0 ? (
                  <>
                    {/* Packet Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-600 text-sm font-medium">Total Packets</p>
                            <p className="text-2xl font-bold text-blue-900">{packetData.length}</p>
                          </div>
                          <FileText className="w-8 h-8 text-blue-500" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-600 text-sm font-medium">New Enrollments</p>
                            <p className="text-2xl font-bold text-green-900">
                              {packetData.filter(p => p.pkt_type === 'N').length}
                            </p>
                          </div>
                          <User className="w-8 h-8 text-green-500" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-orange-600 text-sm font-medium">Updates</p>
                            <p className="text-2xl font-bold text-orange-900">
                              {packetData.filter(p => p.pkt_type === 'U').length}
                            </p>
                          </div>
                          <Activity className="w-8 h-8 text-orange-500" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-600 text-sm font-medium">Last 24h</p>
                            <p className="text-2xl font-bold text-purple-900">
                              {packetData.filter(p => {
                                const packetDate = new Date(p.pkt_created_ts);
                                const yesterday = new Date();
                                yesterday.setDate(yesterday.getDate() - 1);
                                return packetDate >= yesterday;
                              }).length}
                            </p>
                          </div>
                          <Clock className="w-8 h-8 text-purple-500" />
                        </div>
                      </div>
                    </div>

                    {/* Packet List */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Packets</h4>
                      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                              <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                                  Packet EID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                                  Type
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                                  Subtype
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                                  Created Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                                  Station ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                                  Machine Code
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                                  Source
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {packetData
                                .sort((a, b) => new Date(b.pkt_created_ts) - new Date(a.pkt_created_ts))
                                .map((packet, index) => (
                                <tr key={index} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="font-mono text-blue-600 truncate max-w-[200px]" title={packet.pkt_eid}>
                                      {packet.pkt_eid}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                      packet.pkt_type === 'N' 
                                        ? 'bg-green-100 text-green-800 border border-green-200' 
                                        : 'bg-orange-100 text-orange-800 border border-orange-200'
                                    }`}>
                                      <div className={`w-2 h-2 rounded-full mr-2 ${
                                        packet.pkt_type === 'N' ? 'bg-green-500' : 'bg-orange-500'
                                      }`}></div>
                                      {packet.pkt_type === 'N' ? 'New Enrollment' : 'Update'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {packet.pkt_subtype ? (
                                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                        packet.pkt_subtype === 'D' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                        packet.pkt_subtype === 'B' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                        'bg-gray-100 text-gray-800 border border-gray-200'
                                      }`}>
                                        <div className={`w-2 h-2 rounded-full mr-2 ${
                                          packet.pkt_subtype === 'D' ? 'bg-blue-500' :
                                          packet.pkt_subtype === 'B' ? 'bg-purple-500' : 'bg-gray-500'
                                        }`}></div>
                                        {packet.pkt_subtype === 'D' ? 'Demographic' :
                                         packet.pkt_subtype === 'B' ? 'Biometric' :
                                         packet.pkt_subtype === 'MoU' ? 'MoU' : packet.pkt_subtype}
                                      </span>
                                    ) : (
                                      <span className="text-gray-400 text-sm">—</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex items-center">
                                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                      <div>
                                        <div className="font-medium">
                                          {new Date(packet.pkt_created_ts).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {new Date(packet.pkt_created_ts).toLocaleTimeString()}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                      <span className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                        {packet.pkt_station_id}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <Building className="w-4 h-4 text-gray-400 mr-2" />
                                      <span className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                        {packet.pkt_machine_code}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
                                      <Zap className="w-3 h-3 mr-1" />
                                      {packet.pkt_source}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                      {anomalyData[packet.pkt_eid] ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                                          <AlertTriangle className="w-3 h-3 mr-1" />
                                          Anomaly Reported
                                        </span>
                                      ) : (
                                        <button
                                          onClick={() => handleMarkAnomaly(packet)}
                                          className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200 hover:border-yellow-300 transition-all duration-200"
                                        >
                                          <AlertTriangle className="w-3 h-3 mr-1" />
                                          Mark Anomaly
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">No Packet Data Available</h4>
                    <p className="text-gray-500">No packet review data found for this operator.</p>
                  </div>
                )}
              </div>

              {/* Anomaly Reporting Modal */}
              {showAnomalyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                        Report Packet Anomaly
                      </h3>
                      <button
                        onClick={() => setShowAnomalyModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    
                    {selectedPacket && (
                      <div className="mb-6">
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Packet Details:</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div><span className="font-medium">EID:</span> {selectedPacket.pkt_eid}</div>
                            <div><span className="font-medium">Type:</span> {selectedPacket.pkt_type === 'N' ? 'New Enrollment' : 'Update'}</div>
                            <div><span className="font-medium">Created:</span> {new Date(selectedPacket.pkt_created_ts).toLocaleString()}</div>
                            <div><span className="font-medium">Station:</span> {selectedPacket.pkt_station_id}</div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Anomaly Remarks <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={anomalyRemarks}
                            onChange={(e) => setAnomalyRemarks(e.target.value)}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 resize-none"
                            placeholder="Describe the anomaly you've identified in this packet..."
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowAnomalyModal(false)}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={submitAnomalyReport}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                      >
                        Report Anomaly
                      </button>
                    </div>
                  </div>
                </div>
              )}
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

                {/* Feedback History Section */}
                {feedbackHistory.length > 0 && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <h4 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Previous Feedback History
                    </h4>
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {feedbackHistory.map((historyItem, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-gray-900">Feedback #{feedbackHistory.length - index}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(historyItem.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Submitted by:</strong> {historyItem.username}
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(historyItem.feedback).map(([key, value]) => {
                              if (value !== null) {
                                return (
                                  <span key={key} className={`px-2 py-1 rounded ${
                                    value === true ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                  }`}>
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {value ? 'Yes' : 'No'}
                                  </span>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* 1. Has this operator been verified as fraudulent */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-white to-gray-50">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">1</div>
                      Fraudulent Operator Verification
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">Has this operator been verified as fraudulent?</p>
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => handleSmartFeedback('verifiedFraudOperator', true)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          feedback.verifiedFraudOperator === true
                            ? 'bg-red-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-300'
                        }`}
                      >
                        <XCircle className="w-5 h-5" />
                        Yes - Fraudulent
                      </button>
                      <button
                        onClick={() => handleSmartFeedback('verifiedFraudOperator', false)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          feedback.verifiedFraudOperator === false
                            ? 'bg-green-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-300'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                        No - Not Fraudulent
                      </button>
                    </div>
                    
                    {/* Document Upload and Remarks for Fraudulent */}
                    {feedback.verifiedFraudOperator === true && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Upload Evidence (PDF - Optional)
                            </label>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleDocumentUpload('fraudulent', e.target.files[0])}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                            />
                            {documents.fraudulent && (
                              <p className="text-xs text-green-600 mt-1">✓ {documents.fraudulent.name}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Remarks (Optional)
                            </label>
                            <textarea
                              value={remarks.fraudulent}
                              onChange={(e) => handleRemarksChange('fraudulent', e.target.value)}
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
                              placeholder="Add any additional remarks..."
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. Has the operator been verified as legitimate */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-white to-gray-50">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">2</div>
                      Legitimate Operator Verification
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">Has the operator been verified as legitimate?</p>
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => handleSmartFeedback('verifiedLegitimateOperator', true)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          feedback.verifiedLegitimateOperator === true
                            ? 'bg-green-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-300'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                        Yes - Legitimate
                      </button>
                      <button
                        onClick={() => handleSmartFeedback('verifiedLegitimateOperator', false)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          feedback.verifiedLegitimateOperator === false
                            ? 'bg-red-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-300'
                        }`}
                      >
                        <XCircle className="w-5 h-5" />
                        No - Not Verified
                      </button>
                    </div>
                    
                    {/* Remarks for Legitimate */}
                    {(feedback.verifiedLegitimateOperator === true || feedback.verifiedLegitimateOperator === false) && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Remarks (Optional)
                        </label>
                        <textarea
                          value={remarks.legitimate}
                          onChange={(e) => handleRemarksChange('legitimate', e.target.value)}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
                          placeholder="Add any additional remarks about legitimacy verification..."
                        />
                      </div>
                    )}
                  </div>

                  {/* 3. Has the operator worked with a cloned machine */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-white to-gray-50">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">3</div>
                      Machine Cloning Verification
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">Has the operator worked with a cloned machine?</p>
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => handleSmartFeedback('workedWithClonedMachine', true)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          feedback.workedWithClonedMachine === true
                            ? 'bg-red-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-300'
                        }`}
                      >
                        <AlertTriangle className="w-5 h-5" />
                        Yes - Used Cloned Machine
                      </button>
                      <button
                        onClick={() => handleSmartFeedback('workedWithClonedMachine', false)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          feedback.workedWithClonedMachine === false
                            ? 'bg-green-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-300'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                        No - No Cloned Machine
                      </button>
                    </div>
                    
                    {/* Document Upload and Remarks for Cloned Machine */}
                    {(feedback.workedWithClonedMachine === true || feedback.workedWithClonedMachine === false) && (
                      <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Upload Evidence (PDF - Optional)
                            </label>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleDocumentUpload('clonedMachine', e.target.files[0])}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                            />
                            {documents.clonedMachine && (
                              <p className="text-xs text-green-600 mt-1">✓ {documents.clonedMachine.name}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Remarks (Optional)
                            </label>
                            <textarea
                              value={remarks.clonedMachine}
                              onChange={(e) => handleRemarksChange('clonedMachine', e.target.value)}
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
                              placeholder="Add any additional remarks about machine cloning..."
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 4. Has the operator done unsystematic biometric capture */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-white to-gray-50">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">4</div>
                      Biometric Capture Verification
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">Has the operator done unsystematic biometric capture?</p>
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => handleSmartFeedback('unsystematicBiometricCapture', true)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          feedback.unsystematicBiometricCapture === true
                            ? 'bg-red-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-300'
                        }`}
                      >
                        <AlertTriangle className="w-5 h-5" />
                        Yes - Unsystematic Capture
                      </button>
                      <button
                        onClick={() => handleSmartFeedback('unsystematicBiometricCapture', false)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          feedback.unsystematicBiometricCapture === false
                            ? 'bg-green-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-300'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                        No - Systematic Capture
                      </button>
                    </div>
                    
                    {/* Document Upload and Remarks for Biometric Capture */}
                    {(feedback.unsystematicBiometricCapture === true || feedback.unsystematicBiometricCapture === false) && (
                      <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Upload Evidence (PDF - Optional)
                            </label>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleDocumentUpload('biometricCapture', e.target.files[0])}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                            />
                            {documents.biometricCapture && (
                              <p className="text-xs text-green-600 mt-1">✓ {documents.biometricCapture.name}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Remarks (Optional)
                            </label>
                            <textarea
                              value={remarks.biometricCapture}
                              onChange={(e) => handleRemarksChange('biometricCapture', e.target.value)}
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-orange-500 focus:border-orange-500"
                              placeholder="Add any additional remarks about biometric capture..."
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 5. Has any anomaly been identified in the packets */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-white to-gray-50">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">5</div>
                      Packet Anomaly Verification
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">Has any anomaly been identified in the packets?</p>
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => handleSmartFeedback('packetAnomalyIdentified', true)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          feedback.packetAnomalyIdentified === true
                            ? 'bg-red-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-300'
                        }`}
                      >
                        <AlertTriangle className="w-5 h-5" />
                        Yes - Anomaly Found
                      </button>
                      <button
                        onClick={() => handleSmartFeedback('packetAnomalyIdentified', false)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          feedback.packetAnomalyIdentified === false
                            ? 'bg-green-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-300'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                        No - No Anomaly
                      </button>
                    </div>
                    
                    {/* Document Upload and Remarks for Packet Anomaly */}
                    {(feedback.packetAnomalyIdentified === true || feedback.packetAnomalyIdentified === false) && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Upload Evidence (PDF - Optional)
                            </label>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleDocumentUpload('packetAnomaly', e.target.files[0])}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {documents.packetAnomaly && (
                              <p className="text-xs text-green-600 mt-1">✓ {documents.packetAnomaly.name}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Remarks (Optional)
                            </label>
                            <textarea
                              value={remarks.packetAnomaly}
                              onChange={(e) => handleRemarksChange('packetAnomaly', e.target.value)}
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Add any additional remarks about packet anomaly..."
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end gap-4 border-t pt-6">
                  <button
                    onClick={() => setFeedback({
                      verifiedFraudOperator: null,
                      verifiedLegitimateOperator: null,
                      workedWithClonedMachine: null,
                      unsystematicBiometricCapture: null,
                      packetAnomalyIdentified: null
                    })}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-all duration-300"
                  >
                    Reset Feedback
                  </button>
                  <button
                    onClick={submitFeedback}
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
                    <span className="font-medium text-gray-700">Fraudulent:</span>
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
                    <span className="font-medium text-gray-700">Legitimate:</span>
                    <span className={`font-bold ${
                      feedback.verifiedLegitimateOperator === true ? 'text-green-600' :
                      feedback.verifiedLegitimateOperator === false ? 'text-red-600' :
                      'text-gray-400'
                    }`}>
                      {feedback.verifiedLegitimateOperator === true ? 'Yes' : 
                       feedback.verifiedLegitimateOperator === false ? 'No' : 'Not Set'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">Cloned Machine:</span>
                    <span className={`font-bold ${
                      feedback.workedWithClonedMachine === true ? 'text-red-600' :
                      feedback.workedWithClonedMachine === false ? 'text-green-600' :
                      'text-gray-400'
                    }`}>
                      {feedback.workedWithClonedMachine === true ? 'Yes' : 
                       feedback.workedWithClonedMachine === false ? 'No' : 'Not Set'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">Unsystematic Biometric:</span>
                    <span className={`font-bold ${
                      feedback.unsystematicBiometricCapture === true ? 'text-red-600' :
                      feedback.unsystematicBiometricCapture === false ? 'text-green-600' :
                      'text-gray-400'
                    }`}>
                      {feedback.unsystematicBiometricCapture === true ? 'Yes' : 
                       feedback.unsystematicBiometricCapture === false ? 'No' : 'Not Set'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg md:col-span-2">
                    <span className="font-medium text-gray-700">Packet Anomaly:</span>
                    <span className={`font-bold ${
                      feedback.packetAnomalyIdentified === true ? 'text-red-600' :
                      feedback.packetAnomalyIdentified === false ? 'text-green-600' :
                      'text-gray-400'
                    }`}>
                      {feedback.packetAnomalyIdentified === true ? 'Yes' : 
                       feedback.packetAnomalyIdentified === false ? 'No' : 'Not Set'}
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
