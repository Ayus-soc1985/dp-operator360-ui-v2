import React, { useMemo } from 'react';
import { Target, AlertTriangle, Shield, Settings, FileText, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import highRiskOpt from '../resources/opt_data/high_risk_opt.json';
import medRiskOpt from '../resources/opt_data/med_risk_opt.json';
import lowRiskOpt from '../resources/opt_data/low_risk_opt.json';

const PatternAnalysisTab = () => {
  // Process anomaly data from all risk levels
  const anomalyData = useMemo(() => {
    const allOperators = {
      ...Object.fromEntries(Object.entries(highRiskOpt).map(([key, value]) => [key, { ...value, riskLevel: 'high' }])),
      ...Object.fromEntries(Object.entries(medRiskOpt).map(([key, value]) => [key, { ...value, riskLevel: 'medium' }])),
      ...Object.fromEntries(Object.entries(lowRiskOpt).map(([key, value]) => [key, { ...value, riskLevel: 'low' }]))
    };

    // Define anomaly categories and their metadata
    const anomalyCategories = {
      'biometric': {
        name: 'Biometric',
        icon: Shield,
        color: 'bg-blue-500'
      },
      'document': {
        name: 'Document',
        icon: FileText,
        color: 'bg-green-500'
      },
      'hardware': {
        name: 'Hardware',
        icon: Settings,
        color: 'bg-orange-500'
      },
      'packet': {
        name: 'Packet',
        icon: Users,
        color: 'bg-purple-500'
      },
      'work': {
        name: 'Work',
        icon: AlertTriangle,
        color: 'bg-red-500'
      }
    };

    // Extract all anomaly fields dynamically
    const sampleOperator = Object.values(allOperators)[0] || {};
    const allAnomalyFields = Object.keys(sampleOperator).filter(key => 
      key.includes('risk') || key.includes('AnomalyScore')
    );

    // Anomaly risk definitions and thresholds
    const anomalyDefinitions = {
      'work_machinesync_risk': {
        name: 'Stale Machine Sync',
        description: "Operator's average sync durations are more than 48 hours which is the expected sync",
        threshold: 0.5,
        severity: 'high'
      },
      'packet_mobchange_risk': {
        name: 'Suspicious Mobile Update Packets',
        description: 'Unusual frequency of mobile number changes in enrollment packets',
        threshold: 0.3,
        severity: 'medium'
      },
      'packet_namechange_risk': {
        name: 'Suspicious Name Change Packets',
        description: 'High frequency of name modifications in enrollment packets',
        threshold: 0.3,
        severity: 'medium'
      },
      'document_pob_risk': {
        name: 'Unverified Proof of Birth',
        description: 'Proof of birth documents which are not verified but declared by the operator',
        threshold: 0.4,
        severity: 'high'
      },
      'biometric_mfc_risk': {
        name: 'Unsystematic Biometric Capture',
        description: 'Biometric packets found with unsystematic capture patterns',
        threshold: 0.4,
        severity: 'high'
      },
      'packet_outstate_risk': {
        name: 'Out of State Enrollments',
        description: 'High number of out-of-state enrollments done by operator',
        threshold: 0.2,
        severity: 'medium'
      },
      'packet_hof_risk': {
        name: 'Self HOF Packets',
        description: 'High number of packets where operator is acting as Head of Family (HOF)',
        threshold: 0.3,
        severity: 'medium'
      },
      'hardware_biodev_risk': {
        name: 'Frequent Device Changes',
        description: 'Frequent change of biometric devices on the machine used by operator',
        threshold: 0.3,
        severity: 'medium'
      },
      'document_grave_risk': {
        name: 'Grave Document Errors',
        description: 'Grave errors identified by QC in documents scanned by operator',
        threshold: 0.4,
        severity: 'high'
      },
      'hardware_machineclone_risk': {
        name: 'Machine Cloning Risk',
        description: 'High possibility of machine being cloned that the operator is using',
        threshold: 0.5,
        severity: 'high'
      },
      'work_optname_risk': {
        name: 'Multiple Operator Names',
        description: 'Operator ID linked with multiple operator names',
        threshold: 0.3,
        severity: 'high'
      },
      'hardware_machinechange_risk': {
        name: 'Frequent Machine Changes',
        description: 'Operator frequently changing machines or workstations',
        threshold: 0.3,
        severity: 'medium'
      },
      'biometric_sfc_risk': {
        name: 'Biometric SFC Risk',
        description: 'Issues with biometric Single Finger Capture quality or patterns',
        threshold: 0.4,
        severity: 'medium'
      }
    };

    // Parse anomaly fields and categorize them
    const parseAnomalyField = (fieldName) => {
      const definition = anomalyDefinitions[fieldName];
      
      if (fieldName.endsWith('AnomalyScore')) {
        const category = fieldName.replace('AnomalyScore', '').toLowerCase();
        return {
          category,
          type: 'Overall Score',
          name: `${category.charAt(0).toUpperCase() + category.slice(1)} Anomaly Score`,
          description: `Composite anomaly score for ${category} category`,
          isScore: true,
          threshold: 0.5,
          severity: 'medium'
        };
      } else if (definition) {
        const parts = fieldName.split('_');
        const category = parts[0].toLowerCase();
        return {
          category,
          type: parts.slice(1, -1).join(' '),
          name: definition.name,
          description: definition.description,
          threshold: definition.threshold,
          severity: definition.severity,
          isScore: false
        };
      } else if (fieldName.includes('_') && fieldName.endsWith('_risk')) {
        const parts = fieldName.split('_');
        if (parts.length >= 3) {
          const category = parts[0].toLowerCase();
          const type = parts.slice(1, -1).join(' ');
          return {
            category,
            type,
            name: type.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Risk',
            description: `Risk indicator for ${type} patterns`,
            threshold: 0.3,
            severity: 'medium',
            isScore: false
          };
        }
      }
      return null;
    };

    // Count anomalies by category and type
    const categoryStats = {};
    const typeStats = {};
    const riskLevelStats = { high: 0, medium: 0, low: 0 };

    Object.entries(allOperators).forEach(([optId, operator]) => {
      riskLevelStats[operator.riskLevel]++;
      
      allAnomalyFields.forEach(field => {
        const parsed = parseAnomalyField(field);
        if (!parsed || !anomalyCategories[parsed.category]) return;

        const value = operator[field];
        const numValue = parseFloat(value);
        // Check if anomaly is detected (score above threshold)
        if (value !== null && value !== undefined && value !== '' && !isNaN(numValue) && numValue > (parsed.threshold || 0)) {
          const categoryName = anomalyCategories[parsed.category].name;
          
          // Initialize category stats if not exists
          if (!categoryStats[categoryName]) {
            categoryStats[categoryName] = {
              name: categoryName,
              categoryKey: parsed.category,
              high: 0,
              medium: 0,
              low: 0,
              total: 0,
              ...anomalyCategories[parsed.category]
            };
          }

          // Count anomaly
          categoryStats[categoryName][operator.riskLevel]++;
          categoryStats[categoryName].total++;

          // Track individual anomaly types
          const typeKey = `${parsed.category}_${parsed.type}`;
          if (!typeStats[typeKey]) {
            typeStats[typeKey] = {
              name: parsed.name,
              category: categoryName,
              categoryKey: parsed.category,
              fieldName: field,
              description: parsed.description,
              threshold: parsed.threshold,
              severity: parsed.severity,
              isScore: parsed.isScore,
              avgRiskScore: 0,
              maxRiskScore: 0,
              high: 0,
              medium: 0,
              low: 0,
              total: 0,
              riskSum: 0
            };
          }
          typeStats[typeKey][operator.riskLevel]++;
          typeStats[typeKey].total++;
          typeStats[typeKey].riskSum += numValue;
          typeStats[typeKey].avgRiskScore = typeStats[typeKey].riskSum / typeStats[typeKey].total;
          typeStats[typeKey].maxRiskScore = Math.max(typeStats[typeKey].maxRiskScore, numValue);
        }
      });
    });

    return {
      categoryStats: Object.values(categoryStats),
      typeStats: Object.values(typeStats).sort((a, b) => b.total - a.total),
      riskLevelStats,
      totalOperators: Object.keys(allOperators).length
    };
  }, []);

  const pieChartColors = ['#8b5cf6', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
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
                  <span className="text-sm capitalize">{entry.name}:</span>
                </div>
                <span className="font-medium">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Operators</p>
              <p className="text-2xl font-bold text-gray-900">{anomalyData.totalOperators.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-red-600">{anomalyData.riskLevelStats.high.toLocaleString()}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Medium Risk</p>
              <p className="text-2xl font-bold text-yellow-600">{anomalyData.riskLevelStats.medium.toLocaleString()}</p>
            </div>
            <Shield className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Risk</p>
              <p className="text-2xl font-bold text-blue-600">{anomalyData.riskLevelStats.low.toLocaleString()}</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Anomaly Categories - Enhanced Visualization */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-purple-500" />
          Anomaly Categories Analysis
        </h2>
        
        {/* Interactive Category Cards with Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {anomalyData.categoryStats.map((category, index) => {
            const IconComponent = category.icon;
            const totalPercentage = Math.round((category.total / anomalyData.totalOperators) * 100);
            const highPercentage = category.total > 0 ? Math.round((category.high / category.total) * 100) : 0;
            const mediumPercentage = category.total > 0 ? Math.round((category.medium / category.total) * 100) : 0;
            const lowPercentage = category.total > 0 ? Math.round((category.low / category.total) * 100) : 0;
            
            return (
              <div key={category.name} className="border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-purple-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{category.total.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{totalPercentage}% of operators</div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name} Anomalies</h3>
                <div className="text-xs text-gray-600 mb-3">
                  {anomalyData.typeStats.filter(type => type.categoryKey === category.categoryKey).length} anomaly types detected
                </div>
                
                {/* Risk Level Breakdown with Progress Bars */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      High Risk
                    </span>
                    <span className="font-medium">{category.high} ({highPercentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${highPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      Medium Risk
                    </span>
                    <span className="font-medium">{category.medium} ({mediumPercentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${mediumPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Low Risk
                    </span>
                    <span className="font-medium">{category.low} ({lowPercentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${lowPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparative Donut Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Distribution Donut */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Anomaly Distribution by Category</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={anomalyData.categoryStats.map(cat => ({ name: cat.name, value: cat.total }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {anomalyData.categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value.toLocaleString(), 'Operators']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Severity Donut */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Overall Risk Distribution</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'High Risk', value: anomalyData.riskLevelStats.high, fill: '#ef4444' },
                      { name: 'Medium Risk', value: anomalyData.riskLevelStats.medium, fill: '#f59e0b' },
                      { name: 'Low Risk', value: anomalyData.riskLevelStats.low, fill: '#3b82f6' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {[{ fill: '#ef4444' }, { fill: '#f59e0b' }, { fill: '#3b82f6' }].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value.toLocaleString(), 'Operators']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Anomaly Types - Enhanced */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Anomaly Types Breakdown</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {anomalyData.typeStats.slice(0, 12).map((type, idx) => {
            const category = anomalyData.categoryStats.find(cat => cat.name === type.category);
            const IconComponent = category?.icon || Target;
            const totalPercentage = Math.round((type.total / anomalyData.totalOperators) * 100);
            
            return (
              <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-purple-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${category?.color || 'bg-gray-500'} flex items-center justify-center`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        {type.isScore ? `${category?.name} Score` : `${type.name} Risk`}
                      </h4>
                      <div className="text-xs text-gray-600 mb-1">
                        <span className="font-mono bg-gray-200 px-2 py-1 rounded">
                          {type.fieldName}
                        </span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {type.category} • {type.isScore ? 'Score' : 'Risk'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-purple-600">{type.total.toLocaleString()}</span>
                    <div className="text-xs text-gray-500">{totalPercentage}% affected</div>
                  </div>
                </div>
                
                {/* Mini progress indicators */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>High</span>
                    </div>
                    <span className="font-medium">{type.high}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-red-500 h-1 rounded-full" 
                      style={{ width: `${type.total > 0 ? (type.high / type.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Medium</span>
                    </div>
                    <span className="font-medium">{type.medium}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-yellow-500 h-1 rounded-full" 
                      style={{ width: `${type.total > 0 ? (type.medium / type.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Low</span>
                    </div>
                    <span className="font-medium">{type.low}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full" 
                      style={{ width: `${type.total > 0 ? (type.low / type.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Anomaly Structure Overview */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Anomaly Structure by Category</h3>
        <div className="space-y-6">
          {anomalyData.categoryStats.map((category) => {
            const categoryTypes = anomalyData.typeStats.filter(type => type.categoryKey === category.categoryKey);
            if (categoryTypes.length === 0) return null;
            
            const IconComponent = category.icon;
            const overallScore = categoryTypes.find(type => type.isScore);
            const riskTypes = categoryTypes.filter(type => !type.isScore);
            
            return (
              <div key={category.name} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{category.name} Category</h4>
                    <p className="text-sm text-gray-600">
                      {categoryTypes.length} anomaly indicators • {category.total.toLocaleString()} total occurrences
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Overall Score */}
                  {overallScore && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-blue-900">Overall Anomaly Score</h5>
                        <span className="text-sm font-bold text-blue-700">{overallScore.total}</span>
                      </div>
                      <p className="text-xs text-blue-700 font-mono">{overallScore.fieldName}</p>
                    </div>
                  )}
                  
                  {/* Risk Types */}
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-700 text-sm">Risk Types:</h5>
                    {riskTypes.map((riskType, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded text-sm">
                        <span className="text-gray-700 capitalize">{riskType.name}</span>
                        <span className="font-medium text-gray-900">{riskType.total}</span>
                      </div>
                    ))}
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

export default PatternAnalysisTab;
