import React, { useState, useMemo } from 'react';
import { MapPin, ArrowLeft, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import landingData from '../resources/landing.json';

const GeographicAnalysisTab = ({ selectedRo = 'Bengaluru' }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [drillLevel, setDrillLevel] = useState('state'); // 'state' or 'district'

  // Process data to get risk distribution by state and district
  const processedData = useMemo(() => {

    // Filter landing data by selected RO
    const roData = landingData.filter(item => item.RO === selectedRo);
    
    // Group by state
    const stateGroups = roData.reduce((acc, item) => {
      if (!acc[item.STATE]) {
        acc[item.STATE] = {
          state: item.STATE,
          districts: {},
          high_risk: 0,
          med_risk: 0,
          low_risk: 0,
          no_risk: 0
        };
      }
      
      // Initialize district if not exists
      if (!acc[item.STATE].districts[item.DISTRICT]) {
        acc[item.STATE].districts[item.DISTRICT] = {
          district: item.DISTRICT,
          high_risk: item.high_risk_opt || 0,
          med_risk: item.med_risk_opt || 0,
          low_risk: item.low_risk_opt || 0,
          no_risk: item.no_risk_opt || 0
        };
      }
      
      // Aggregate state totals
      acc[item.STATE].high_risk += item.high_risk_opt || 0;
      acc[item.STATE].med_risk += item.med_risk_opt || 0;
      acc[item.STATE].low_risk += item.low_risk_opt || 0;
      acc[item.STATE].no_risk += item.no_risk_opt || 0;
      
      return acc;
    }, {});
    
    // State totals are already calculated in the reduce function above
    
    return stateGroups;
  }, [selectedRo]);

  // Prepare chart data based on drill level
  const chartData = useMemo(() => {
    if (drillLevel === 'state') {
      return Object.values(processedData).map(state => ({
        name: state.state,
        high_risk: state.high_risk,
        med_risk: state.med_risk,
        low_risk: state.low_risk,
        no_risk: state.no_risk
      }));
    } else if (selectedState && processedData[selectedState]) {
      return Object.values(processedData[selectedState].districts).map(district => ({
        name: district.district,
        high_risk: district.high_risk,
        med_risk: district.med_risk,
        low_risk: district.low_risk,
        no_risk: district.no_risk
      }));
    }
    return [];
  }, [processedData, drillLevel, selectedState]);

  const handleBarClick = (data) => {
    if (drillLevel === 'state' && processedData[data.name]) {
      setSelectedState(data.name);
      setDrillLevel('district');
    }
  };

  const handleBackToStates = () => {
    setSelectedState(null);
    setDrillLevel('state');
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">{entry.name.replace('_', ' ').toUpperCase()}:</span>
                </div>
                <span className="font-medium">{entry.value}</span>
              </div>
            ))}
            <hr className="my-2" />
            <div className="flex items-center justify-between font-semibold">
              <span>Total:</span>
              <span>{total}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Region Evaluation - {selectedRo} RO
              </h2>
              <p className="text-gray-600">
                {drillLevel === 'state' 
                  ? `Risk distribution by states in ${selectedRo} region` 
                  : `Risk distribution by districts in ${selectedState}`
                }
              </p>
            </div>
          </div>
          
          {drillLevel === 'district' && (
            <button
              onClick={handleBackToStates}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to States
            </button>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Low Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>No Risk</span>
            </div>
          </div>
        </div>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="high_risk" 
                name="High Risk" 
                fill="#ef4444"
                onClick={handleBarClick}
                style={{ cursor: drillLevel === 'state' ? 'pointer' : 'default' }}
              />
              <Bar 
                dataKey="med_risk" 
                name="Medium Risk" 
                fill="#eab308"
                onClick={handleBarClick}
                style={{ cursor: drillLevel === 'state' ? 'pointer' : 'default' }}
              />
              <Bar 
                dataKey="low_risk" 
                name="Low Risk" 
                fill="#3b82f6"
                onClick={handleBarClick}
                style={{ cursor: drillLevel === 'state' ? 'pointer' : 'default' }}
              />
              <Bar 
                dataKey="no_risk" 
                name="No Risk" 
                fill="#22c55e"
                onClick={handleBarClick}
                style={{ cursor: drillLevel === 'state' ? 'pointer' : 'default' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {drillLevel === 'state' && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">Click on any state bar to view district-wise breakdown</span>
            </div>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {drillLevel === 'state' ? 'State-wise Summary' : `${selectedState} Districts Summary`}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {chartData.map((item, index) => {
            const total = item.high_risk + item.med_risk + item.low_risk + item.no_risk;
            return (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 truncate" title={item.name}>
                  {item.name}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600">High Risk:</span>
                    <span className="font-medium">{item.high_risk}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-600">Medium Risk:</span>
                    <span className="font-medium">{item.med_risk}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600">Low Risk:</span>
                    <span className="font-medium">{item.low_risk}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">No Risk:</span>
                    <span className="font-medium">{item.no_risk}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Total:</span>
                    <span>{total}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GeographicAnalysisTab;
