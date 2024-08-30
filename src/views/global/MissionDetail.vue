<template>
  <div class="mission-detail-container">
    <div class="detail-header-wrapper" v-if="state.detail">
      <ModifiableTitle :title="state.detail.name" :before-change="methods.modifyTitle"/>
      <ExpandableFeatureMenuButton :icon="['fas', 'ellipsis-vertical']" :executable-features="state.features as Array<ExecutableFeature>"/>
    </div>
    <MissionState v-if="state.detail" :state-time="props.mission.startAt" :detail="state.detail as MissionDetail"
                  :status="MissionStatus.fromValue(state.status)" :state-id="state.stateId"
                  :members="state.members as Array<SelectImageOption>" />
    <div class="deadline-timer" v-if="state.detail && MissionType.SCHEDULE.value !== state.detail.type">
      <div class="timer-count-wrapper">
        <span class="guide-text signature-shiny" :class="{
          competed: MissionStatus.COMPLETED.code === state.status,
        }">남은 시간</span>
        <span class="remain-time">{{ state.remainTimeStr }}</span>
        <span v-if="state.spentSeconds > 0" class="saved-time">({{ state.spentSecondsStr }})</span>
      </div>
      <div class="fuse-wire-wrapper">
        <span class="progress-fuse-wire"></span>
      </div>
    </div>
    <MarkdownTextarea v-if="state.detail" :content="state.detail?.description"
                      :before-change="methods.changeDescription" />
    <div class="float-discussions">
      <SimpleIconButton button-name="토론" :click-behavior="methods.openDiscussion" :icon="['fas', 'comments']" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { inject, onMounted, onUnmounted, reactive } from 'vue'
import PopupUtil from '@/utils/PopupUtil'
import { useAlertStore } from '@/stores/AlertStore'
import { call } from '@/utils/NetworkUtil'
import * as ChangeFamilyMissionAttribute from '@/classes/api-spec/mission/ChangeMissionAttribute'
import * as GetMissionDetail from '@/classes/api-spec/mission/GetMissionDetail'
import * as DeleteMission from '@/classes/api-spec/mission/DeleteMission'
import Mission from '@/constant/api-meta/Mission'
import MissionStatus from '@/constant/MissionStatus'
import ModifiableTitle from '@/components/global/ModifiableTitle.vue'
import TemporalUtil from '../../utils/TemporalUtil'
import ExpandableFeatureMenuButton from '@/components/global/ExpandableFeatureMenuButton.vue'
import ExecutableFeature from '@/classes/api-spec/ExecutableFeature'
import MissionType from '@/constant/MissionType'
import type MissionDetail from '@/classes/MissionDetail'
import MissionState from '@/components/global/MissionState.vue'
import MissionComments from '@/components/global/MissionComments.vue'
import CalendarWeekMission from '@/classes/CalendarWeekMission'
import { useFamiliesViewStore } from '@/stores/FamiliesViewStore'
import SelectImageOption from '@/classes/api-spec/SelectImageOption'
import MarkdownTextarea from '@/components/global/MarkdownTextarea.vue'
import { ex } from '@/utils/Undefinable'
import SimpleIconButton from '@/components/global/SimpleIconButton.vue'
import { useNavigateStackStore } from '@/stores/NavigateStackStore'
import NavigateComponent from '@/classes/NavigateComponent'
import type CalendarMission from '@/classes/CalendarMission'
import { RequestBody, ResponseBody } from '@/classes/api-spec/mission/ChangeMissionAttribute'


const emitter: any = inject("emitter");
const navigateStackStore = useNavigateStackStore()
const familiesViewStore = useFamiliesViewStore();
const alertStore = useAlertStore();
const props = defineProps<{
  mission: CalendarWeekMission
}>();

