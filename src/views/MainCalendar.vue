<template>
  <div class="calendar-container">
    <div class="calendar-wrapper">
      <div class="calendar-title">
        <span class="title-text">{{ state.monthTitle }}</span>
      </div>
      <div class="day-of-weeks">
        <div class="day" v-for="day in DayOfWeek.values()" :key="day.value">{{ day.alias }}</div>
      </div>
      <Swiper :modules="swiperModules" class="calendar-swiper" @swiper="methods.getSwiperRef" @slideChange="methods.whenSlideChange">
        <SwiperSlide class="calendar-swiper-slide" :key="month.unix()" v-for="(month) in state.months">
          <CalendarMonth :month="month"/>
        </SwiperSlide>
      </Swiper>
    </div>
    <Transition name="fade">
      <div class="calendar-controller" v-show="calendarStore.timestamp > 0">
        <ul class="calendar-feature-group">
          <li class="feature-item">
            <FontAwesomeIcon :icon="faPlus"/>
            <span class="description">미션추가</span>
          </li>
          <li class="feature-item">
            <FontAwesomeIcon :icon="faCalendarDay"/>
            <span class="description">휴가/기념일 지정</span>
          </li>
          <li class="feature-item" v-on:click="methods.resetComponent">
            <FontAwesomeIcon :icon="faRectangleXmark"/>
            <span class="description">선택취소</span>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import DateUtil from "@/utils/DateUtil";
import moment, { type Moment } from 'moment-timezone'
import {inject, onMounted, reactive, ref} from "vue";
import DayOfWeek from "@/constant/DayOfWeek";
import {useCalendarStore} from "@/stores/CalendarStore";
import CalendarDate from "@/classes/CalendarDate";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {faCalendarDay} from "@fortawesome/free-solid-svg-icons/faCalendarDay";
import {faRectangleXmark} from "@fortawesome/free-regular-svg-icons/faRectangleXmark";
import { Navigation } from 'swiper/modules'
import CalendarMonth from '@/components/global/CalendarMonth.vue'
import 'swiper/css';
import 'swiper/css/navigation';
import Pair from '@/classes/Pair'
import type { Swiper as SwiperClass } from 'swiper/types'


const calendarStore = useCalendarStore();
const swiper = ref<SwiperClass|null>(null);

const state = reactive({
  calendarWeeks: new Map<number, Array<CalendarDate>>(),
  monthTitle: "",
  months: new Array<Moment>(),
});
const swiperModules = [Navigation]
const methods = {
  getSwiperRef(swiperClass: SwiperClass) {
    swiper.value = swiperClass;
  },
  whenSlideChange(swiperClass: SwiperClass) {
    const active = swiperClass.activeIndex;
    const activeMonth = state.months[active];
    const lastIndex = state.months.length -1;
    state.monthTitle = activeMonth.format("YYYY년 MM월");
    console.log('active', active);
    console.log('before size', state.months.length);

    //맨앞에 한개 추가
    if (active === 0) {
      const firstMonth = state.months[0];
      const previousMonth = firstMonth.clone().add(-1, 'month')
      console.log('first month', firstMonth.format(DateUtil.YYYYMM));
      console.log('previous month', previousMonth.format(DateUtil.YYYYMM));
      state.months.unshift(previousMonth);
    } else if (active === lastIndex) {
      const lastMonth = state.months[lastIndex]
      state.months.push(lastMonth.clone().add(1, 'month'));
    }
    console.log('after size', state.months.length);
  },
  resetComponent() {
    calendarStore.resetSelected();
  }
}
onMounted(() => {
  const thisMonth = moment();
  [-1, 0, +1].forEach(month => {
    const eachMonth = thisMonth.clone().add(month, 'month');
    state.months.push(eachMonth);
  });
  state.monthTitle = thisMonth.format("YYYY년 MM월");
  //이번달
  swiper.value?.slideTo(1);
})
</script>
<style scoped lang="scss">
@import "@assets/main";

.calendar-container {
  height: 100%;
  display: flex;
  flex-direction: row;

  .calendar-wrapper {
    flex-grow: 1;
    width: 100%;
    height: 100%;
    display: flex;
    background-color: #fff;
    flex-direction: column;
    user-select: none;

    .calendar-title {
      margin: 10px 0 0;
      flex-shrink: 0;
      padding: 0 20px;
      display: flex;
      flex-direction: row;

      .title-text {
        font-size: 1.4rem;
        font-weight: bold;
        flex-shrink: 0;
      }

      .calendar-control {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin-top: 10px;
        flex-grow: 1;
        align-items: center;

        .control-button {
          margin-left: 10px;
          padding: 3px 10px;
          border-radius: 5px;
          transition: $duration;
          cursor: pointer;
          height: 30px;

          &:hover {
            background-color: rgb(0, 0, 0, .2);
          }
        }
      }
    }

    .day-of-weeks {
      display: flex;
      flex-direction: row;
      padding: 5px 0;

      .day {
        width: 100%;
        font-weight: bold;
        text-align: center;
      }
    }

    .calendar-swiper {
      height: 100%;

      .swiper-wrapper {
        display: flex;
        flex-direction: row;

        .calendar-swiper-slide {
        }
      }
    }
  }

  .component-control-panel {
    display: flex;
    flex-shrink: 0;
  }


  .calendar-controller {
    user-select: none;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: max-content;
    padding: 10px 20px;
    flex-shrink: 0;
    background-color: white;
    border-top: 1px solid $standard-light-gray-in-white;
    bottom: 100px;
    left: 50%;
    transform: translate(-50%, 50%);
    box-shadow: $standard-box-shadow;
    border-radius: 5px;
    z-index: 1;
    transition: $duration;

    .panel-header {
      font-size: .84rem;
      font-weight: bold;
      padding: 5px 0;
      border-bottom: 1px solid $standard-light-gray-in-white;
    }

    .calendar-feature-group {
      display: flex;
      flex-direction: row;
      justify-content: center;
      padding: 2px;

      .feature-item {
        display: flex;
        cursor: pointer;
        transition: $duration;
        border-radius: 5px;
        width: 2.5rem;
        height: 2.5rem;
        justify-content: center;
        align-items: center;
        margin: 0 2px;
        position: relative;

        .description {
          font-size: .84rem;
          position: absolute;
          z-index: -1;
          opacity: 0;
          background-color: $standard-clean-black;
          color: white;
          border-radius: 5px;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          transition: $duration;
          width: max-content;
          padding: 2px 5px;

          &:after {
            border-top: 10px solid $standard-clean-black;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 0 solid transparent;
            border-radius: 10px;
            content: "";
            position: absolute;
            top: 90%;
            left: 50%;
            transform: translateX(-50%);
          }
        }

        &:hover {
          background-color: rgb(0, 0, 0, .2);

          .description {
            z-index: 1;
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
