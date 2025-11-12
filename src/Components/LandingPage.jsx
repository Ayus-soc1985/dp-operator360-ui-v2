import React, { useState, useEffect } from 'react';
import { Shield, Lock, CheckCircle, TrendingUp } from 'lucide-react';
import authService from '../services/AuthService';

const LandingPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Error checking authentication:', err);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.login();
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to initiate login. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d2c5e7] via-[#e8dff2] to-white flex items-center justify-center p-4">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding and Features */}
        <div className="text-center lg:text-left space-y-6 fade-in-up">
          <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
            <Shield className="w-8 h-8 text-[#9b7bb5]" />
            <h1 className="text-2xl font-bold text-gray-800">Operator 360</h1>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            Comprehensive Operator
            <span className="block text-[#9b7bb5]">Anomaly Detection</span>
          </h2>
          
          <p className="text-lg text-gray-700 leading-relaxed">
            Monitor, analyze, and manage operator activities with advanced anomaly detection and real-time insights.
          </p>

          {/* Features */}
          <div className="space-y-4 pt-4">
            {[
              { icon: CheckCircle, text: 'Real-time anomaly detection' },
              { icon: TrendingUp, text: 'Performance analytics dashboard' },
              { icon: Shield, text: 'Secure OIDC authentication' }
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 bg-white/40 backdrop-blur-sm rounded-lg px-4 py-3 fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <feature.icon className="w-5 h-5 text-green-600" />
                <span className="text-gray-800 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Card */}
        <div className="flex justify-center lg:justify-end">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border-2 border-[#d2c5e7] fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#9b7bb5] to-[#d2c5e7] rounded-full mb-4 float-animation">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Secure Sign In</h3>
              <p className="text-gray-600">Access your operator dashboard</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              onClick={handleSignIn}
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#9b7bb5] to-[#d2c5e7] hover:from-[#7a5f93] hover:to-[#9b7bb5] text-white hover:shadow-xl hover:scale-105 active:scale-95'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Redirecting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock className="w-5 h-5" />
                  Sign In with SSO
                </span>
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Secured by WSO2 Identity Server
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-600">OIDC Protocol</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                By signing in, you agree to use Active Directory credentials
                for authentication via OIDC protocol.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-10 right-10 w-32 h-32 bg-[#d2c5e7] rounded-full opacity-20 blur-3xl float-animation"></div>
      <div className="fixed bottom-10 left-10 w-40 h-40 bg-[#9b7bb5] rounded-full opacity-10 blur-3xl float-animation" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default LandingPage;
