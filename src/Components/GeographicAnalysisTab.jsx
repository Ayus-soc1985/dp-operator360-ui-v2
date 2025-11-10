import React from 'react';
import { MapPin } from 'lucide-react';

const GeographicAnalysisTab = ({ geographicRisk, anomalyAnalysis }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-500" />
          Geographic Risk Distribution
        </h2>
        <p className="text-gray-600 mb-4">Risk assessment by district and location-based anomaly patterns</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {geographicRisk.map((location, idx) => (
            <div key={idx} className="border rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">{location.district}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  location.avgRisk > 15 ? 'bg-red-100 text-red-700' :
                  location.avgRisk > 10 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {location.avgRisk}% Risk
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Operators</div>
                  <div className="text-2xl font-bold text-blue-600">{location.operators}</div>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Total Anomalies</div>
                  <div className="text-2xl font-bold text-orange-600">{location.totalAnomalies}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Out-of-District Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Cross-District Activity Patterns</h3>
        <div className="space-y-3">
          {anomalyAnalysis.map((op, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{op.opt_name}</div>
                <div className="text-sm text-gray-600">{op.opt_district}, {op.opt_state}</div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  op.outDistrictPercentage > 20 ? 'text-red-600' :
                  op.outDistrictPercentage > 10 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {op.outDistrictPercentage.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Out-of-District</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeographicAnalysisTab;
