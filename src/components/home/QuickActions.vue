<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <router-link
      v-for="action in quickActions"
      :key="action.name"
      :to="action.path"
      class="card hover:shadow-lg transition-shadow group"
    >
      <div class="flex items-center space-x-4">
        <div class="p-3 rounded-lg" :class="action.iconBgClass">
          <svg
            class="h-6 w-6"
            :class="action.iconColorClass"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="action.icon"
            />
          </svg>
        </div>
        <div>
          <h3
            class="text-lg font-medium text-gray-900 group-hover:text-primary-600"
          >
            {{ action.name }}
          </h3>
          <p class="text-sm text-gray-500">{{ action.description }}</p>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup>
const quickActions = [
  {
    name: "Transfer",
    description: "Send money to accounts",
    path: "/transfer",
    icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
    iconBgClass: "bg-blue-100",
    iconColorClass: "text-blue-600",
  },
  {
    name: "Credit",
    description: "Add funds to account",
    path: "/credit",
    icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
    iconBgClass: "bg-green-100",
    iconColorClass: "text-green-600",
  },
  {
    name: "Debit",
    description: "Withdraw from account",
    path: "/debit",
    icon: "M20 12H4",
    iconBgClass: "bg-red-100",
    iconColorClass: "text-red-600",
  },
  {
    name: "Beneficiaries",
    description: "Manage saved recipients",
    path: "/beneficiaries",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    iconBgClass: "bg-purple-100",
    iconColorClass: "text-purple-600",
  },
];
</script>
