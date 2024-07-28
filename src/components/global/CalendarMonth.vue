<template>
  <div class="calendar-month-container">
    <CalendarWeek :days="days" :key="week"
                  v-for="([week, days]) in state.calendarWeeks.entries()"
                  :week="week"
    />
  </div>
</template>
<script setup lang="ts">
import CalendarWeek from '@/components/main/CalendarWeek.vue'
import type { Moment } from 'moment-timezone'
import { onMounted, reactive } from 'vue'
import DateUtil from '@/utils/DateUtil'
import CalendarDate from '@/classes/CalendarDate'

const props = defineProps<{
  month: Moment
}>();
const state = reactive({
  calendarWeeks: new Map<number, Array<CalendarDate>>(),
  startOfCalendar: 0,
  startOfMonth: 0,
  endOfMonth: 0,
  endOfCalendar: 0,
  thisMonthKey: '',
});
onMounted(() => {
  state.calendarWeeks = DateUtil.getCalendarWeeks(props.month, (soc, som, eom, eoc) => {
    state.startOfCalendar = soc.unix();
    state.startOfMonth = som.unix();
    state.endOfMonth = eom.unix();
    state.endOfCalendar = eoc.unix();
  });

  state.thisMonthKey = props.month.format(DateUtil.YYYYMM);
})
</script>


<style scoped lang="scss">
@import "@assets/main";
.calendar-month-container {
  margin: 0;
  overflow: hidden;
  display: flex;
  height: 100%;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
}
</style>
