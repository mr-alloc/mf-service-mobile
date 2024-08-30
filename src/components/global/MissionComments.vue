<template>
  <div class="mission-comments-container">
    <div class="mission-information">
      <ScheduleModeIndicator :mode="props.detail.schedule.mode" />
      <MissionStatusIndicator :status="props.detail.getStatus(props.timestamp)" :type="props.detail.type" />
      <span class="schedule-text">{{ TemporalUtil.to(props.timestamp, 'MM월 DD일') }} 일정</span>
    </div>
    <div class="comments-wrapper" ref="messageContainer">
      <ul class="daily-comments-group none" v-if="state.comments.length === 0">
        <li class="no-comment-text" :key="0">작성된 의견이 없습니다.</li>
      </ul>
      <ul class="daily-comments-group" v-for="(pair, index) in state.comments" :key="index">
        <span class="daily-group-time">{{ TemporalUtil.to(pair.left, 'YYYY년 MM월 DD일') }}</span>
        <li class="comment-item" :class="{ me: memberInfoStore.memberInfo.id === comment.memberId }"
            v-for="(comment, index) in pair.right"
            :key="index">
          <div class="chatting-balloons-layer">
            <ImageNicknamePair v-if="memberInfoStore.memberInfo.id !== comment.memberId"
                               :option="methods.getMemberInfo(comment.memberId)" />
            <TransitionGroup tag="ul" class="text-balloons" :class="{
              one: comment.comments.length === 1,
              'more-than-two': comment.comments.length >= 2
            }">
              <li class="balloon-item" v-show="commentText" v-for="(commentText, index) in comment.comments"
                  :key="index">
                <span class="comment-text">{{ commentText.content }}</span>
              </li>
            </TransitionGroup>
            <div class="time-area">
            <span class="time-text">{{
                `${TemporalUtil.secondsToTimeStr((comment.minuteAsSecond + TemporalUtil.getOffsetSecond()) % TemporalUtil.SECONDS_IN_DAY, true, false)}`
              }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="new-comment-area">
      <ImageNicknamePair :option="state.currentMember as SelectImageOption"/>
      <div class="comments-input">
        <BlinkTextArea ref="commentInput" place-holder="타인을 존중하는 마음으로 댓글을 작성해요!"
                       :style="{
                         'flex-grow': 1,
                         'justify-content': 'center',
                          padding: '0 2px',
                          height: '100%'
                       }"
                       :on-input="methods.whenCommentInput" />
        <SimpleButton button-name="작성" :submittable="state.isSubmittable"
                      :click-behavior="methods.submitComment"
                      :button-style="{
                      }"
                      :wrapper-style="{
                        height: '100%',
                        width: '60px',
                        'flex-shrink': 0,
                        padding: '0 2px'

                      }"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import {useProfileMemberStore} from "@/stores/ProfileMemberStore";
import SelectImageOption from "@/classes/api-spec/SelectImageOption";
import { inject, onMounted, onUnmounted, reactive, ref } from 'vue'
import ImageNicknamePair from "@/components/global/ImageNicknamePair.vue";
import BlinkTextArea from "@/components/global/BlinkTextArea.vue";
import SimpleButton from "@/components/global/SimpleButton.vue";
import type {GetStringValueExpose} from "@/types/ExposeType";
import {call} from "@/utils/NetworkUtil";
import MissionState from "@/constant/api-meta/MissionState";
import {RequestBody, ResponseBody} from "@/classes/api-spec/mission-state/CreateMissionComment";
import MissionDetail from "@/classes/MissionDetail";
import type MissionComment from '@/classes/api-spec/mission-state/MissionComment'
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";
import LocalAsset from "@/constant/LocalAsset";
import {useMemberInfoStore} from "@/stores/MemberInfoStore";
import * as GetComments from "@/classes/api-spec/mission-state/GetComments";
import {useFamiliesViewStore} from "@/stores/FamiliesViewStore";
import UserComments from "@/classes/UserComments";
import TemporalUtil from "../../utils/TemporalUtil";
import { ex } from '@/utils/Undefinable'
import ScheduleModeIndicator from '@/components/global/ScheduleModeIndicator.vue'
import MissionStatusIndicator from '@/components/global/MissionStatusIndicator.vue'
import CollectionUtil from '@/utils/CollectionUtil'
import TemporalUnit from '@/constant/TemporalUnit'
import type Pair from '@/classes/Pair'
import { comment } from 'postcss'
import { useScroll, useThrottleFn } from '@vueuse/core'

