import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "@/composables/useAuth";

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

// Navigation guards
router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth();

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next("/login");
    return;
  }

  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && isAuthenticated.value) {
    next("/dashboard");
    return;
  }

  next();
});

export default router;
