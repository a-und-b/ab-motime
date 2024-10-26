<template>
  <div id="app">
    <div class="period-selector">
      <button 
        v-for="period in periods" 
        :key="period.value"
        :class="{ active: selectedPeriod === period.value }"
        @click="changePeriod(period.value)"
      >
        {{ period.label }}
      </button>
    </div>
    <TimeEntryList 
      :entries="timeEntries" 
      :projects="mocoProjects"
      :tasks="mocoTasks"
      @transfer="handleTransfer"
      @projectSelected="handleProjectSelected"
      :projectsLoaded="projectsLoaded"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import TimeEntryList from './components/TimeEntryList.vue'
import { getTimingData, addMocoEntry, getMocoProjects, getMocoTasks } from './api'

export default {
  name: 'App',
  components: {
    TimeEntryList
  },
  setup() {
    const timeEntries = ref([])
    const mocoProjects = ref([])
    const mocoTasks = ref({})
    const selectedPeriod = ref('last7Days')
    const periods = [
      { label: 'Today', value: 'today' },
      { label: 'Last 7 Days', value: 'last7Days' },
      { label: 'Last 30 Days', value: 'last30Days' }
    ]

    const fetchTimeEntries = async () => {
      try {
        timeEntries.value = await getTimingData(selectedPeriod.value)
      } catch (error) {
        console.error('Error fetching time entries:', error)
      }
    }

    const changePeriod = async (period) => {
      selectedPeriod.value = period
      await fetchTimeEntries()
    }

    const handleProjectSelected = async (projectId) => {
      if (!mocoTasks.value[projectId]) {
        try {
          mocoTasks.value[projectId] = await getMocoTasks(projectId)
          console.log(`Fetched tasks for project ${projectId}:`, mocoTasks.value[projectId])
        } catch (error) {
          console.error('Error fetching Moco tasks:', error)
        }
      }
    }

    const handleTransfer = async (entry) => {
      try {
        const response = await addMocoEntry({
          date: entry.date,
          project_id: entry.project_id,
          task_id: entry.task_id,
          hours: entry.hours,
          description: entry.description
        });
        console.log('Entry transferred:', response);
        // TODO: Mark entry as transferred in the UI
      } catch (error) {
        console.error('Error transferring entry:', error);
        // TODO: Show error message to user
      }
    }

    onMounted(() => {
      fetchTimeEntries()
      fetchMocoProjects()
    })

    return {
      timeEntries,
      mocoProjects,
      mocoTasks,
      handleTransfer,
      handleProjectSelected,
      selectedPeriod,
      periods,
      changePeriod
    }
  }
}
</script>

<style>
.period-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.period-selector button {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
}

.period-selector button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}
</style>
