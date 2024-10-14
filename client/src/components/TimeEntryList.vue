<template>
  <div>
    <h2 class="text-xl font-semibold mb-2">Time Entries</h2>
    <div v-if="entries.length === 0" class="text-gray-500">No time entries available.</div>
    <ul v-else class="space-y-2">
      <li v-for="entry in entries" :key="entry.id" class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-4 sm:px-6">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-indigo-600 truncate">
              {{ entry.projectName }}
            </p>
            <div class="ml-2 flex-shrink-0 flex">
              <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {{ entry.duration }}
              </p>
            </div>
          </div>
          <div class="mt-2 sm:flex sm:justify-between">
            <div class="sm:flex">
              <p class="flex items-center text-sm text-gray-500">
                {{ entry.task }}
              </p>
              <p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                {{ entry.description }}
              </p>
            </div>
            <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
              <button
                @click="$emit('transfer', entry)"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    entries: {
      type: Array,
      required: true
    }
  },
  emits: ['transfer']
}
</script>

<style scoped>
.time-entry-list {
  margin-top: 20px;
}
</style>
