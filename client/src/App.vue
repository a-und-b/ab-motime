<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">MoTime</h1>
    <UserSelect @user-changed="handleUserChange" />
    <TimeEntryList :entries="timeEntries" @transfer="handleTransfer" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import UserSelect from './components/UserSelect.vue'
import TimeEntryList from './components/TimeEntryList.vue'
import { getTimingData, addMocoEntry } from './api'

export default {
  components: {
    UserSelect,
    TimeEntryList
  },
  setup() {
    const timeEntries = ref([])
    const currentUser = ref(null)

    const fetchTimeEntries = async () => {
      try {
        const data = await getTimingData()
        timeEntries.value = data
      } catch (error) {
        console.error('Error fetching time entries:', error)
        // TODO: Implement error handling (e.g., show an error message to the user)
      }
    }

    const handleUserChange = (user) => {
      currentUser.value = user
      fetchTimeEntries()
    }

    const handleTransfer = async (entry) => {
      try {
        const response = await addMocoEntry({
          date: entry.date,
          projectId: entry.projectId, // You'll need to map this from your Moco projects
          taskId: entry.taskId, // You'll need to map this from your Moco tasks
          hours: entry.duration,
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
      handleUserChange,
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
