import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, TrendingUp, Shield, Users, AlertCircle, CheckCircle, XCircle, Activity, Clock, Zap, ChevronRight, Home } from 'lucide-react';
import OverviewTab from './OverviewTab';
import PatternAnalysisTab from './PatternAnalysisTab';
import VelocityAnalysisTab from './VelocityAnalysisTab';
import GeographicAnalysisTab from './GeographicAnalysisTab';
import dashboardData from '../resources/dashboardData.json';
import operatorList from '../resources/operatorList.json';
import anomalyData from '../resources/anomalyData.json';
import reviewData from '../resources/reviewData.json';
import overviewData from '../resources/overviewData.json';
import velocityAnalysis from '../resources/velocityAnalysis.json';
import geographicAnalysis from '../resources/geographicAnalysis.json';
import patternAnalysis from '../resources/patternAnalysis.json';
import OperatorsTab from './OperatorsTab';

const operatorData = [
  {
    opt_id: "DOPTN_PT_NS752738",
    opt_name: "Dhesika V",
    is_active: 1,
    opt_uid: "300999043010",
    opt_email: "dhesikaveera1998@gmail.com",
    opt_ea: "Department of Posts, Tamilnadu",
    opt_reg: "Indiapost",
    opt_state: "Tamil Nadu",
    opt_district: "Thanjavur",
    opt_pincode: "614902",
    pkt_create_daily_avg: 19,
    pkt_create_daily_enrl_avg: 0,
    pkt_create_daily_updt_avg: 18,
    pkt_updt_rejection_rate: 4.2,
    pkt_enrl_rejection_rate: null,
    pkt_create_count_today: 9,
    pkt_create_count_enrl_today: 2,
    pkt_create_count_updt_today: 7,
    pkt_create_count_mou_today: null,
    pkt_create_odd_hour_avg: 0,
    pkt_create_odd_hour_count_yesterday: null,
    pkt_creation_duration_avg: 5,
    pkt_creation_enrl_duration_avg: 13,
    pkt_creation_updt_duration_avg: 5,
    pkt_outdistrict_daily_avg: 4,
    pkt_outstate_daily_avg: 0,
    qc_disp_count: 144,
    qc_error_count: 5,
    qc_grave_error_count: 0,
    qc_error_rate_current_month: 3,
    qc_grave_error_rate_current_month: 0,
    qc_doe1_count: 0,
    qc_doe2_count: 2,
    qc_de_count: 3,
    qc_be_count: 0,
    qc_error_rate_prev_month: null,
    qc_grave_rate_prev_month: null,
    machine_last_sync_time: "2025-10-21 15:44:47",
    machine_avg_sync_duration_mins: 176.05,
    machine_count: 1,
    updt_child_to_adult_dob_count: 1,
    updt_resident_name_change_count: 0,
    risk_score: 0.1402792476
  },
  {
    opt_id: "DOPTN_PT_NS756263",
    opt_name: "Deepika Rethinam",
    is_active: 1,
    opt_uid: "614904080894",
    opt_email: "deepzrethinam97@gmail.com",
    opt_ea: "Department of Posts, Tamilnadu",
    opt_reg: "Indiapost",
    opt_state: "Tamil Nadu",
    opt_district: "Thanjavur",
    opt_pincode: "614625",
    pkt_create_daily_avg: 0,
    pkt_create_daily_enrl_avg: 0,
    pkt_create_daily_updt_avg: 0,
    pkt_updt_rejection_rate: null,
    pkt_enrl_rejection_rate: null,
    pkt_create_count_today: null,
    pkt_create_count_enrl_today: null,
    pkt_create_count_updt_today: null,
    pkt_create_count_mou_today: null,
    pkt_create_odd_hour_avg: 0,
    pkt_create_odd_hour_count_yesterday: null,
    pkt_creation_duration_avg: 5,
    pkt_creation_enrl_duration_avg: 4,
    pkt_creation_updt_duration_avg: 0,
    pkt_outdistrict_daily_avg: 0,
    pkt_outstate_daily_avg: 0,
    qc_disp_count: 0,
    qc_error_count: 0,
    qc_grave_error_count: 0,
    qc_error_rate_current_month: null,
    qc_grave_error_rate_current_month: 0,
    qc_doe1_count: 0,
    qc_doe2_count: 0,
    qc_de_count: 0,
    qc_be_count: 0,
    qc_error_rate_prev_month: null,
    qc_grave_rate_prev_month: null,
    machine_last_sync_time: "2024-11-30 4:52:08",
    machine_avg_sync_duration_mins: null,
    machine_count: 1,
    updt_child_to_adult_dob_count: 2,
    updt_resident_name_change_count: 0,
    risk_score: 0.05261804304
  },
  {
    opt_id: "DOPTN_PT_NS790271",
    opt_name: "Aknes Sneka Easudass",
    is_active: 1,
    opt_uid: "842348818881",
    opt_email: "aknessneka97@gmail.com",
    opt_ea: "Department of Posts, Tamilnadu",
    opt_reg: "Indiapost",
    opt_state: "Tamil Nadu",
    opt_district: "Thanjavur",
    opt_pincode: "614601",
    pkt_create_daily_avg: 22,
    pkt_create_daily_enrl_avg: 1,
    pkt_create_daily_updt_avg: 21,
    pkt_updt_rejection_rate: 10.2,
    pkt_enrl_rejection_rate: null,
    pkt_create_count_today: 35,
    pkt_create_count_enrl_today: 3,
    pkt_create_count_updt_today: 32,
    pkt_create_count_mou_today: null,
    pkt_create_odd_hour_avg: 0,
    pkt_create_odd_hour_count_yesterday: null,
    pkt_creation_duration_avg: 4,
    pkt_creation_enrl_duration_avg: 6,
    pkt_creation_updt_duration_avg: 4,
    pkt_outdistrict_daily_avg: 1,
    pkt_outstate_daily_avg: 0,
    qc_disp_count: 83,
    qc_error_count: 4,
    qc_grave_error_count: 0,
    qc_error_rate_current_month: 5,
    qc_grave_error_rate_current_month: 0,
    qc_doe1_count: 0,
    qc_doe2_count: 2,
    qc_de_count: 2,
    qc_be_count: 0,
    qc_error_rate_prev_month: 16,
    qc_grave_rate_prev_month: 0,
    machine_last_sync_time: "2025-10-28 10:27:25",
    machine_avg_sync_duration_mins: 234.19,
    machine_count: 1,
    updt_child_to_adult_dob_count: 2,
    updt_resident_name_change_count: 0,
    risk_score: 0.1567135747
  }
]

