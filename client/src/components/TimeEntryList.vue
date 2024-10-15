<template>
  <div>
    <div v-if="entries.length === 0" class="text-gray-500">No time entries available.</div>
    <ul v-else class="space-y-2">
      <li v-for="entry in entries" :key="entry.id" class="bg-white shadow-md overflow-hidden sm:rounded-md">
        <div class="px-4 py-4 flex flex-col align-text-bottom">
          <div class="flex items-center justify-between mb-1">
            <p class="text-sm font-medium text-indigo-600 truncate">
              {{ entry.projectName }}
            </p>
            <div class="ml-2 flex-shrink-0 flex">
              <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {{ entry.duration }} ({{ entry.roundedDuration }})
              </p>
            </div>
          </div>
          <div class="mt-1 sm:flex sm:justify-between">
            <div class="flex items-center">
              <p class="text-left text-sm text-gray-500">
                {{ entry.task }}
              </p>
            </div>
            <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
              <select v-model="entry.projectId" @change="handleProjectChange(entry)" class="mr-2 border border-gray-300 rounded-md p-2">
                <option value="">Select Project</option>
                <option v-for="project in projects" :key="project.id" :value="project.id">
                  {{ project.name }}
                </option>
              </select>
              <select v-model="entry.taskId" class="mr-2 border border-gray-300 rounded-md p-2">
                <option value="">Select Task</option>
                <option v-for="task in tasksForProject(entry.projectId)" :key="task.id" :value="task.id">
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
import { findMatchingProject, findMatchingTask } from '../utils/projectMatcher';

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
      type: Object,
      required: true
    }
  },
  emits: ['transfer', 'projectSelected'],
  data() {
    return {
      matchingComplete: false,
    }
  },
  methods: {
    handleProjectChange(entry) {
      this.$emit('projectSelected', entry.projectId);
      entry.taskId = ''; // Reset task when project changes
    },
    tasksForProject(projectId) {
      return this.tasks[projectId] || [];
    },
    findMatchingProject(entryProjectName) {
      return findMatchingProject(entryProjectName, this.projects);
    },
    findMatchingTask(projectId, entryProjectName) {
      const projectTasks = this.tasksForProject(projectId);
      return findMatchingTask(entryProjectName, projectTasks);
    },
    performMatching() {
      if (!this.entries.length || !this.projects.length) {
        console.log("Not enough data to perform matching");
        return;
      }

      this.entries.forEach(entry => {
        console.log(`Trying to match project for entry: ${entry.projectName}`);
        if (!entry.projectId) {
          const matchingProject = this.findMatchingProject(entry.projectName);
          if (matchingProject) {
            console.log(`Matched project: ${matchingProject.name}`);
            entry.projectId = matchingProject.id;
            this.$emit('projectSelected', matchingProject.id);
          } else {
            console.log(`No matching project found for: ${entry.projectName}`);
          }
        }
        if (entry.projectId && !entry.taskId) {
          const matchingTask = this.findMatchingTask(entry.projectId, entry.projectName);
          if (matchingTask) {
            console.log(`Matched task: ${matchingTask.name}`);
            entry.taskId = matchingTask.id;
          } else {
            console.log(`No matching task found for: ${entry.projectName}`);
          }
        }
      });

      this.matchingComplete = true;
      this.saveMatchesToLocalStorage();
    },
    saveMatchesToLocalStorage() {
      const matchedEntries = this.entries.map(entry => ({
        id: entry.id,
        projectId: entry.projectId,
        taskId: entry.taskId
      }));
      localStorage.setItem('matchedEntries', JSON.stringify(matchedEntries));
    },
    loadMatchesFromLocalStorage() {
      const savedMatches = localStorage.getItem('matchedEntries');
      if (savedMatches) {
        const parsedMatches = JSON.parse(savedMatches);
        this.entries.forEach(entry => {
          const savedMatch = parsedMatches.find(match => match.id === entry.id);
          if (savedMatch) {
            entry.projectId = savedMatch.projectId;
            entry.taskId = savedMatch.taskId;
          }
        });
      }
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
        if (this.entries.length) {
          this.performMatching();
        }
      }
    }
  },
  mounted() {
    this.loadMatchesFromLocalStorage();
  }
}
</script>

<style scoped>
.time-entry-list {
  margin-top: 20px;
}
</style>
