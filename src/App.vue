<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";

const { initializeAuth } = useAuth();

onMounted(() => {
  initializeAuth();
});
</script>

<style>
#app {
  font-family: "Inter", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
