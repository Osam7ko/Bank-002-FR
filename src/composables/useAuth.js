import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { userAPI } from "@/services/api";

const user = ref(null);
const token = ref(localStorage.getItem("token"));
const isLoading = ref(false);
const error = ref(null);

export function useAuth() {
  const router = useRouter();

  // Computed properties
  const isAuthenticated = computed(() => !!token.value);
  const currentUser = computed(() => user.value);

  // Initialize user from localStorage
  const initializeAuth = () => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      user.value = JSON.parse(storedUser);
      token.value = storedToken;
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await userAPI.login(credentials);

      if (response.data.responseCode === "Login success") {
        // JWT token is in responseMessage, user data is in accountInfo
        const authToken = response.data.responseMessage;
        const userData = response.data.accountInfo;

        if (authToken && userData) {
          token.value = authToken;
          user.value = userData;

          localStorage.setItem("token", authToken);
          localStorage.setItem("user", JSON.stringify(userData));

          router.push("/dashboard");
          return { success: true, data: response.data };
        } else {
          throw new Error("No token or user data received from server");
        }
      } else {
        throw new Error(response.data.responseMessage || "Login failed");
      }
    } catch (err) {
      error.value =
        err.response?.data?.responseMessage || err.message || "Login failed";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await userAPI.createAccount(userData);

      if (response.data.responseCode === "001") {
        // Registration successful, redirect to login
        router.push("/login");
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data.responseMessage || "Registration failed");
      }
    } catch (err) {
      error.value =
        err.response?.data?.responseMessage ||
        err.message ||
        "Registration failed";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Logout function
  const logout = () => {
    user.value = null;
    token.value = null;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  // Initialize auth on composable creation
  initializeAuth();

  return {
    // State
    user: currentUser,
    token,
    isLoading,
    error,

    // Computed
    isAuthenticated,

    // Methods
    login,
    register,
    logout,
    clearError,
    initializeAuth,
  };
}