const methods = {
  modifyTitle(title: string, afterChange: (isRollback: boolean) => void) {
    if (state.detail?.name === title) {
      afterChange(false);
      return;
    }
    PopupUtil.confirm("미션명 변경", `미션 이름을 "${title}"으로 변경하시겠습니까?`, () => {
      const requestBody = ChangeFamilyMissionAttribute.RequestBody.forName(props.mission.mission.id, title);
      call<ChangeFamilyMissionAttribute.RequestBody, ChangeFamilyMissionAttribute.ResponseBody>(Mission.ChangeMissionAttribute, requestBody, (response) => {
        const responseBody = ChangeFamilyMissionAttribute.ResponseBody.fromJson(response.data);
        const changed = responseBody.changed;
        if (changed.name === title) {
          alertStore.success("이름 변경", '미션명이 변경 되었어요.');
          state.detail = responseBody.changed;
          emitter.emit('fetchCalendar')
          afterChange(false);
        } else {
          alertStore.warning("이름 변경", `미션명 변경에 실패했어요.`);
          afterChange(true)
        }
      })
    }, () => afterChange(true));
  },
  deleteMission(event?: Event) {
    PopupUtil.confirm("미션 삭제", "미션을 삭제하시겠습니까?", () => {
      call<any, DeleteMission.ResponseBody>(Mission.DeleteMission, {missionId: props.mission.mission.id},
          (response) => {
            const responseBody = DeleteMission.ResponseBody.fromJson(response.data);
            if (props.mission.mission.id === responseBody.missionId) {
              alertStore.success("미션 삭제", "미션을 삭제하였습니다.");
              emitter.emit('fetchCalendar')
              emitter.emit("resetComponent");
            } else {
              alertStore.warning("미션 삭제", "미션을 삭제하지 못했습니다.");
            }
          });
    });
  },
  updateSecondsDisplay() {
    state.remainTimeStr = TemporalUtil.secondsToTimeStr(state.remainSeconds, false, true)
    state.spentSecondsStr = TemporalUtil.secondsToTimeStr(state.spentSeconds, false, true)
  },
  calcRemainTime(currentStatus: MissionStatus) {
    //카운트를 계속 계산해야 바뀜
    methods.calcRemainSeconds();
    if (state.remainSeconds <= 0 || currentStatus.code === MissionStatus.CREATED.code) return
    this.updateSecondsDisplay()
    state.timerId = setTimeout(() => methods.calcRemainTime(currentStatus), 1000)
    if (state.status === MissionStatus.COMPLETED.code) {
      clearTimeout(state.timerId)
    }
  },
  calcRemainSeconds() {
    const currentState = state.detail?.findStateById(state.stateId)
    const expectedDeadline = ex(currentState?.concreteStartAt).num() + ex(state.detail?.deadline).num()
    const timestamp = TemporalUtil.getEpochSecond(false)

    if (state.status === MissionStatus.CREATED.code) {
      state.remainSeconds = ex(state.detail?.deadline).num()
    } else if (state.status === MissionStatus.IN_PROGRESS.code) {
      state.remainSeconds = expectedDeadline <= timestamp ? 0 : expectedDeadline - timestamp;
      state.remainSeconds === 0 && (state.remainTimeStr = '만료')
    } else if (state.status === MissionStatus.COMPLETED.code) {
      const spentSeconds = ex(currentState?.concreteCompleteAt).num() - ex(currentState?.concreteStartAt).num()
      const deadline = ex(state.detail?.deadline).num()
      console.log('spentSeconds:', spentSeconds)
      console.log('deadline:', deadline)
      state.spentSeconds = spentSeconds > deadline ? deadline : spentSeconds
      const remainSeconds = deadline - state.spentSeconds
      state.remainSeconds = remainSeconds < 0 ? 0 : remainSeconds
    }
    this.updateSecondsDisplay()
  },
  countRemainTime() {
    const currentStatus = MissionStatus.fromCode(state.status);
    methods.calcRemainSeconds();
    methods.calcRemainTime(currentStatus);
  },
  async fetchMissionDetail() {
    await call<any, GetMissionDetail.ResponseBody>(Mission.GetMissionDetail, {missionId: props.mission.mission.id}, (response) => {
      const responseBody = GetMissionDetail.ResponseBody.fromJson(response.data);
      state.detail = responseBody.mission;
      const missionState = state.detail.states.find(state => state.startAt === props.mission.startAt);
      state.stateId = missionState?.id ?? 0;
      state.status = missionState?.status ?? 0;

      methods.countRemainTime();
    });
  },
  openDiscussion(event: MouseEvent) {
    const component = new NavigateComponent(ex(state.detail?.name).str(), 'MissionComments', {
      timestamp: props.mission.startAt,
      detail: state.detail
    })
    navigateStackStore.stackComponent(component)
  },
  changeDescription(description: string, afterChange: () => void) {
    if (!state.detail || description === state.detail.description) return

    PopupUtil.confirm('설명 변경', '설명을 변경 하시겠습니까?', () => {
      const requestBody = RequestBody.forDescription(state.detail?.id ?? 0, description)

      call<RequestBody, ResponseBody>(Mission.ChangeMissionAttribute, requestBody, (response) => {
        const responseBody = ResponseBody.fromJson(response.data)
        const changed = responseBody.changed
        if (changed.description === description) {
          alertStore.success('설명 변경', '변경이 완료되었습니다.')
          afterChange()
        } else {
          alertStore.warning('설명 변경', '변경에 실패했습니다.')
        }
      })
    })
  }
}

