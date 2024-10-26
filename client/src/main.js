import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './index.css'

// Font Awesome imports
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons'

// Create the library instance and add icons
library.add(faClock, faArrowRight)

// Create app instance
const app = createApp(App)

// Register FontAwesome component globally
app.component('font-awesome-icon', FontAwesomeIcon)

// Use plugins and mount
app.use(store)
   .use(router)
   .mount('#app')
