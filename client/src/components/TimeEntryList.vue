<template>
  <div>
    <div v-if="Object.keys(entries).length === 0" class="text-gray-500">
      No time entries available.
    </div>
    <div v-else>
      <div v-for="(dayEntries, date) in entries" :key="date" class="mb-6">
        <h2 class="text-lg font-semibold mb-3">{{ formatDate(date) }}</h2>
        <ul class="space-y-2">
          <li v-for="(entry, projectName) in dayEntries" :key="`${date}-${projectName}`" 
              class="bg-white shadow-md overflow-hidden sm:rounded-md">
            <div class="px-4 py-4 flex flex-col">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-medium text-indigo-600 truncate">
                  {{ projectName }}
                </p>
                <div class="ml-2 flex-shrink-0 flex">
                  <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {{ entry.duration_formatted }}
                  </p>
                </div>
              </div>
              
              <div class="text-sm text-gray-500">
                <template v-if="entry.type === 'task'">
                  <p>Task: {{ entry.task_title }}</p>
                  <p v-if="entry.task_notes">Notes: {{ entry.task_notes }}</p>
                </template>
                <template v-else>
                  <p>{{ entry.activity_count }} activities</p>
                  <p>Apps: {{ entry.applications.join(', ') }}</p>
                </template>
              </div>

              <!-- Project and Task selection remains the same -->
              <div class="mt-2 flex items-center text-sm text-gray-500">
                <select v-model="entry.projectId" @change="handleProjectChange(entry)" class="mr-2">
                  <option value="">Select Project</option>
                  <option v-for="project in projects" :key="project.id" :value="project.id">
                    {{ project.name }}
                  </option>
                </select>
                
                <select v-model="entry.taskId" class="mr-2">
                  <option value="">Select Task</option>
                  <option v-for="task in tasksForProject(entry.projectId)" :key="task.id" :value="task.id">
                    {{ task.name }}
                  </option>
                </select>

                <button
                  @click="handleTransfer(date, projectName, entry)"
                  :disabled="!entry.projectId || !entry.taskId"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Transfer
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { findMatchingProject, findMatchingTask } from '../utils/projectMatcher';
import { format } from 'date-fns';

export default {
  name: 'TimeEntryList',
  props: {
    entries: {
      type: Object,
      required: true
    },
    projects: {
      type: Array,
      required: true
    },
    tasks: {
      type: Object,
      required: true
    }
  },
  emits: ['transfer', 'projectSelected'],
  methods: {
    formatDate(date) {
      return format(new Date(date), 'EEEE, MMMM d, yyyy');
    },
    handleProjectChange(entry) {
      entry.taskId = null; // Reset task when project changes
      this.$emit('projectSelected', entry.projectId);
    },
    tasksForProject(projectId) {
      return this.tasks[projectId] || [];
    },
    handleTransfer(date, projectName, entry) {
      if (!entry.projectId || !entry.taskId) return;

      const transferData = {
        date,
        project_id: entry.projectId,
        task_id: entry.taskId,
        hours: entry.duration_hours,
        description: entry.type === 'task' ? entry.task_title : `Worked with: ${entry.applications.join(', ')}`
      };

      this.$emit('transfer', transferData);
    },
    performMatching() {
      if (!this.entries || !this.projects.length) return;

      Object.entries(this.entries).forEach(([date, dayEntries]) => {
        Object.entries(dayEntries).forEach(([projectName, entry]) => {
          if (!entry.projectId) {
            const matchingProject = findMatchingProject(projectName, this.projects);
            if (matchingProject) {
              entry.projectId = matchingProject.id;
              this.$emit('projectSelected', matchingProject.id);
            }
          }
        });
      });
    }
  },
  watch: {
    entries: {
      immediate: true,
      handler() {
        this.performMatching();
      }
    },
    projects: {
      handler() {
        if (Object.keys(this.entries).length) {
          this.performMatching();
        }
      }
    }
  }
}
</script>

<style scoped>
.time-entry-list {
  margin-top: 20px;
}
</style>
