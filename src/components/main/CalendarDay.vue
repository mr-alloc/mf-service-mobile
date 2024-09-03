<template>
  <div class="each-day-item" :class="{
    anniversary: props.anniversaries.has(day.timestamp),
    holiday: props.holidays.has(state.today.format('MM-DD'))
  }">
    <div class="item-header">
      <span class="date" :class="{
        today: state.today.format('YYMMD') === state.now.format('YYMMD'),
        sun: props.day.dayOfWeek.value === DayOfWeek.SUNDAY.value,
        sat: props.day.dayOfWeek.value === DayOfWeek.SATURDAY.value
      }">
        {{ methods.getCalendarDate() }}
      </span>
    </div>
    <div class="item-body">
    </div>
  </div>
</template>
<script setup lang="ts">
import TemporalUtil from "@/utils/TemporalUtil";
import {onMounted, reactive} from "vue";
import moment from "moment-timezone";
import type CalendarDate from "@/classes/CalendarDate";
import {useCalendarStore} from "@/stores/CalendarStore";
import type CalendarAnniversary from "@/classes/CalendarAnniversary";
import DayOfWeek from '@/constant/DayOfWeek'
import { CalendarHoliday } from '@/classes/api-spec/mission/GetMemberCalendar'

const calendarStore = useCalendarStore();
const props = defineProps<{
  timestamp: number,
  day: CalendarDate,
  anniversaries: Map<number, Array<CalendarAnniversary>>,
  holidays: Map<string, CalendarHoliday>
}>();

const state = reactive({
  today: TemporalUtil.toMoment(props.timestamp, true),
  now: moment(),
  anniversary: [] as CalendarAnniversary [],
});

const methods = {
  getCalendarDate() {
    return state.today.date() === 1
        ? state.today.format('M/D')
        : state.today.format('D');

  }
}
onMounted(() => {
})
</script>
<style scoped lang="scss">
@import "@assets/main";

.each-day-item {
  user-select: none;
  border: 0.5px solid $standard-light-gray-in-white;
  transition: $duration, border 0s, transform .1s, position 0s;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1 1 0;

  &.selected {
    background-color: $super-light-signature-purple;
  }

  &.anniversary {

    .item-header {
      background-color: #dfe7fc;
      .date {
        color: $soft-blue;
      }
    }
  }

  &.holiday {

    .item-header {
      background-color: rgba(255, 0, 0, 0.11);
      .date {
        color: $soft-red;
      }
    }
  }

  .item-header {
    font-weight: bold;
    font-size: .72rem;
    user-select: none;
    height: 20px;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 3px 5px;
    justify-content: center;

    .date {
      font-weight: bold;
      padding: 0 5px;
      line-height: 1;

      &.sun {
        color: $soft-red !important;
      }

      &.sat {
        color: $soft-blue !important;
      }

      &.today {
        background-color: $signature-purple;
        border-radius: 5px;
        color: white;
        padding: 2px 5px;
      }

    }
  }


  .item-body {
    flex-grow: 1;

    display: flex;
    flex-direction: column;
  }
}

@media (prefers-color-scheme: dark) {

  .each-day-item {
    border: 0.5px solid $dark-mode-border;

    .item-header {

      .date {
        color: $standard-gray-in-white;
      }
    }

    &.anniversary {
      .item-header {
        background-color: #2da1fb7a;
      }
    }

    &.holiday {

      .item-header {
        background-color: #ff000054;
      }
    }
  }
}
</style>
