<template>
  <Layout>
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Profile Information</h1>
        <p class="mt-2 text-gray-600">Manage your account details</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Card -->
        <div class="lg:col-span-1">
          <div class="card text-center">
            <div class="mb-6">
              <div
                class="mx-auto h-24 w-24 rounded-full bg-primary-600 flex items-center justify-center"
              >
                <span class="text-2xl font-bold text-white">{{
                  userInitials
                }}</span>
              </div>
              <h3 class="mt-4 text-xl font-semibold text-gray-900">
                {{ fullName }}
              </h3>
              <p class="text-gray-600">{{ user?.email }}</p>
            </div>

            <div class="space-y-3">
              <div
                class="flex justify-between items-center py-2 border-b border-gray-200"
              >
                <span class="text-sm text-gray-600">Account Number</span>
                <span class="font-medium">{{
                  user?.accountNumber || "N/A"
                }}</span>
              </div>
              <div
                class="flex justify-between items-center py-2 border-b border-gray-200"
              >
                <span class="text-sm text-gray-600">Status</span>
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
                >
                  {{ user?.status || "Active" }}
                </span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-sm text-gray-600">Member Since</span>
                <span class="font-medium">{{
                  formatDate(user?.createdAt)
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Details -->
        <div class="lg:col-span-2">
          <div class="card">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">
                Personal Information
              </h2>
              <button
                v-if="!isEditing"
                @click="startEditing"
                class="btn-primary"
              >
                Edit Profile
              </button>
            </div>

            <form
              v-if="isEditing"
              @submit.prevent="handleUpdateProfile"
              class="space-y-6"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="firstName" class="form-label">First Name</label>
                  <input
                    id="firstName"
                    v-model="editForm.firstName"
                    type="text"
                    required
                    class="input-field"
                  />
                </div>
                <div>
                  <label for="lastName" class="form-label">Last Name</label>
                  <input
                    id="lastName"
                    v-model="editForm.lastName"
                    type="text"
                    required
                    class="input-field"
                  />
                </div>
              </div>

              <div>
                <label for="email" class="form-label">Email Address</label>
                <input
                  id="email"
                  v-model="editForm.email"
                  type="email"
                  required
                  class="input-field"
                />
              </div>

              <div>
                <label for="phoneNumber" class="form-label">Phone Number</label>
                <input
                  id="phoneNumber"
                  v-model="editForm.phoneNumber"
                  type="tel"
                  required
                  class="input-field"
                />
              </div>

              <div>
                <label for="address" class="form-label">Address</label>
                <textarea
                  id="address"
                  v-model="editForm.address"
                  rows="3"
                  required
                  class="input-field"
                ></textarea>
              </div>

              <div>
                <label for="alternativePhoneNumber" class="form-label"
                  >Alternative Phone Number</label
                >
                <input
                  id="alternativePhoneNumber"
                  v-model="editForm.alternativePhoneNumber"
                  type="tel"
                  class="input-field"
                />
              </div>

              <div v-if="updateError" class="rounded-md bg-red-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">
                      {{ updateError }}
                    </h3>
                  </div>
                </div>
              </div>

              <div class="flex space-x-4">
                <button
                  type="submit"
                  :disabled="isUpdating"
                  class="btn-primary flex-1"
                >
                  <span
                    v-if="isUpdating"
                    class="flex items-center justify-center"
                  >
                    <div
                      class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                    ></div>
                    Updating...
                  </span>
                  <span v-else>Save Changes</span>
                </button>
                <button
                  type="button"
                  @click="cancelEditing"
                  class="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>

            <!-- Read-only view -->
            <div v-else class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="form-label">First Name</label>
                  <p class="text-gray-900 font-medium">
                    {{ user?.firstName || "N/A" }}
                  </p>
                </div>
                <div>
                  <label class="form-label">Last Name</label>
                  <p class="text-gray-900 font-medium">
                    {{ user?.lastName || "N/A" }}
                  </p>
                </div>
              </div>

              <div>
                <label class="form-label">Email Address</label>
                <p class="text-gray-900 font-medium">
                  {{ user?.email || "N/A" }}
                </p>
              </div>

              <div>
                <label class="form-label">Phone Number</label>
                <p class="text-gray-900 font-medium">
                  {{ user?.phoneNumber || "N/A" }}
                </p>
              </div>

              <div>
                <label class="form-label">Address</label>
                <p class="text-gray-900 font-medium">
                  {{ user?.address || "N/A" }}
                </p>
              </div>

              <div>
                <label class="form-label">Alternative Phone Number</label>
                <p class="text-gray-900 font-medium">
                  {{ user?.alternativePhoneNumber || "Not provided" }}
                </p>
              </div>

              <div>
                <label class="form-label">Gender</label>
                <p class="text-gray-900 font-medium">
                  {{ user?.gender || "Not specified" }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Actions -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Account Actions
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <router-link
            to="/balance-enquiry"
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex-shrink-0">
              <svg
                class="h-8 w-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div class="ml-4">
              <h4 class="font-medium text-gray-900">Check Balance</h4>
              <p class="text-sm text-gray-600">
                View your current account balance
              </p>
            </div>
          </router-link>

          <router-link
            to="/statement"
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex-shrink-0">
              <svg
                class="h-8 w-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div class="ml-4">
              <h4 class="font-medium text-gray-900">Download Statement</h4>
              <p class="text-sm text-gray-600">
                Get your account statement via email
              </p>
            </div>
          </router-link>

          <router-link
            to="/transfer"
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex-shrink-0">
              <svg
                class="h-8 w-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
            <div class="ml-4">
              <h4 class="font-medium text-gray-900">Transfer Money</h4>
              <p class="text-sm text-gray-600">Send money to other accounts</p>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Success Message -->
      <div
        v-if="updateSuccess"
        class="card bg-green-50 border border-green-200"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">
              Profile updated successfully!
            </p>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import Layout from "@/components/layout/Layout.vue";
import { useAuth } from "@/composables/useAuth";

const { user } = useAuth();

const isEditing = ref(false);
const isUpdating = ref(false);
const updateError = ref(null);
const updateSuccess = ref(false);

const editForm = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address: "",
  alternativePhoneNumber: "",
});

const fullName = computed(() => {
  if (user.value?.firstName && user.value?.lastName) {
    return `${user.value.firstName} ${user.value.lastName}`;
  }
  return user.value?.name || "User";
});

const userInitials = computed(() => {
  const name = fullName.value;
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
});

const startEditing = () => {
  // Populate form with current user data
  editForm.firstName = user.value?.firstName || "";
  editForm.lastName = user.value?.lastName || "";
  editForm.email = user.value?.email || "";
  editForm.phoneNumber = user.value?.phoneNumber || "";
  editForm.address = user.value?.address || "";
  editForm.alternativePhoneNumber = user.value?.alternativePhoneNumber || "";

  isEditing.value = true;
  updateError.value = null;
  updateSuccess.value = false;
};

const cancelEditing = () => {
  isEditing.value = false;
  updateError.value = null;
};

const handleUpdateProfile = async () => {
  try {
    isUpdating.value = true;
    updateError.value = null;

    // Here you would call your API to update the profile
    // const result = await updateProfile(editForm)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update local user data (in a real app, this would come from the API response)
    Object.assign(user.value, editForm);

    isEditing.value = false;
    updateSuccess.value = true;

    // Hide success message after 3 seconds
    setTimeout(() => {
      updateSuccess.value = false;
    }, 3000);
  } catch (error) {
    updateError.value = error.message || "Failed to update profile";
  } finally {
    isUpdating.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(() => {
  // Any initialization logic
});
</script>