const state = reactive({
  members: familiesViewStore.members.map(member => member.toSelectImageOption()),
  statusOptions: MissionStatus.values().filter(MissionStatus.NOT_DELETED_FILTER).map(MissionStatus.toSelectOption),
  typeOptions: MissionType.values().map(MissionType.toSelectOption),
  features: [
    new ExecutableFeature('삭제', methods.deleteMission)
  ],
  detail: null as MissionDetail | null,
  stateId: 0,
  status: 0,
  remainSeconds: 0,
  remainTimeStr: '00:00:00',
  spentSeconds: 0,
  spentSecondsStr: '00:00:00',
  timerId: 0
});
onMounted(async () => {
  await methods.fetchMissionDetail();

  emitter.on("fetchMissionDetail", async () => {
    await methods.fetchMissionDetail();
  });
});

onUnmounted(() => {
  clearTimeout(state.timerId)
})
</script>
<style scoped lang="scss">
@import "@assets/main";

.mission-detail-container {

  .detail-header-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .detail-specifications-group {
    display: flex;
    flex-direction: row;
    margin: 20px 0;
    justify-content: flex-start;
    border: 1px solid $standard-light-gray-in-white;
    border-radius: 10px;
    width: max-content;

    .detail-pair {
      display: flex;
      flex-direction: column;
      width: max-content;
      border-collapse: collapse;
      border-radius: 5px;

      .detail-title {
        overflow: hidden;
        font-weight: bold;
        font-size: .94rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: $standard-gray-in-white;
        padding: 0 5px;
        flex-shrink: 0;
      }

      .detail-content {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 3px;
      }

      &:first-child {
        .detail-title {
          border-top-left-radius: 5px;
        }
      }

      &:not(:last-child) {
        border-right: 1px solid $standard-light-gray-in-white;
      }

      &:last-child {
        .detail-title {
          border-top-right-radius: 5px;
        }
      }
    }
  }

  .deadline-timer {
    padding: 0 20px;

    .timer-count-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;

      .guide-text {
        font-size: .84rem;
        font-weight: bold;
        margin-right: 5px;
        background-color: $signature-purple;
        color: white;
        padding: 3px 5px;
        border-radius: 5px;

        &.competed {
          animation: none;
          background-color: $super-light-signature-purple;
        }

      }

      .remain-time {
        padding: 0 20px;
        font-size: 1.2rem;
        font-weight: bold;

        &.normal {
          color: $soft-green;
        }

        &.little-urgent {
          color: $soft-orange;
        }

        &.urgent {
          color: $soft-red;
        }


        &.overdue {
          color: $standard-gray-in-white;
        }
      }

      .saved-time {
        color: #e72626;
        font-weight: bold;
      }
    }

    .fuse-wire-wrapper {

      .progress-fuse-wire {

      }
    }
  }
}
</style>
