<template>
  <div id="app">
    <h1>MoTime</h1>
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
        const [hours, minutes] = entry.roundedDuration.split('h ');
        const durationInHours = parseFloat(hours) + (parseInt(minutes) / 60);

        const response = await addMocoEntry({
          date: entry.startDate.split('T')[0],
          project_id: entry.projectId,
          task_id: entry.taskId,
          hours: durationInHours,
          description: entry.description
        });
        console.log('Entry transferred:', response);
        // TODO: Update the UI to reflect the transferred entry
      } catch (error) {
        console.error('Error transferring entry:', error);
        // TODO: Show an error message to the user
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
