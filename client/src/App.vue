<template>
  <div id="app">
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

    const fetchTimeEntries = async () => {
      try {
        timeEntries.value = await getTimingData()
      } catch (error) {
        console.error('Error fetching time entries:', error)
      }
    }

    const fetchMocoProjects = async () => {
      try {
        mocoProjects.value = await getMocoProjects()
        console.log('Fetched Moco projects:', mocoProjects.value)
      } catch (error) {
        console.error('Error fetching Moco projects:', error)
      }
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
      handleProjectSelected
    }
  }
}
</script>
