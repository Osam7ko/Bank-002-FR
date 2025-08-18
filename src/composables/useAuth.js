import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { profileAPI, accountAPI } from "@/services/api";
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

  // Bootstrap profile after login
  const bootstrapProfile = async () => {
    const me = await profileAPI.me();
    user.value = me.data || null;
    try {
      // pick ONE of the two calls below depending on which endpoint you added
      const { data: accounts } = await accountAPI.listByOwner(user.value.id);
      if (accounts?.length) {
        user.value.accountNumber = accounts[0].accountNumber;
        user.value.accountName = accounts[0].displayName; // optional
      }
      // OR:
      // const { data: acc } = await accountAPI.getDefaultByOwner(user.value.id);
      // user.value.accountNumber = acc.accountNumber;
      // user.value.accountName   = acc.displayName;
    } catch (e) {
      console.warn("No account yet for profile", e);
    }

    localStorage.setItem("user", JSON.stringify(user.value));
  };

  // Initialize auth on app start
  const initializeAuth = async () => {
    isLoading.value = true;
    try {
      const at = authService.getAccessToken();
      const rt = authService.getRefreshToken();

      if (at) {
        if (authService.isTokenExpiringSoon(30) && rt) {
          try {
            await authService.refreshWithLock();
            console.log(
              "AFTER REFRESH access=",
              getAccessToken()?.slice(0, 20)
            );
          } catch {
            // refresh failed, force logout
            await logout();
            return;
          }
        }
        await bootstrapProfile();
      } else {
        // Try restore cached user for UI purposes (non-authoritative)
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
        await bootstrapProfile();
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

  // Register function: register -> login -> bootstrap -> update profile with form -> load me -> navigate
  const register = async (payload) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await authService.register(payload);
      if (res.status === 201) {
        // Login after successful registration
        await authService.login({
          email: payload.email,
          password: payload.password,
        });

        // Ensure profile exists then fill it with registration form data
        try {
          await profileAPI.bootstrap();
        } catch (_) {
          // ignore; bootstrap is idempotent
        }

        await profileAPI.updateMe({
          firstName: payload.firstName,
          lastName: payload.lastName,
          otherName: payload.otherName || null,
          email: payload.email || null,
          gender: payload.gender || null,
          address: payload.address,
          stateOfOrigin: payload.stateOfOrigin,
          phoneNumber: payload.phoneNumber,
          alternativePhoneNumber: payload.alternativePhoneNumber || null,
        });

        const me = await profileAPI.me();
        user.value = me.data || null;
        localStorage.setItem("user", JSON.stringify(user.value));

        // Enrich with default account to avoid N/A on dashboard
        try {
          const acc = await accountAPI.getDefaultByOwner(String(user.value.id));
          const accData = acc?.data || {};
          user.value.accountNumber =
            accData.accountNumber ??
            accData?.accountInfo?.accountNumber ??
            user.value.accountNumber;
          user.value.accountName =
            accData.displayName ??
            accData.accountName ??
            accData?.accountInfo?.accountName ??
            user.value.accountName;
          localStorage.setItem("user", JSON.stringify(user.value));
        } catch (e2) {
          console.warn("No default account yet for profile", e2);
        }

        // Navigate after successful bootstrap/fill
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
