<template>
  <div class="mb-4">
    <label for="user-select" class="block text-sm font-medium text-gray-700">Select User</label>
    <select
      id="user-select"
      v-model="selectedUser"
      @change="$emit('user-changed', selectedUser)"
      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
    >
      <option value="">Select a user</option>
      <option v-for="user in users" :key="user.id" :value="user">
        {{ user.name }}
      </option>
    </select>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'UserSelect',
  emits: ['user-changed'],
  setup() {
    const selectedUser = ref(null)
    const users = ref([
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
      // Add more users as needed
    ])

    return {
      selectedUser,
      users
    }
  }
}
</script>

<style scoped>
.user-select {
  margin-bottom: 20px;
}
</style>