const messageContainer = ref<HTMLDivElement | null>(null)
const ownFamiliesStore = useOwnFamiliesStore();
const familiesViewStore = useFamiliesViewStore();
const memberInfoStore = useMemberInfoStore();
const profileMemberStore = useProfileMemberStore();
const commentInput = ref<GetStringValueExpose | null>(null);
const emitter: any = inject('emitter')
const props = defineProps<{
  timestamp: number,
  detail: MissionDetail
}>()
const state = reactive({
  currentMember: SelectImageOption.ofDefault(),
  isSubmittable: false,
  comments: [] as Array<Pair<number, Array<UserComments>>>,
  notFoundUserOption: SelectImageOption.of(0, "알수없는 유저", LocalAsset.DEFAULT_NO_IMAGE),
  stateId: props.detail.states.find((state) => state.startAt === props.timestamp)?.id ?? 0
});
const methods = {
  whenCommentInput(event: InputEvent) {
    const comment = commentInput.value?.getValue() ?? "";
    if (comment.length > 0) {
      state.isSubmittable = true;
      return
    }
    state.isSubmittable = false;
  },
  submitComment: useThrottleFn(() => {
    const comment = commentInput.value?.getValue() ?? "";
    if (comment.length === 0) {
      return;
    }

    //반복일 경우 stateId가 없을수도 있기때문에 찾아서 확인해야하고, 아닌경우는 stateId를 바로 가져다 쓴다.

    const requestBody = RequestBody.of(state.stateId, props.detail.id, comment, props.timestamp)
    call<RequestBody, ResponseBody>(MissionState.CreateComment, requestBody, (response) => {
      const responseBody = ResponseBody.fromJson(response.data);
      const textArea = commentInput.value?.getInput() as HTMLTextAreaElement;
      textArea.value = "";
      state.isSubmittable = false
      state.stateId = ex(props.detail.findState(props.timestamp)?.id).num()
      methods.fetchComments();
    });
  }),
  getMemberInfo(memberId: number): SelectImageOption {
    if (ownFamiliesStore.hasSelectFamily) {
      const found = familiesViewStore.members.find((member) => member.id === memberId);
      return found
          ? SelectImageOption.of(found.id, found.name, found.image)
          : state.notFoundUserOption as SelectImageOption;
    }
    throw new Error(`Illegal state with: ${memberId}`)
  },
  fetchComments() {
    const requestBody = {
      stateId: state.stateId
    }
    call<any, GetComments.ResponseBody>(MissionState.GetComments, requestBody, (response) => {
      const responseBody = GetComments.ResponseBody.fromJson(response.data);
      //일단위로 코멘트 묶기
      const dailyComments = CollectionUtil.groupingAndThen(
        responseBody.comments.sort((a, b) => a.createdAt.timestamp - b.createdAt.timestamp),
        (comment) => comment.createdAt.value.startOf('day').unix() - TemporalUtil.getOffsetSecond(),
        comments => this.divideByMinute(comments)
      )

      state.comments = CollectionUtil.toPairs(dailyComments).sort((a, b) => a.left - b.left)
      console.log('command bottom')
      methods.messageContainerToBottom()
    });
  },
  divideByMinute(comments: Array<MissionComment>) {
    return comments.reduce((users, comment) => {
      const modular = comment.createdAt.timestamp % 60
      const minuteAsComment = comment.createdAt.timestamp - modular
      if (users.length === 0) {
        users.push(new UserComments(comment.memberId, minuteAsComment, [comment]))
        return users
      }
      //멤버도 같고 같은 분단위이라면 넣는다.
      const lastComments = users[users.length - 1]
      if (lastComments.memberId === comment.memberId && lastComments.minuteAsSecond === minuteAsComment) {
        lastComments.comments.push(comment)
        return users
      }

      //다른 멤버라면 새로운 유저를 추가한다.
      if (lastComments.memberId !== comment.memberId || lastComments.minuteAsSecond !== minuteAsComment) {
        users.push(new UserComments(comment.memberId, minuteAsComment, [comment]))
        return users
      }

      return users
    }, new Array<UserComments>)
  },
  messageContainerToBottom() {
    setTimeout(() => {
      const container = messageContainer.value!
      container.scrollTop = container.scrollHeight
    }, 50)
  }
}
onMounted(() => {
  state.currentMember = SelectImageOption.ofProfileMember(profileMemberStore.profileMember);
  methods.fetchComments();
});

onUnmounted(() => {
  emitter.emit('fetchDiscussions')
})
</script>
<style scoped lang="scss">
@import "@assets/main";

