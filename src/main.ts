import '../public/assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import mitt from 'mitt'
import CreateMission from '@/views/CreateMission.vue'
import MissionDetail from '@/views/global/MissionDetail.vue'

const emitter = mitt();
const app = createApp(App)

app.use(createPinia())
app.use(router)
library.add(far)
library.add(fas)

app.component("CreateMission", CreateMission);
app.component("MissionDetail", MissionDetail);

app.provide("emitter", emitter)
app.mount('#app')
