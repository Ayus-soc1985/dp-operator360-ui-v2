import React from 'react';
import landingData from '../resources/landing.json';
import userData from '../resources/userData.json';
import aggregatedRoCounts from '../resources/aggregatedRoCounts.json';
import keyIndicators from '../resources/keyIndicators.json';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ComposedChart, Line } from 'recharts';
import { AlertCircle, AlertTriangle, Clock } from 'lucide-react';

const OverviewTab = ({ anomalyAnalysis, riskDistribution, performanceData, riskCorrelation, riskRejectionData, apiData, patternAnalysis, highRiskCount, setActiveTab, setFilterRisk }) => {
  // Use landing.json data for RO risk distribution
  const roRiskData = Array.isArray(aggregatedRoCounts)
  ? aggregatedRoCounts.map(ro => ({
      ro: ro.Ro,
      high: ro.high_risk || 0,
      medium: ro.med_risk || 0,
      low: ro.low_risk || 0,
      no: ro.no_risk || 0,
      total: ro.total || 0
    }))
  : [];

  // Pie chart data for user's RO group only
  const userGroup = userData?.grouptype;
  const groupData = Array.isArray(aggregatedRoCounts)
    ? aggregatedRoCounts.find(ro => ro.Ro === userGroup)
    : null;
  const pieChartData = [
    { name: 'Low Risk', value: groupData?.low_risk || 0, color: '#10b981' },
    { name: 'Medium Risk', value: groupData?.med_risk || 0, color: '#f59e0b' },
    { name: 'High Risk', value: groupData?.high_risk || 0, color: '#ef4444' },
    { name: 'No Risk', value: groupData?.no_risk || 0, color: '#6366f1' }
  ];

  return (
    <div className="space-y-6">
      {/* Key Insights - Compact View */}
      {(apiData?.key_insights || apiData) && (
        <div className="bg-white rounded-xl shadow-md p-4 border">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {/* Highest Risk Operator */}
            {apiData?.key_insights && (
              <div className="text-center p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-semibold text-red-800">High Risk</span>
                </div>
                <p className="text-sm font-bold text-red-900 truncate">{apiData.key_insights.high_riskopt.name}</p>
                <p className="text-lg font-bold text-red-600">{(apiData.key_insights.high_riskopt.score * 100).toFixed(1)}%</p>
              </div>
            )}

            {/* Most Common Anomaly */}
            {apiData?.key_insights && (
              <div className="text-center p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-semibold text-orange-800">Common Issue</span>
                </div>
                <p className="text-sm font-bold text-orange-900 truncate">{apiData.key_insights.most_common_anomoly.anomoly_type}</p>
                <p className="text-lg font-bold text-orange-600">{apiData.key_insights.most_common_anomoly.opt_num} ops</p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Key Insights Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-5 text-white">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white bg-opacity-20 rounded-lg p-3 flex flex-col">
            <h3 className="font-semibold mb-1.5 text-base">Highest <span className="text-red-300">Risk</span> Operator</h3>
            <div className="flex-grow">
              <p className="text-lg font-semibold">{keyIndicators.highest_risk_opt.opt_name}</p>
              <p className="text-sm opacity-90">Risk Score: {(keyIndicators.highest_risk_opt.risk_score * 100).toFixed(1)}%</p>
              <p className="text-sm opacity-75">{keyIndicators.highest_risk_opt.opt_id}</p>
            </div>
            <button 
              onClick={() => {
                setActiveTab('operators');
                setFilterRisk('high');
              }}
              className="mt-2 w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-1.5 px-3 text-sm rounded-lg transition duration-200 shadow-md"
            >
              Investigate
            </button>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3 flex flex-col">
            <h3 className="font-semibold mb-1.5 text-base">Most Common <span className="text-yellow-300">Anomaly</span></h3>
            <div className="flex-grow">
              <p className="text-lg font-semibold">Stale Machine Sync</p>
              <p className="text-sm opacity-90">Found in {keyIndicators.most_common_anomaly["Stale Machine Sync"]} operators</p>
            </div>
            <button 
              onClick={() => setActiveTab('patterns')}
              className="mt-2 w-full bg-white text-purple-600 hover:bg-purple-50 font-semibold py-1.5 px-3 text-sm rounded-lg transition duration-200 shadow-md"
            >
              Investigate
            </button>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3 flex flex-col hover:bg-opacity-30 transition-all">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-2xl">🚨</span>
              <h3 className="font-bold text-base">Urgent Feedback Required</h3>
            </div>
            <div className="flex-grow">
              <div className="mb-2">
                <p className="text-2xl font-bold">
                  {apiData ? apiData.action_required_opt : highRiskCount}
                </p>
                <p className="text-sm opacity-90">operators need immediate attention</p>
              </div>
          
            </div>
            <button 
              onClick={() => {
                setActiveTab('operators');
                setFilterRisk('high');
              }}
              className="mt-2 w-full bg-white text-red-600 hover:bg-red-50 font-semibold py-1.5 px-3 text-sm rounded-lg transition duration-200 shadow-md"
            >
              Review Now
            </button>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RO Risk Distribution - Vertical Stacked Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Regional Office Risk Distribution</h2>
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">8 Regional Offices</span>
          </div>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={roRiskData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="ro" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 11, fill: '#374151' }}
                interval={0}
              />
              <YAxis 
                label={{ value: 'Number of Operators', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
                tick={{ fontSize: 11, fill: '#374151' }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const total = payload.reduce((sum, item) => sum + item.value, 0);
                    return (
                      <div className="bg-white p-4 border-2 border-blue-200 rounded-lg shadow-xl">
                        <p className="font-bold text-gray-900 mb-2 text-base">{payload[0].payload.ro}</p>
                        <div className="border-t pt-2 space-y-1">
                          <p className="text-sm font-semibold text-gray-700">Total: {total} operators</p>
                          {payload.reverse().map((item, index) => (
                            <div key={index} className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                                <span className="text-sm font-medium" style={{ color: item.fill }}>{item.name}</span>
                              </div>
                              <span className="text-sm font-bold text-gray-900">
                                {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Bar dataKey="high" stackId="a" fill="#ef4444" name="High Risk" radius={[0, 0, 0, 0]} />
              <Bar dataKey="medium" stackId="a" fill="#f59e0b" name="Medium Risk" />
              <Bar dataKey="low" stackId="a" fill="#10b981" name="Low Risk" />
              <Bar dataKey="noRisk" stackId="a" fill="#6b7280" name="No Risk" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution - Pie Chart for User's RO Group */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{userGroup} Risk Distribution</h2>
          <ResponsiveContainer width="100%" height={450}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="45%"
                labelLine={true}
                label={({ name, value, percent }) => `${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={140}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={3}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const total = pieChartData.reduce((sum, item) => sum + item.value, 0);
                    const percent = ((payload[0].value / total) * 100).toFixed(1);
                    return (
                      <div className="bg-white p-3 border-2 rounded-lg shadow-lg" style={{ borderColor: payload[0].payload.color }}>
                        <p className="font-bold text-gray-900">{payload[0].name}</p>
                        <p className="text-lg font-bold" style={{ color: payload[0].payload.color }}>
                          {payload[0].value} operators
                        </p>
                        <p className="text-sm text-gray-600">{percent}% of total</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={60}
                iconType="circle"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

  
      </div>

    

      {/* Risk Score vs Packet Update Rejection Rate */}
      {/* <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Risk Score vs Packet Update Rejection Rate</h2>
        <p className="text-gray-600 mb-4">Analyzing the relationship between operator risk scores and packet update rejection rates</p>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={riskRejectionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="opt_name" angle={-45} textAnchor="end" height={120} interval={0} tick={{ fontSize: 10 }} />
            <YAxis yAxisId="left" label={{ value: 'Risk Score (%)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Rejection Rate (%)', angle: 90, position: 'insideRight' }} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="font-bold text-gray-900">{payload[0].payload.opt_name}</p>
                      <p className="text-sm text-blue-600">Risk Score: {payload[0].payload.risk_score_percent}%</p>
                      <p className="text-sm text-red-600">Rejection Rate: {payload[0].payload.pkt_updt_rejection_rate}%</p>
                      <p className="text-sm text-gray-600">District: {payload[0].payload.opt_district}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="risk_score_percent" fill="#3b82f6" name="Risk Score (%)" />
            <Line yAxisId="right" type="monotone" dataKey="pkt_updt_rejection_rate" stroke="#ef4444" strokeWidth={3} name="Rejection Rate (%)" dot={{ r: 5 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div> */}
    </div>
  );
};

export default OverviewTab;
