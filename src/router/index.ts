import { createRouter, createWebHistory } from 'vue-router'
import MainCalendar from "@/views/MainCalendar.vue";
import { useNavigateMenuStore } from '@/stores/NavigateMenuStore'
import MainIndex from '@/views/MainIndex.vue'
import Families from '@/views/authorize/Families.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', name: 'home', component: MainIndex, meta: {role: 0}},
    {path: '/calendar', name: 'calendar', component: MainCalendar, meta: {role: 1}},
    {path: '/families', name: 'families', component: Families, meta: {role: 1}},
  ]
})

router.afterEach((to, from) => {
  const navigateMenuStore = useNavigateMenuStore()
  navigateMenuStore.refreshAllActivated();
  switch (to.path) {
    case '/':
      navigateMenuStore.state.activeHomeMenu = true;
      break;
    case '/calendar':
      navigateMenuStore.state.activeCalendarMenu = true;
      break;
    case '/families':
      navigateMenuStore.state.activeFamiliesMenu = true;
      break;
  }
});

export default router
