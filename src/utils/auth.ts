/**
 * Authentication utilities for the application
 */

/**
 * Creates a Basic Auth token from username and password
 * @param username - The username
 * @param password - The password
 * @returns Base64 encoded Basic Auth token
 */
export const createBasicAuthToken = (
  username: string,
  password: string
): string => {
  const token = btoa(`${username}:${password}`);
  return token;
};

/**
 * Initializes authentication by creating and storing the Basic Auth token
 * Uses credentials from environment variables
 */
export const initializeAuth = async (): Promise<void> => {
  try {
    // Use credentials from environment variables
    const username = import.meta.env.VITE_REACT_APP_AUTH_USERNAME || "";
    const password = import.meta.env.VITE_REACT_APP_AUTH_PASSWORD || "";

    if (!username || !password) {
      console.warn(
        "Authentication credentials not found in environment variables"
      );
      return;
    }

    const token = createBasicAuthToken(username, password);
    localStorage.setItem("authorization_token", token);
    console.log("Authentication initialized successfully");
  } catch (error) {
    console.error("Error initializing authentication:", error);
  }
};

/**
 * Gets the stored authorization token
 * @returns The Basic Auth token or null if not available
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem("authorization_token");
};

/**
 * Checks if the user is authenticated
 * @returns True if the user has an auth token, false otherwise
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Creates an Authorization header with the Basic Auth token
 * @returns Object with Authorization header or empty object if not authenticated
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Basic ${token}` } : {};
};
