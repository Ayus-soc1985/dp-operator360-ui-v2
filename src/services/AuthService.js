import { UserManager, WebStorageStateStore, Log } from 'oidc-client-ts';
import authConfig from '../config/authConfig';

// Enable OIDC logging for debugging (disable in production)
Log.setLogger(console);
Log.setLevel(Log.DEBUG);

class AuthService {
  constructor() {
    // Initialize UserManager with OIDC configuration
    this.userManager = new UserManager({
      ...authConfig,
      stateStore: new WebStorageStateStore({ store: window.sessionStorage })
    });

    // Event listeners
    this.userManager.events.addUserLoaded((user) => {
      console.log('User loaded:', user);
    });

    this.userManager.events.addUserUnloaded(() => {
      console.log('User unloaded');
    });

    this.userManager.events.addAccessTokenExpiring(() => {
      console.log('Access token expiring...');
    });

    this.userManager.events.addAccessTokenExpired(() => {
      console.log('Access token expired');
      this.login();
    });

    this.userManager.events.addSilentRenewError((error) => {
      console.error('Silent renew error:', error);
    });
  }

  /**
   * Initiates the login process by redirecting to WSO2 Identity Server
   */
  async login() {
    try {
      // Store the current path to redirect back after login
      sessionStorage.setItem('redirectPath', window.location.pathname);
      
      await this.userManager.signinRedirect({
        state: { returnUrl: window.location.pathname }
      });
    } catch (error) {
      console.error('Error during login redirect:', error);
      throw error;
    }
  }

  /**
   * Handles the callback after successful authentication
   * Extracts authorization code and exchanges it for tokens
   */
  async handleCallback() {
    try {
      const user = await this.userManager.signinRedirectCallback();
      
      console.log('Authentication successful:', {
        userId: user.profile.sub,
        username: user.profile.preferred_username || user.profile.name,
        email: user.profile.email,
        accessToken: user.access_token ? 'Present' : 'Missing',
        idToken: user.id_token ? 'Present' : 'Missing'
      });

      // Get the return URL from state
      const returnUrl = user.state?.returnUrl || '/dashboard';
      
      return {
        user,
        returnUrl
      };
    } catch (error) {
      console.error('Error handling authentication callback:', error);
      throw error;
    }
  }

  /**
   * Logs out the user and redirects to WSO2 logout endpoint
   */
  async logout() {
    try {
      await this.userManager.signoutRedirect();
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  /**
   * Silently renews the access token
   */
  async renewToken() {
    try {
      const user = await this.userManager.signinSilent();
      return user;
    } catch (error) {
      console.error('Error renewing token:', error);
      throw error;
    }
  }

  /**
   * Gets the current authenticated user
   */
  async getUser() {
    try {
      const user = await this.userManager.getUser();
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  /**
   * Checks if user is authenticated
   */
  async isAuthenticated() {
    try {
      const user = await this.getUser();
      return user !== null && !user.expired;
    } catch (error) {
      return false;
    }
  }

  /**
   * Gets the access token
   */
  async getAccessToken() {
    try {
      const user = await this.getUser();
      return user?.access_token || null;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  /**
   * Gets the ID token
   */
  async getIdToken() {
    try {
      const user = await this.getUser();
      return user?.id_token || null;
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }

  /**
   * Gets user profile information
   */
  async getUserProfile() {
    try {
      const user = await this.getUser();
      return user?.profile || null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Removes user from storage (for silent logout)
   */
  async removeUser() {
    try {
      await this.userManager.removeUser();
    } catch (error) {
      console.error('Error removing user:', error);
    }
  }
}

// Create a singleton instance
const authService = new AuthService();

export default authService;
