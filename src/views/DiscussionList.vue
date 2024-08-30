<template>
  <div class="discuss-list-container">
    <Transition name="fade">
      <div class="empty-discuss-indicator" v-show="state.discussions.length === 0">
        <span class="empty-text">토론중인 내용이 없어요.</span>
      </div>
    </Transition>
    <TransitionGroup tag="ul" name="fade" class="discussion-list">
      <li class="each-discussion" v-for="(discussion) in state.discussions"
          :key="discussion.id" v-on:click="() => methods.openDiscussion(discussion as Discussion)">
        <div class="image-frame">
          <div class="discussion-image">
            <img src="@assets/images/default_user_profile.png" alt="유저 프로필 이미지" />
          </div>
        </div>
        <div class="content-wrapper">
          <div class="discussion-information">
            <span class="discussion-title">{{ discussion.name }}</span>
          </div>
          <div class="latest-state">
            <span class="message-text">{{ discussion.latestMessage }}</span>
            <span class="updated-text">{{ DateUtil.toKoreanString(discussion.latestUpdateTime) }}</span>
          </div>
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>
<script setup lang="ts">
import { inject, onMounted, reactive } from 'vue'
import { call } from '@/utils/NetworkUtil'
import MissionState from '@/constant/api-meta/MissionState'
import { ResponseBody } from '@/classes/api-spec/mission-state/GetDiscussions'
import Discussion from '@/classes/Discussion'
import DateUtil from '../utils/DateUtil'
import * as GetMissionDetail from '@/classes/api-spec/mission/GetMissionDetail'
import Mission from '@/constant/api-meta/Mission'
import NavigateComponent from '@/classes/NavigateComponent'
import { useNavigateStackStore } from '@/stores/NavigateStackStore'


const navigateStackStore = useNavigateStackStore()
const emitter: any = inject('emitter')
const state = reactive({
  discussions: new Array<Discussion>()
});
const methods = {
  fetchDiscussions() {
    call<any, ResponseBody>(MissionState.GetDiscussions, null, (response) => {
      const responseBody = ResponseBody.fromJson(response.data)
      state.discussions = responseBody.discussions
    })
  },
  openDiscussion(discussion: Discussion) {
    call<any, GetMissionDetail.ResponseBody>(Mission.GetMissionDetail, { missionId: discussion.missionId }, (response) => {
      const responseBody = GetMissionDetail.ResponseBody.fromJson(response.data)
      const detail = responseBody.mission
      const component = new NavigateComponent(detail.name, 'MissionComments', {
        timestamp: discussion.stateScheduleTime,
        detail: detail
      })
      navigateStackStore.stackComponent(component)
    })
  }
}
onMounted(() => {
  methods.fetchDiscussions()

  emitter.on('fetchDiscussions', () => {
    methods.fetchDiscussions()
  })
})
</script>
<style scoped lang="scss">
@import '@assets/main';

.discuss-list-container {
  padding: 8px 10px;
  height: 100%;

  .empty-discuss-indicator {
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

  .discussion-list {
    height: 100%;
    overflow-y: scroll;

    .each-discussion {
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 60px;

      .image-frame {
        flex-shrink: 0;
        width: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;

        .discussion-image {
          display: flex;
          width: 2.2rem;
          height: 2.2rem;
          border-radius: 10px;
          background-color: lightgray;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .content-wrapper {
        flex-grow: 1;
        padding: 8px 10px;
        display: flex;
        flex-direction: column;
        height: 100%;

        .discussion-information {
          height: 20px;
          flex-shrink: 0;
          display: flex;
          align-items: center;

          .discussion-title {
            font-weight: bold;
            font-size: .94rem;

          }
        }

        .latest-state {
          flex-grow: 1;
          font-size: .72rem;
          display: flex;


          .message-text {
            color: $standard-dark-gray-in-white;
            flex-grow: 1;
          }

          .updated-text {
            flex-shrink: 0;
            width: 60px;
            text-align: right;
          }
        }
      }
    }

  }

}

@media (prefers-color-scheme: dark) {
  .discuss-list-container {

    .empty-discuss-indicator {
      background-color: $dark-mode-panel;
    }
  }
}
</style>