const defaultApiData = {
  username: "Priyanshu Gupta",
  usertype: "RO Lucknow",
  low_risk_opt: 143,
  med_risk_opt: 1,
  high_risk_opt: 1
};

const OperatorAnomalyDashboard = () => {
  const navigate = useNavigate();
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [filterRisk, setFilterRisk] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRo, setSelectedRo] = useState('Bengaluru');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch('http://10.8.18.150:8080/api/v1/home');
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch dashboard data');
  //       }
  //       const data = await response.json();
  //       // setApiData(data);
  //       setError(null);
  //     } catch (err) {
  //       console.error('Error fetching dashboard data:', err);
  //       setError(err.message);
  //       // Use fallback data if API fails
  //       setApiData(defaultApiData);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDashboardData();
  // }, []);

  useEffect(() => {
    setApiData(defaultApiData);
  }, []);

  // Enhanced anomaly detection with more patterns
  const anomalyAnalysis = useMemo(() => {
    const avgProcessingTime = operatorData.reduce((sum, op) => sum + op.pkt_creation_duration_avg, 0) / operatorData.length;
    const avgDailyPackets = operatorData.reduce((sum, op) => sum + op.pkt_create_daily_avg, 0) / operatorData.length;
    const avgRejectionRate = operatorData.reduce((sum, op) => sum + (op.pkt_updt_rejection_rate || 0), 0) / operatorData.length;

    return operatorData.map(op => {
      const anomalies = [];
      let severity = 'low';
      let anomalyScore = 0;

      // 1. High rejection rate
      if (op.pkt_updt_rejection_rate > 8) {
        anomalies.push({
          type: 'High Rejection Rate',
          value: `${op.pkt_updt_rejection_rate}%`,
          severity: 'high',
          description: 'Update rejection rate exceeds normal threshold',
          category: 'quality'
        });
        severity = 'high';
        anomalyScore += 30;
      }

      // 2. Suspicious DOB changes
      if (op.updt_child_to_adult_dob_count > 1) {
        anomalies.push({
          type: 'Suspicious DOB Changes',
          value: op.updt_child_to_adult_dob_count,
          severity: 'high',
          description: 'Multiple child-to-adult date of birth modifications detected',
          category: 'fraud'
        });
        severity = 'high';
        anomalyScore += 35;
      }

      // 3. Enrollment vs Update imbalance
      const enrollPercentage = op.pkt_create_daily_enrl_avg / (op.pkt_create_daily_avg || 1) * 100;
      if (op.pkt_create_daily_avg > 0 && enrollPercentage < 5) {
        anomalies.push({
          type: 'Low Enrollment Activity',
          value: `${enrollPercentage.toFixed(1)}%`,
          severity: 'medium',
          description: 'Unusually low new enrollment compared to updates',
          category: 'pattern'
        });
        if (severity === 'low') severity = 'medium';
        anomalyScore += 15;
      }

      // 4. Processing time anomaly
      if (op.pkt_creation_duration_avg < avgProcessingTime * 0.5 && op.pkt_create_daily_avg > 10) {
        anomalies.push({
          type: 'Unusually Fast Processing',
          value: `${op.pkt_creation_duration_avg} min`,
          severity: 'high',
          description: 'Processing time significantly below average',
          category: 'velocity'
        });
        severity = 'high';
        anomalyScore += 25;
      }

      // 5. Today's activity spike
      if (op.pkt_create_count_today > op.pkt_create_daily_avg * 2 && op.pkt_create_daily_avg > 0) {
        anomalies.push({
          type: 'Activity Spike',
          value: `${op.pkt_create_count_today} today vs ${op.pkt_create_daily_avg} avg`,
          severity: 'medium',
          description: 'Today\'s packet creation is double the daily average',
          category: 'velocity'
        });
        if (severity === 'low') severity = 'medium';
        anomalyScore += 20;
      }

      // 6. Out of district activity
      const outDistrictPercentage = (op.pkt_outdistrict_daily_avg / (op.pkt_create_daily_avg || 1)) * 100;
      if (outDistrictPercentage > 20) {
        anomalies.push({
          type: 'High Out-of-District Activity',
          value: `${outDistrictPercentage.toFixed(1)}%`,
          severity: 'medium',
          description: 'High volume of packets from outside assigned district',
          category: 'geographic'
        });
        if (severity === 'low') severity = 'medium';
        anomalyScore += 18;
      }

      // 7. Stale machine sync
      const lastSync = new Date(op.machine_last_sync_time);
      const daysSinceSync = Math.floor((new Date() - lastSync) / (1000 * 60 * 60 * 24));
      if (daysSinceSync > 7) {
        anomalies.push({
          type: 'Stale Machine Sync',
          value: `${daysSinceSync} days ago`,
          severity: daysSinceSync > 30 ? 'high' : 'medium',
          description: 'Machine has not synced recently',
          category: 'technical'
        });
        if (severity === 'low') severity = 'medium';
        anomalyScore += daysSinceSync > 30 ? 25 : 15;
      }

      // 8. Inactive operator
      if (op.pkt_create_daily_avg === 0 && op.is_active === 1) {
        anomalies.push({
          type: 'Inactive Operator',
          value: '0 packets/day',
          severity: 'medium',
          description: 'No packet creation activity detected',
          category: 'productivity'
        });
        if (severity === 'low') severity = 'medium';
        anomalyScore += 10;
      }

      // 9. QC error trend deterioration
      if (op.qc_error_rate_prev_month && op.qc_error_rate_current_month) {
        const errorIncrease = op.qc_error_rate_current_month - op.qc_error_rate_prev_month;
        if (errorIncrease > 5) {
          anomalies.push({
            type: 'Quality Deterioration',
            value: `+${errorIncrease.toFixed(1)}%`,
            severity: 'high',
            description: 'Significant increase in error rate',
            category: 'quality'
          });
          severity = 'high';
          anomalyScore += 28;
        }
      }

      // 10. QC grave errors present
      if (op.qc_grave_error_count > 0) {
        anomalies.push({
          type: 'Grave QC Errors',
          value: op.qc_grave_error_count,
          severity: 'high',
          description: 'Critical quality control errors detected',
          category: 'quality'
        });
        severity = 'high';
        anomalyScore += 40;
      }

      return {
        ...op,
        anomalies,
        severity,
        anomalyCount: anomalies.filter(a => a.severity !== 'positive').length,
        anomalyScore: Math.min(anomalyScore, 100),
        enrollPercentage,
        outDistrictPercentage,
        daysSinceSync
      };
    });
  }, []);

  const patternAnalysis = useMemo(() => {
    const patterns = {};
    anomalyAnalysis.forEach(op => {
      op.anomalies.forEach(anomaly => {
        if (anomaly.severity !== 'positive') {
          if (!patterns[anomaly.type]) {
            patterns[anomaly.type] = { count: 0, operators: [], severity: anomaly.severity, category: anomaly.category };
          }
          patterns[anomaly.type].count++;
          patterns[anomaly.type].operators.push(op.opt_name);
        }
      });
    });
    return Object.entries(patterns)
      .map(([type, data]) => ({ type, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [anomalyAnalysis]);

  const velocityData = useMemo(() => {
    return anomalyAnalysis.map(op => ({
      name: op.opt_name.split(' ')[0],
      packets_per_day: op.pkt_create_daily_avg,
      avg_duration: op.pkt_creation_duration_avg,
      rejection_rate: op.pkt_updt_rejection_rate || 0,
      anomaly_score: op.anomalyScore
    }));
  }, [anomalyAnalysis]);

  const geographicRisk = useMemo(() => {
    const districts = {};
    anomalyAnalysis.forEach(op => {
      if (!districts[op.opt_district]) {
        districts[op.opt_district] = { operators: 0, avgRisk: 0, totalAnomalies: 0 };
      }
      districts[op.opt_district].operators++;
      districts[op.opt_district].avgRisk += op.risk_score;
      districts[op.opt_district].totalAnomalies += op.anomalyCount;
    });
    return Object.entries(districts).map(([district, data]) => ({
      district,
      operators: data.operators,
      avgRisk: ((data.avgRisk / data.operators) * 100).toFixed(1),
      totalAnomalies: data.totalAnomalies
    }));
  }, [anomalyAnalysis]);

  const riskCorrelation = useMemo(() => {
    return anomalyAnalysis.map(op => ({
      name: op.opt_name.split(' ')[0],
      risk_score: (op.risk_score * 100).toFixed(1),
      anomaly_count: op.anomalyCount,
      rejection_rate: op.pkt_updt_rejection_rate || 0
    }));
  }, [anomalyAnalysis]);

  const riskDistribution = useMemo(() => {
    // Use API data if available
    if (apiData) {
      return [
        { name: 'Low Risk', value: apiData.low_risk_opt, color: '#10b981' },
        { name: 'Medium Risk', value: apiData.med_risk_opt, color: '#f59e0b' },
        { name: 'High Risk', value: apiData.high_risk_opt, color: '#ef4444' }
      ];
    }
    
    // Fallback to calculated data
    const ranges = { low: 0, medium: 0, high: 0 };
    anomalyAnalysis.forEach(op => {
      if (op.risk_score < 0.1) ranges.low++;
      else if (op.risk_score < 0.15) ranges.medium++;
      else ranges.high++;
    });
    return [
      { name: 'Low Risk', value: ranges.low, color: '#10b981' },
      { name: 'Medium Risk', value: ranges.medium, color: '#f59e0b' },
      { name: 'High Risk', value: ranges.high, color: '#ef4444' }
    ];
  }, [anomalyAnalysis, apiData]);

  const performanceData = useMemo(() => {
    return anomalyAnalysis.map(op => ({
      name: op.opt_name.split(' ')[0],
      daily_avg: op.pkt_create_daily_avg,
      rejection_rate: op.pkt_updt_rejection_rate || 0,
      qc_error_rate: op.qc_error_rate_current_month || 0,
      risk_score: (op.risk_score * 100).toFixed(1)
    }));
  }, [anomalyAnalysis]);

  const riskRejectionData = useMemo(() => {
    return anomalyAnalysis.map(op => ({
      opt_name: op.opt_name,
      risk_score_percent: parseFloat((op.risk_score * 100).toFixed(2)),
      pkt_updt_rejection_rate: op.pkt_updt_rejection_rate || 0,
      opt_district: op.opt_district
    }));
  }, [anomalyAnalysis]);

  const filteredOperators = useMemo(() => {
    if (filterRisk === 'all') return anomalyAnalysis;
    if (filterRisk === 'high') return anomalyAnalysis.filter(op => op.risk_score >= 0.15);
    if (filterRisk === 'medium') return anomalyAnalysis.filter(op => op.risk_score >= 0.1 && op.risk_score < 0.15);
    return anomalyAnalysis.filter(op => op.risk_score < 0.1);
  }, [anomalyAnalysis, filterRisk]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'positive': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <XCircle className="w-4 h-4" />;
      case 'medium': return <AlertCircle className="w-4 h-4" />;
      case 'positive': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      fraud: 'bg-red-500',
      quality: 'bg-orange-500',
      velocity: 'bg-purple-500',
      geographic: 'bg-blue-500',
      technical: 'bg-gray-500',
      productivity: 'bg-yellow-500',
      pattern: 'bg-pink-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const totalAnomalies = anomalyAnalysis.reduce((sum, op) => sum + op.anomalyCount, 0);
  const highRiskCount = anomalyAnalysis.filter(op => op.severity === 'high').length;
  const avgRiskScore = (anomalyAnalysis.reduce((sum, op) => sum + op.risk_score, 0) / anomalyAnalysis.length * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-[1920px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="w-8 h-8 text-red-500" />
                Operator 360
              </h1>
              {apiData && (
                <div className="mt-2 flex items-center gap-4">
                  <p className="text-sm text-gray-600">Welcome, <span className="font-semibold">{apiData.username}</span></p>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">{apiData.usertype}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="text-lg font-semibold">Nov 13, 2025</div>
            </div>
          </div>
        </div>

        {/* {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-blue-700">Loading dashboard data...</p>
          </div>
        )} */}

        {/* {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-yellow-800">⚠️ Using cached data. API connection issue: {error}</p>
          </div>
        )} */}

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-medium">Dashboard</span>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md p-2">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === 'overview' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => navigate('/anomalyindicators')}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === 'patterns' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Anomaly Indicators
            </button>
            {/* <button
              onClick={() => setActiveTab('velocity')}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === 'velocity' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Velocity Analysis
            </button> */}
            <button
              onClick={() => navigate('/regionevaluation')}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === 'geographic' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Region Evaluation
            </button>
            <button
              onClick={() => navigate('/viewoperators')}
              className="px-4 py-2 rounded-lg font-medium transition whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              View Operators
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab 
            anomalyAnalysis={anomalyAnalysis}
            riskDistribution={riskDistribution}
            performanceData={performanceData}
            riskCorrelation={riskCorrelation}
            riskRejectionData={riskRejectionData}
            apiData={apiData}
            patternAnalysis={patternAnalysis}
            highRiskCount={highRiskCount}
            setActiveTab={setActiveTab}
            setFilterRisk={setFilterRisk}
            setSelectedOperator={setSelectedOperator}
          />
        )}

        {activeTab === 'patterns' && (
          <PatternAnalysisTab />
        )}

        {/* {activeTab === 'velocity' && (
          <VelocityAnalysisTab 
            velocityData={velocityData}
          />
        )} */}

        {activeTab === 'geographic' && (
          <div className="space-y-6">
            {/* RO Selector */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Select Regional Office</h3>
              <div className="flex flex-wrap gap-3">
                {['Bengaluru', 'Mumbai', 'Delhi', 'Lucknow', 'Hyderabad', 'Ranchi', 'Guwahati', 'Chandigarh'].map((ro) => (
                  <button
                    key={ro}
                    onClick={() => setSelectedRo(ro)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedRo === ro 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {ro}
                  </button>
                ))}
              </div>
            </div>
            
            <GeographicAnalysisTab 
              selectedRo={selectedRo}
            />
          </div>
        )}

        {activeTab === 'operators' && (
          <OperatorsTab 
            filteredOperators={filteredOperators}
            selectedOperator={selectedOperator}
            setSelectedOperator={setSelectedOperator}
            filterRisk={filterRisk}
            setFilterRisk={setFilterRisk}
            getSeverityColor={getSeverityColor}
            getSeverityIcon={getSeverityIcon}
            getCategoryColor={getCategoryColor}
          />
        )}

       
      </div>
    </div>
  );
};

export default OperatorAnomalyDashboard;
