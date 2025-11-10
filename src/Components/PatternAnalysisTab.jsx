import React from 'react';
import { Target } from 'lucide-react';

const PatternAnalysisTab = ({ patternAnalysis, getCategoryColor }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-purple-500" />
          Common Anomaly Patterns Across Operators
        </h2>
        <p className="text-gray-600 mb-4">Identifying recurring issues that affect multiple operators</p>
        
        <div className="space-y-3">
          {patternAnalysis.map((pattern, idx) => (
            <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${getCategoryColor(pattern.category)}`}></span>
                  <h3 className="font-bold text-gray-900">{pattern.type}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    pattern.severity === 'high' ? 'bg-red-100 text-red-700' :
                    pattern.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {pattern.severity.toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-purple-600">{pattern.count}</span>
                  <span className="text-sm text-gray-500 ml-1">operators</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Affected operators:</span> {pattern.operators.join(', ')}
              </div>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded text-xs ${getCategoryColor(pattern.category)} text-white`}>
                  {pattern.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Anomaly Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['fraud', 'quality', 'velocity', 'geographic', 'technical', 'productivity', 'pattern'].map(category => {
            const count = patternAnalysis.filter(p => p.category === category).length;
            return (
              <div key={category} className="border rounded-lg p-4 text-center">
                <div className={`w-12 h-12 rounded-full ${getCategoryColor(category)} mx-auto mb-2 opacity-20`}></div>
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{category}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PatternAnalysisTab;
