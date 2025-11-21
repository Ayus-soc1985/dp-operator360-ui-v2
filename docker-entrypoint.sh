#!/bin/sh
# Runtime environment configuration for React app

# This script generates a runtime config file that can override build-time configs
# Useful for updating redirect URIs based on deployment environment

cat > /usr/share/nginx/html/env-config.js << EOF
window._env_ = {
  REACT_APP_WSO2_AUTHORITY: "${REACT_APP_WSO2_AUTHORITY:-https://sso.uidai.net.in/oauth2/token/.well-known/openid-configuration}",
  REACT_APP_CLIENT_ID: "${REACT_APP_CLIENT_ID:-9HGuTetQjRjxkx1vHmoP1v0fXm8a}",
  REACT_APP_CLIENT_SECRET: "${REACT_APP_CLIENT_SECRET:-RlsK9p2f4kJ_iKBZLSgiBYuIKjQa}",
  REACT_APP_REDIRECT_URI: "${REACT_APP_REDIRECT_URI:-http://localhost:3000/callback}",
  REACT_APP_POST_LOGOUT_REDIRECT_URI: "${REACT_APP_POST_LOGOUT_REDIRECT_URI:-http://localhost:3000}",
  REACT_APP_SILENT_REDIRECT_URI: "${REACT_APP_SILENT_REDIRECT_URI:-http://localhost:3000/silent-renew}"
};
EOF

echo "Runtime environment configuration generated"
cat /usr/share/nginx/html/env-config.js

# Start nginx
exec nginx -g "daemon off;"
