<template>
  <div class="mission-status-timeline-container">
    <ul class="timeline-groups">
      <li class="each-case" v-for="missionStatus in state.missionStatuses"
          :class="[missionStatus.simpleName, {
            current: missionStatus.code === props.status,
            'signature-shiny': missionStatus.code === props.status
      }]" v-bind:key="missionStatus.code">{{ missionStatus.name }}
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { inject, reactive } from 'vue'
import MissionStatus from '@/constant/MissionStatus'
import PopupUtil from '@/utils/PopupUtil'
import * as ChangeFamilyMissionAttribute from '@/classes/api-spec/mission/ChangeMissionAttribute'
import { call } from '@/utils/NetworkUtil'
import Mission from '@/constant/api-meta/Mission'
import { useAlertStore } from '@/stores/AlertStore'
import MissionDetail from '@/classes/MissionDetail'

const props = defineProps<{
  status: number,
}>();
const state = reactive({
  missionStatuses: [MissionStatus.CREATED, MissionStatus.IN_PROGRESS, MissionStatus.COMPLETED]
});
</script>
<style scoped lang="scss">
@import "@assets/main";

.mission-status-timeline-container {
  width: 100%;

  .timeline-groups {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

    .each-case {
      font-size: .55rem;
      width: 30px;
      height: 30px;
      padding: 3px;
      border-radius: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      word-break: keep-all;
      font-weight: bold;
      color: white;
      border: 1px solid $little-light-signature-purple;
      background-color: $greater-light-signature-purple;
      user-select: none;

      &.current {
        background-color: $text-signature-purple;
      }
    }
  }
}

@media (prefers-color-scheme: dark) {
  .mission-status-timeline-container {
    .timeline-groups {

      .each-case {
        background-color: $light-signature-purple;

      }
    }
  }
}
</style>
