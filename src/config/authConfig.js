/**
 * OIDC Authentication Configuration for WSO2 Identity Server 5.11
 * 
 * IMPORTANT: Replace the placeholder values with your actual WSO2 configuration
 */

// Support runtime environment variables from window._env_ (for Docker deployments)
const getEnvVar = (key, defaultValue) => {
  return (window._env_ && window._env_[key]) || process.env[key] || defaultValue;
};

const authConfig = {
  // WSO2 Identity Server Authority (Base URL)
  authority: getEnvVar('REACT_APP_WSO2_AUTHORITY', 'https://sso.uidai.net.in/oauth2/token/.well-known/openid-configuration'),
  
  // Client ID provided by WSO2 for your application
  client_id: getEnvVar('REACT_APP_CLIENT_ID', '9HGuTetQjRjxkx1vHmoP1v0fXm8a'),
  
  // Client Secret (if your application is confidential)
  client_secret: getEnvVar('REACT_APP_CLIENT_SECRET', 'RlsK9p2f4kJ_iKBZLSgiBYuIKjQa'), // Leave empty for public clients
  
  // Redirect URI after successful authentication
  redirect_uri: getEnvVar('REACT_APP_REDIRECT_URI', 'http://localhost:3000/callback'),
  
  // Redirect URI after logout
  post_logout_redirect_uri: getEnvVar('REACT_APP_POST_LOGOUT_REDIRECT_URI', 'http://localhost:3000'),
  
  // Response type - using authorization code flow
  response_type: 'code',
  
  // Scopes to request
  scope: 'openid profile email',
  
  // Automatically silent renew the access token
  automaticSilentRenew: true,
  
  // Silent redirect URI
  silent_redirect_uri: getEnvVar('REACT_APP_SILENT_REDIRECT_URI', 'http://localhost:3000/silent-renew'),
  
  // Additional metadata for WSO2 IS 5.11 (if autodiscovery fails)
  metadata: {
    issuer: 'https://sso.uidai.net.in/oauth2/token',
    authorization_endpoint: 'https://sso.uidai.net.in:443/oauth2/authorize',
    token_endpoint: 'https://sso.uidai.net.in:443/oauth2/token',
    userinfo_endpoint: 'https://sso.uidai.net.in:443/oauth2/userinfo',
    end_session_endpoint: 'https://sso.uidai.net.in:443/oidc/logout',
    jwks_uri: 'https://sso.uidai.net.in:443/oauth2/jwks',
  },
  
  // PKCE support (recommended for public clients)
  code_challenge_method: 'S256',
  
  // Load user info after authentication
  loadUserInfo: true,
  
  // Filter OIDC protocol claims
  filterProtocolClaims: true,
  
  // Include ID token in silent renew
  includeIdTokenInSilentRenew: true,
};

export default authConfig;
