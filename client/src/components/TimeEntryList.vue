<template>
  <div class="flex flex-col gap-4 bg-white pl-4 pr-2 py-2 mb-6 rounded-full shadow-lg">
    <div class="flex gap-2">
      <div class="flex items-center gap-2 w-full">
        <span class="font-bold text-lg text-gray-800">MoTime</span>
      </div>
      <button 
        v-for="period in ['Today', 'Yesterday', 'Last Week', 'Last 30 Days']" 
        :key="period"
        @click="selectedPeriod = period.toLowerCase()"
        :class="[
          'px-4 py-1 rounded-full text-nowrap',
          selectedPeriod === period.toLowerCase() 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
      >
        {{ period }}
      </button>
    </div>
  </div>
  <div>
    <div v-if="Object.keys(filteredEntries).length === 0" class="text-gray-500">
      No time entries available.
    </div>
    <div v-else>
      <div v-for="(dayEntries, date) in filteredEntries" :key="date" class="mb-6">
        <h2 class="text-black text-lg font-bold mb-2">{{ formatDate(date) }}</h2>
        <ul class="space-y-5">
          <li v-for="(entry, projectName) in dayEntries" :key="`${date}-${projectName}`" 
              class="p-2 bg-white rounded-xl shadow-md flex-col justify-start items-start gap-3 flex w-full">
            <div class="px-1 py-1 flex flex-col w-full">
              <div class="flex items-center justify-between mb-1 w-full">
                <p class="text-sm font-medium text-blue-600 truncate">
                  {{ projectName }}
                </p>
                <div class="ml-2 flex-shrink-0 flex">
                  <p class="px-2 inline-flex align-middle leading-none py-1 pl-2 pr-2 items-center text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    <font-awesome-icon icon="clock" class="mr-1" />{{ entry.duration_formatted }} <span class="font-normal">&nbsp;({{ String(Math.floor(entry.duration_minutes / 60)).padStart(2, '0') }}:{{ String(entry.duration_minutes % 60).padStart(2, '0') }})</span>
                  </p>
                </div>
              </div>
              
              <div class="text-sm text-gray-500 w-full">
                <template v-if="entry.type === 'task'">
                  <p>Task: {{ entry.task_title }}</p>
                  <p v-if="entry.task_notes">Notes: {{ entry.task_notes }}</p>
                </template>
                <template v-else>
                  <p class="text-xs"> {{ entry.activity_count }} activities, Apps: {{ entry.applications.join(', ') }}</p>
                </template>
              </div>

              <div class="mt-2 mb-2 flex items-center text-sm w-full">
                <select v-model="entry.projectId" @change="handleProjectChange(entry)" class="mr-2 w-full px-2 bg-gray-50 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Project</option>
                  <option v-for="project in projects" :key="project.id" :value="project.id">
                    {{ project.name }}
                  </option>
                </select>
                
                <select v-model="entry.taskId" class="w-1/2 px-2 bg-gray-50 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Task</option>
                  <option v-for="task in tasksForProject(entry.projectId)" :key="task.id" :value="task.id">
                    {{ task.name }}
                  </option>
                </select>
              </div>
              <div class="w-full flex items-stretch justify-stretch">
                <input type="text" v-model="entry.description" class="w-full mr-2 px-2 bg-gray-50 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Description" />
                <button
                  @click="handleTransfer(date, projectName, entry)"
                  :disabled="!entry.projectId || !entry.taskId"
                  class="flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
import { format, subDays, startOfDay, parseISO } from 'date-fns';

export default {
  name: 'TimeEntryList',
  data() {
    return {
      selectedPeriod: 'today'
    }
  },
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
  computed: {
    filteredEntries() {
      const now = new Date();
      const today = startOfDay(now);
      
      return Object.entries(this.entries).reduce((filtered, [date, entries]) => {
        const entryDate = parseISO(date);
        
        switch (this.selectedPeriod) {
          case 'today':
            if (format(entryDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
              filtered[date] = entries;
            }
            break;
          case 'yesterday':
            if (format(entryDate, 'yyyy-MM-dd') === format(subDays(today, 1), 'yyyy-MM-dd')) {
              filtered[date] = entries;
            }
            break;
          case 'last week':
            if (entryDate >= subDays(today, 7)) {
              filtered[date] = entries;
            }
            break;
          case 'last 30 days':
            if (entryDate >= subDays(today, 30)) {
              filtered[date] = entries;
            }
            break;
        }
        return filtered;
      }, {});
    }
  },
  emits: ['transfer', 'projectSelected'],
  methods: {
    formatDate(date) {
      return format(new Date(date), 'EEEE, d. MMMM yyyy');
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

/* Updated tooltip styling */
[title] {
  position: relative;
  cursor: pointer;
}

[title]::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  right: 0;
  background: rgba(27, 159, 148, 0.8);
  color: white;
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  white-space: pre-wrap;
  z-index: 10;
  min-width: 200px;
  max-width: 300px;
  display: none;
}

[title]:hover::after {
  display: block;
}
</style>