.mission-comments-container {
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
  height: 100%;

  .mission-information {
    display: flex;
    flex-direction: row;
    padding: 10px 0;
    border-bottom: 1px solid $standard-light-gray-in-white;
    flex-shrink: 0;

    .schedule-text {
      padding: 3px 5px;
      font-weight: bold;
      font-size: .82rem;
      color: $warm-black;
    }
  }

  .container-title {

    .title-text {
      font-size: 1rem;
      font-weight: bold;
      color: $soft-dark;
    }

  }

  .comments-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    padding-top: 20px;
    flex-grow: 1;

    .daily-comments-group {
      padding: 20px 0;
      position: relative;
      list-style: none;
      width: 100%;

      .daily-group-time {
        background-color: $standard-weight-gray-in-white;
        border-radius: 15px;
        color: white;
        font-size: .64rem;
        font-weight: bold;
        padding: 2px 8px;
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translate(-50%, 50%);
        z-index: 1;
      }

      .no-comment-text {
        margin: 0 auto;
        padding: 5px 10px;
        display: inline-block;
        font-weight: bold;
        font-size: .84rem;
        line-height: 1;
        border-radius: 15px;
        color: $standard-dark-gray-in-white;
        background-color: $standard-light-gray-in-white;
        user-select: none;
      }

      .comment-item {
        display: flex;
        align-items: flex-start;
        padding: 2px 10px;
        position: relative;
        justify-content: flex-start;
        flex-direction: row;

        .chatting-balloons-layer {
          display: flex;
          flex-direction: column;
          position: relative;
          width: 100%;

          .text-balloons {
            width: 100%;
            display: flex;
            flex-direction: column;
            //overflow: hidden;
            list-style: none;
            padding: 0;

            .balloon-item {
              padding: 2px 0;

              .comment-text {
                padding: 5px 10px;
                font-size: .92rem;
                line-height: 1.2;
                background-color: $standard-light-gray-in-white;
                color: $standard-clean-black;
                max-width: 200px;
                width: max-content;
                white-space: pre-wrap;
                word-break: break-all;
                overflow-wrap: break-word; /* 내용이 넘칠 경우 줄바꿈 */
                user-select: text;

                display: inline-block;
                margin-left: 25px;
              }
            }

            &.one {
              .balloon-item {
                .comment-text {
                  border-radius: 10px;
                }
              }
            }

            &.more-than-two {
              .balloon-item {
                .comment-text {
                  border-radius: 3px 10px 10px 3px;
                }

                &:first-child {
                  .comment-text {
                    border-radius: 10px 10px 10px 3px;
                  }
                }

                &:last-child {
                  .comment-text {
                    border-radius: 3px 10px 10px 10px;
                  }
                }
              }
            }
          }

          .time-area {
            display: flex;
            justify-content: flex-start;

            .time-text {
              width: 100%;
              font-size: .64rem;
              align-items: flex-end;
              padding: 0 5px;
              margin-left: 25px;
            }
          }
        }


        &.me {
          justify-content: flex-end;

          .chatting-balloons-layer {

            .text-balloons {
              justify-content: center;
              align-items: flex-end;

              .balloon-item {
                position: relative;

                .comment-text {
                  background-color: $soft-green;
                  color: white;
                  transition: $duration;

                }
              }


              &.more-than-two {

                .balloon-item {

                  .comment-text {
                    border-radius: 10px 3px 3px 10px;
                  }

                  &:first-child {
                    .comment-text {
                      border-radius: 10px 10px 3px 10px;
                    }
                  }

                  &:last-child {
                    .comment-text {
                      border-radius: 10px 3px 10px 10px;
                    }
                  }
                }
              }
            }

            .time-area {
              justify-content: flex-end;

              .time-text {
                text-align: right;
              }
            }
          }
        }
      }
    }

    .none {
      border: none;
      padding: 0;
    }
  }

  .new-comment-area {
    flex-shrink: 0;

    .comments-input {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      height: 60px;

      .blink-textarea-container:first-child {
        display: flex;
      }
    }
  }
}

@media (prefers-color-scheme: dark) {
  .mission-comments-container {
    .mission-information {
      border-bottom: 1px solid $dark-mode-border;

      .schedule-text {
        color: $standard-gray-in-white;
      }
    }

    .comments-wrapper {

      .daily-comments-group {
        .no-comment-text {
          background-color: $standard-dark-gray-in-white;
          color: $standard-light-gray-in-white;
        }


        .comment-item {

          .chatting-balloons-layer {

            .text-balloons {

              .balloon-item {
                .comment-text {
                  background-color: $dark-mode-panel;
                  color: $standard-gray-in-white;
                }
              }
            }
          }
        }

        .daily-group-time {
          background-color: $standard-clean-dark;
        }
      }
    }
  }
}
</style>
