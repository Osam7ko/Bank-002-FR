import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import authService from "@/services/auth/authService";

const user = ref(null);
const isLoading = ref(false);
const error = ref(null);

export function useAuth() {
  const router = useRouter();

  // Computed properties
  const isAuthenticated = computed(() => {
    const at = authService.getAccessToken();
    return !!at && !authService.isTokenExpired(0);
  });
  const currentUser = computed(() => user.value);

  // Bootstrap profile from cached local storage (no server call)
  const bootstrapProfile = async () => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      try {
        user.value = JSON.parse(cachedUser);
      } catch {
        user.value = null;
      }
    }
  };

  // Initialize auth on app start
  const initializeAuth = async () => {
    isLoading.value = true;
    try {
      const at = authService.getAccessToken();

      if (at && !authService.isTokenExpired(30)) {
        // Restore cached user if present
        const cachedUser = localStorage.getItem("user");
        if (cachedUser) {
          try {
            user.value = JSON.parse(cachedUser);
          } catch {
            user.value = null;
          }
        }
      } else {
        // Not authenticated; keep any cached user for UI (non-authoritative)
        const cachedUser = localStorage.getItem("user");
        if (cachedUser) {
          try {
            user.value = JSON.parse(cachedUser);
          } catch {
            user.value = null;
          }
        }
      }
    } catch (e) {
      console.error("Auth init error:", e);
      await logout();
    } finally {
      isLoading.value = false;
    }
  };

  // Login function
  const login = async (credentials) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await authService.login(credentials);
      if (res.status === 200) {
        const info = res?.data?.accountInfo || {};
        user.value = {
          email: credentials.email,
          accountNumber: info.accountNumber || null,
          accountName: info.accountName || null,
        };
        localStorage.setItem("user", JSON.stringify(user.value));
        router.replace("/dashboard");
        return { success: true };
      }
      error.value = "Login failed";
      return { success: false, error: error.value };
    } catch (err) {
      error.value =
        err.response?.data?.responseMessage || err.message || "Login failed";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Register function using new BK contract
  const register = async (payload) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await authService.register(payload);
      if (res.status === 200 || res.status === 201) {
        // Login after successful registration
        const loginRes = await authService.login({
          email: payload.email,
          password: payload.password,
        });
        const info = loginRes?.data?.accountInfo || {};
        user.value = {
          email: payload.email,
          accountNumber: info.accountNumber || null,
          accountName: info.accountName || null,
        };
        localStorage.setItem("user", JSON.stringify(user.value));
        router.replace("/dashboard");
        return { success: true };
      } else if (res.status === 409) {
        error.value = "Email already exists";
        return { success: false, error: error.value };
      }
      error.value = "Registration failed";
      return { success: false, error: error.value };
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
  const logout = async () => {
    isLoading.value = true;
    try {
      user.value = null;
      await authService.logout();
      localStorage.removeItem("user");
      router.push("/login");
    } catch {
      // ignore errors
    } finally {
      isLoading.value = false;
    }
  };

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    user: currentUser,
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
