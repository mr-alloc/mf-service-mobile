<template>
  <div class="main-index-container">
    <div class="page-header">
      <ul class="feature-option-group">
        <li class="switch-all-schedule">
          <div class="feature-name">
            <span class="name-text">패밀리 일정</span>
          </div>
          <SwitchButton :default="state.familyFilter" :switch="() => state.familyFilter = !state.familyFilter" />
        </li>
      </ul>
    </div>
    <Transition name="fade">
      <div class="empty-schedule-indicator" v-show="state.missions.length === 0">
        <span class="empty-text">당분간 예정된 일정이 없어요.</span>
      </div>
    </Transition>
    <TransitionGroup name="falling" tag="ul" class="coming-mission-group">
      <li class="each-mission" :key="index"
          v-show="state.familyFilter || state.details.get(mission.id)?.assignee === memberInfoStore.memberInfo.id"
          v-for="(mission, index) in state.missions as Array<CalendarMission>">
        <div class="card-header">
          <ScheduleModeIndicator :mode="state.details.get(mission.id)?.schedule.mode" />
          <MissionStatusIndicator
            :status="MissionStatus.fromValue(ex(state.stateMap.get(mission.id)?.get(mission.startAt)?.status).num())"
            :type="mission.type" />
          <span class="mission-name">{{ mission.name }}</span>
        </div>
        <div class="card-body">
          <div class="registered-period">
            {{ methods.getScheduleTimeStr(mission.id) }}
          </div>
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>
<script setup lang="ts">
import { inject, onMounted, reactive } from 'vue'
import { call } from '@/utils/NetworkUtil'
import Mission from '@/constant/api-meta/Mission'
import { ResponseBody } from '@/classes/api-spec/mission/GetComingMissions'
import MissionDetail from '@/classes/MissionDetail'
import DateUtil from '@/utils/DateUtil'
import moment from 'moment-timezone'
import CalendarMission from '@/classes/CalendarMission'
import type MissionState from '@/classes/MissionState'
import CollectionUtil from '@/utils/CollectionUtil'
import MissionStatus from '../constant/MissionStatus'
import { ex } from '../utils/Undefinable'
import MissionStatusIndicator from '@/components/global/MissionStatusIndicator.vue'
import ScheduleModeIndicator from '@/components/global/ScheduleModeIndicator.vue'
import type ScheduleValue from '@/classes/api-spec/ScheduleValue'
import TemporalUnit from '@/constant/TemporalUnit'
import SwitchButton from '@/components/global/SwitchButton.vue'
import { useAlertStore } from '@/stores/AlertStore'
import { useProfileMemberStore } from '@/stores/ProfileMemberStore'
import { useMemberInfoStore } from '@/stores/MemberInfoStore'


const memberInfoStore = useMemberInfoStore()
const emitter: any = inject('emitter')
const state = reactive({
  details: new Map<number, MissionDetail>,
  missions: new Array<CalendarMission>,
  stateMap: new Map<number, Map<number, MissionState>>,
  familyFilter: false
});
const methods = {
  fetchComingMissions() {
    call<any, ResponseBody>(Mission.GetComingMission, null, (response) => {
      const responseBody = ResponseBody.fromJson(response.data)

      state.details = CollectionUtil.toMap(responseBody.missions, detail => detail.id)

      state.stateMap = CollectionUtil.groupingAndThen<MissionState, number, Map<number, MissionState>>(
        responseBody.missions.flatMap(mission => mission.states ?? []),
        (state) => state.missionId,
        (states) => CollectionUtil.toMap<number, MissionState>(
          states,
          state => state.startAt
        )
      )

      DateUtil.getCalendarPeriod(moment(), 10, (start, end) => {
        state.missions = responseBody.missions
          .flatMap((detail: MissionDetail) => CalendarMission.of(detail, start, end))
          .sort((a, b) => a.startAt - b.startAt)
      })
    });
  },
  getScheduleTimeStr(missionId: number) {
    const detail: MissionDetail = state.details.get(missionId) as MissionDetail
    const schedule = detail.schedule as ScheduleValue
    const noon = TemporalUnit.getSecond(12, TemporalUnit.HOUR)
    const eridiemStr = noon <= ex(schedule?.scheduleTime).num()
      ? '오후'
      : '오전'

    return `${DateUtil.secondsToString((schedule?.startAt ?? 0) + ex(schedule?.scheduleTime).num(), `MM-DD ${eridiemStr} hh시`)}`
  }
}
onMounted(() => {
  methods.fetchComingMissions()

  emitter.on('familyChanged', () => {
    methods.fetchComingMissions()
  })
})
</script>
<style scoped lang="scss">
@import "@assets/main";

.main-index-container {
  padding: 0 10px;

  .page-header {
    padding: 10px 0;

    .feature-option-group {
      display: flex;

      .switch-all-schedule {

        .feature-name {
          height: 20px;
          display: flex;
          align-items: center;

          .name-text {
            font-size: .64rem;
            font-weight: bold;
          }
        }

      }
    }
  }

  .empty-schedule-indicator {
    background-color: $standard-gray-in-white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    margin-top: 20px;

    .empty-text {
      color: white;
    }
  }


  .each-mission {
    border: 1px $standard-light-gray-in-white solid;
    border-radius: 5px;
    margin-bottom: 5px;

    .card-header {
      display: flex;
      flex-direction: row;
      padding: 3px 5px;

      .mission-name {
        padding: 0 10px;
        font-weight: bold;
      }
    }

    .card-body {
      padding: 0 13px;

      .registered-period {
        font-size: .64rem;
        font-weight: bold;
      }
    }
  }
}

.falling-enter-active {
  animation: falling-in .4s;
}

.falling-leave-active {
  animation: falling-in .4s reverse;
}

@keyframes falling-in {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-color-scheme: dark) {
  .main-index-container {

    .each-mission {
      border: 1px solid $dark-mode-border;
    }

    .empty-schedule-indicator {
      background-color: $dark-mode-panel;
    }
  }
}
</style>
