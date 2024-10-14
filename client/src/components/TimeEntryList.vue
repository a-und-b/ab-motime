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
                {{ entry.duration }} ({{ entry.roundedDuration }})
              </p>
            </div>
          </div>
          <div class="mt-2 sm:flex sm:justify-between">
            <div class="sm:flex">
              <p class="flex items-center text-sm text-gray-500">
                {{ entry.task }}
              </p>
            </div>
            <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
              <select v-model="entry.projectId" @change="handleProjectChange(entry)" class="mr-2">
                <option value="">Select Project</option>
                <option v-for="project in projects" :key="project.id" :value="project.id">
                  {{ project.name }}
                </option>
              </select>
              <select v-model="entry.taskId" class="mr-2">
                <option value="">Select Task</option>
                <option v-for="task in tasks" :key="task.id" :value="task.id">
                  {{ task.name }}
                </option>
              </select>
              <button
                @click="$emit('transfer', entry)"
                :disabled="!entry.projectId || !entry.taskId"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
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
  name: 'TimeEntryList',
  props: {
    entries: {
      type: Array,
      required: true
    },
    projects: {
      type: Array,
      required: true
    },
    tasks: {
      type: Array,
      required: true
    }
  },
  emits: ['transfer', 'projectSelected'],
  methods: {
    handleProjectChange(entry) {
      this.$emit('projectSelected', entry.projectId)
    }
  }
}
</script>

<style scoped>
.time-entry-list {
  margin-top: 20px;
}
</style>
