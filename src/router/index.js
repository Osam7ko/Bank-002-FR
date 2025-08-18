import { createRouter, createWebHistory } from "vue-router";
import authService from "@/services/auth/authService";

// Import pages
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import Dashboard from "@/pages/Dashboard.vue";
import Beneficiaries from "@/pages/Beneficiaries.vue";
import Transfer from "@/pages/Transfer.vue";
import Credit from "@/pages/Credit.vue";
import Debit from "@/pages/Debit.vue";
import Statement from "@/pages/Statement.vue";
import UserInfo from "@/pages/UserInfo.vue";
import Cards from "@/pages/Cards.vue";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requiresGuest: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/beneficiaries",
    name: "Beneficiaries",
    component: Beneficiaries,
    meta: { requiresAuth: true },
  },
  {
    path: "/transfer",
    name: "Transfer",
    component: Transfer,
    meta: { requiresAuth: true },
  },
  {
    path: "/credit",
    name: "Credit",
    component: Credit,
    meta: { requiresAuth: true },
  },
  {
    path: "/debit",
    name: "Debit",
    component: Debit,
    meta: { requiresAuth: true },
  },
  {
    path: "/statement",
    name: "Statement",
    component: Statement,
    meta: { requiresAuth: true },
  },
  {
    path: "/cards",
    name: "Cards",
    component: Cards,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "UserInfo",
    component: UserInfo,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/dashboard",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * Navigation guards
 * - Require valid JWT for protected routes; try refresh once if expiring/expired.
 * - Redirect authenticated users away from guest-only routes.
 */
router.beforeEach(async (to, from, next) => {
  const requiresAuth = !!to.meta.requiresAuth;
  const requiresGuest = !!to.meta.requiresGuest;

  const access = authService.getAccessToken();
  const refresh = authService.getRefreshToken();
  const tokenValid = !!access && !authService.isTokenExpired(5); // small buffer

  if (requiresAuth) {
    if (tokenValid) {
      next();
      return;
    }
    if (refresh) {
      try {
        await authService.refreshWithLock();
        next();
        return;
      } catch {
        // fall through to login
      }
    }
    next("/login");
    return;
  }

  if (requiresGuest) {
    if (tokenValid) {
      next("/dashboard");
      return;
    }
    if (refresh) {
      try {
        await authService.refreshWithLock();
        next("/dashboard");
        return;
      } catch {
        // allow guest route
      }
    }
  }

  next();
});

export default router;
