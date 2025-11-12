/**
 * OIDC Authentication Configuration for WSO2 Identity Server 5.11
 * 
 * IMPORTANT: Replace the placeholder values with your actual WSO2 configuration
 */

const authConfig = {
  // WSO2 Identity Server Authority (Base URL)
  authority: process.env.REACT_APP_WSO2_AUTHORITY || 'https://your-wso2-server.com:9443/oauth2/oidcdiscovery',
  
  // Client ID provided by WSO2 for your application
  client_id: process.env.REACT_APP_CLIENT_ID || 'YOUR_CLIENT_ID',
  
  // Client Secret (if your application is confidential)
  client_secret: process.env.REACT_APP_CLIENT_SECRET || '', // Leave empty for public clients
  
  // Redirect URI after successful authentication
  redirect_uri: process.env.REACT_APP_REDIRECT_URI || 'http://localhost:3000/callback',
  
  // Redirect URI after logout
  post_logout_redirect_uri: process.env.REACT_APP_POST_LOGOUT_REDIRECT_URI || 'http://localhost:3000',
  
  // Response type - using authorization code flow
  response_type: 'code',
  
  // Scopes to request
  scope: 'openid profile email',
  
  // Automatically silent renew the access token
  automaticSilentRenew: true,
  
  // Silent redirect URI
  silent_redirect_uri: process.env.REACT_APP_SILENT_REDIRECT_URI || 'http://localhost:3000/silent-renew',
  
  // Store tokens in session storage
  userStore: 'sessionStorage',
  
  // Additional metadata for WSO2 IS 5.11 (if autodiscovery fails)
  metadata: {
    issuer: process.env.REACT_APP_WSO2_ISSUER || 'https://your-wso2-server.com:9443/oauth2/token',
    authorization_endpoint: process.env.REACT_APP_AUTHORIZATION_ENDPOINT || 'https://your-wso2-server.com:9443/oauth2/authorize',
    token_endpoint: process.env.REACT_APP_TOKEN_ENDPOINT || 'https://your-wso2-server.com:9443/oauth2/token',
    userinfo_endpoint: process.env.REACT_APP_USERINFO_ENDPOINT || 'https://your-wso2-server.com:9443/oauth2/userinfo',
    end_session_endpoint: process.env.REACT_APP_END_SESSION_ENDPOINT || 'https://your-wso2-server.com:9443/oidc/logout',
    jwks_uri: process.env.REACT_APP_JWKS_URI || 'https://your-wso2-server.com:9443/oauth2/jwks',
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
