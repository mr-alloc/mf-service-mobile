<template>
  <div class="calendar-month-container">
    <CalendarWeek :days="days" :key="week"
                  v-for="([week, days]) in state.calendarWeeks.entries()"
                  :week="week"
                  :geometries="state.schedulesMap.get(week) ?? []"
                  :anniversaries="state.anniversariesMap"
    />
  </div>
</template>
<script setup lang="ts">
import CalendarWeek from '@/components/main/CalendarWeek.vue'
import type { Moment } from 'moment-timezone'
import { inject, onMounted, reactive } from 'vue'
import DateUtil from '@/utils/DateUtil'
import CalendarDate from '@/classes/CalendarDate'
import { call } from '@/utils/NetworkUtil'
import { CalendarHoliday, RequestBody, ResponseBody } from '@/classes/api-spec/mission/GetMemberCalendar'
import Mission from '@/constant/api-meta/Mission'
import { useCalendarStore } from '@/stores/CalendarStore'
import { WeekScheduleGeometry } from '@/classes/WeekScheduleGeometry'
import CollectionUtil from '@/utils/CollectionUtil'
import * as GetAnniversaries from '@/classes/api-spec/GetAnniversaries'
import Anniversary from '@/constant/api-meta/Anniversary'
import CalendarAnniversary from '@/classes/CalendarAnniversary'

const emitter: any = inject('emitter');
const calendarStore = useCalendarStore()
const props = defineProps<{
  month: Moment
}>();
const state = reactive({
  calendarWeeks: new Map<number, Array<CalendarDate>>(),
  startOfCalendar: 0,
  startOfMonth: 0,
  endOfMonth: 0,
  endOfCalendar: 0,
  schedulesMap: new Map<number, Array<WeekScheduleGeometry>>(),
  holidaysMap: new Map<string, CalendarHoliday>(),
  anniversariesMap: new Map<number, Array<CalendarAnniversary>>()
});
const methods = {
  async fetchOwnCalendar() {
    await call<RequestBody, ResponseBody>(Mission.GetMemberCalendar, new RequestBody(state.startOfCalendar, state.endOfCalendar),
      (res) => {
        const responseBody = ResponseBody.fromJson(res.data);
        //일정
        state.schedulesMap = calendarStore.calcMissionCoordinates(
          responseBody.calendar,
          state.startOfCalendar,
          state.endOfCalendar
        );

        //공휴일
        state.holidaysMap = CollectionUtil.toMap<string, CalendarHoliday>(
          responseBody.holidays.filter(h => !h.isLunar),
          (holiday) => holiday.date,
        );
      });
  },
  async fetchOwnAnniversary() {
    await call<RequestBody, GetAnniversaries.ResponseBody>(
      Anniversary.GetAnniversaries, new RequestBody(state.startOfCalendar, state.endOfCalendar),
      (response) => {
        const responseBody = GetAnniversaries.ResponseBody.fromJson(response.data);

        //기념일
        state.anniversariesMap = calendarStore.calcAnniversaries(
          responseBody.anniversaries,
          state.startOfCalendar,
          state.endOfCalendar
        );
      });
  },
  fetchMissionAndAnniversary() {
    //미션,공휴일
    this.fetchOwnCalendar();
    //기념일
    this.fetchOwnAnniversary();
  }
}
onMounted(() => {
  state.calendarWeeks = DateUtil.getCalendarWeeks(props.month, (soc, som, eom, eoc) => {
    state.startOfCalendar = soc.unix();
    state.startOfMonth = som.unix();
    state.endOfMonth = eom.unix();
    state.endOfCalendar = eoc.unix();
  });

  methods.fetchMissionAndAnniversary();
  emitter.on('familyChanged', () => {
    methods.fetchOwnCalendar();
  });
  emitter.on('fetchCalendar', () => {
    methods.fetchOwnCalendar()
  })
  emitter.on('fetchAnniversary', () => {
    methods.fetchOwnAnniversary()
  })
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
