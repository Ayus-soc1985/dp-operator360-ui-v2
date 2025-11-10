import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ComposedChart, Line } from 'recharts';

const OverviewTab = ({ anomalyAnalysis, riskDistribution, performanceData, riskCorrelation, riskRejectionData }) => {
  return (
    <div className="space-y-6">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Risk Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quality Metrics Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="rejection_rate" fill="#ef4444" name="Rejection Rate %" />
              <Bar dataKey="qc_error_rate" fill="#f59e0b" name="QC Error Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Correlation Scatter */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Risk Score vs Anomaly Count Correlation</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="risk_score" name="Risk Score %" />
            <YAxis dataKey="anomaly_count" name="Anomaly Count" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="Operators" data={riskCorrelation} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Score vs Packet Update Rejection Rate */}
      <div className="bg-white rounded-xl shadow-md p-6">
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
      </div>
    </div>
  );
};

export default OverviewTab;
