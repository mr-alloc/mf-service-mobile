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
import CreateAnniversary from '@/views/CreateAnniversary.vue'
import CreateFamily from '@/components/global/CreateFamily.vue'
import InviteFamily from '@/components/InviteFamily.vue'
import MissionComments from '@/components/global/MissionComments.vue'
import CreateCategory from '@/views/CreateCategory.vue'

const emitter = mitt();
const app = createApp(App)

app.use(createPinia())
app.use(router)
library.add(far)
library.add(fas)

app.component('CreateFamily', CreateFamily)
app.component("CreateMission", CreateMission);
app.component('CreateCategory', CreateCategory)
app.component('MissionComments', MissionComments)
app.component('InviteFamily', InviteFamily)
app.component('CreateAnniversary', CreateAnniversary)
app.component("MissionDetail", MissionDetail);

app.provide("emitter", emitter)
app.mount('#app')
