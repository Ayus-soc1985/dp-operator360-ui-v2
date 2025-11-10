import React from 'react';
import { Zap } from 'lucide-react';
import { BarChart, Bar, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VelocityAnalysisTab = ({ velocityData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          Processing Velocity vs Quality Analysis
        </h2>
        <p className="text-gray-600 mb-4">Correlation between processing speed, volume, and error rates</p>
        
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={velocityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="packets_per_day" fill="#3b82f6" name="Packets/Day" />
            <Line yAxisId="right" type="monotone" dataKey="rejection_rate" stroke="#ef4444" name="Rejection Rate %" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="anomaly_score" stroke="#8b5cf6" name="Anomaly Score" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Speed Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Processing Duration Analysis</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={velocityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg_duration" fill="#10b981" name="Avg Duration (min)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Velocity Insights</h3>
          <div className="space-y-3">
            {velocityData.map((op, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{op.name}</div>
                  <div className="text-sm text-gray-600">{op.packets_per_day} pkts/day in {op.avg_duration} min</div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    op.anomaly_score > 50 ? 'text-red-600' :
                    op.anomaly_score > 25 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {op.anomaly_score}
                  </div>
                  <div className="text-xs text-gray-500">Anomaly Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VelocityAnalysisTab;
