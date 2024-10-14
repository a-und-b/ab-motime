<template>
  <div id="app">
    <h1>MoTime</h1>
    <TimeEntryList :entries="timeEntries" @transfer="handleTransfer" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import TimeEntryList from './components/TimeEntryList.vue'
import { getTimingData, addMocoEntry } from './api'

export default {
  name: 'App',
  components: {
    TimeEntryList
  },
  setup() {
    const timeEntries = ref([])

    const fetchTimeEntries = async () => {
      try {
        timeEntries.value = await getTimingData()
      } catch (error) {
        console.error('Error fetching time entries:', error)
        // TODO: Implement error handling (e.g., show an error message to the user)
      }
    }

    const handleTransfer = async (entry) => {
      try {
        const response = await addMocoEntry({
          date: entry.startDate.split('T')[0],
          projectId: entry.projectId, // You'll need to map this from your Moco projects
          taskId: entry.taskId, // You'll need to map this from your Moco tasks
          hours: parseFloat(entry.roundedDuration.split('h')[0]),
          description: entry.description
        })
        console.log('Entry transferred:', response)
        // TODO: Update the UI to reflect the transferred entry (e.g., disable the transfer button)
      } catch (error) {
        console.error('Error transferring entry:', error)
        // TODO: Implement error handling (e.g., show an error message to the user)
      }
    }

    onMounted(fetchTimeEntries)

    return {
      timeEntries,
      handleTransfer
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
