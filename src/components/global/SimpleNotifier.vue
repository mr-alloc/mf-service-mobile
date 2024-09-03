<template>
  <div class="notifications-wrapper">
    <TransitionGroup name="alert-fade" tag="ul" class="notice-message-list">
      <li class="message-item" v-show="notification.visible" v-for="(notification, index) in alertStore.notifications"
          :class="`alert-${notification.timestamp}`"
          :key="notification.timestamp">
        <div class="message-header">
          <div class="message-icon" :class="[notification.type]">
            <FontAwesomeIcon :icon="methods.getNoticeIcon(notification.type)" class="fa-sm" />
            <span class="message-title">{{ notification.title }}</span>
          </div>
          <div class="close-box" v-on:click="methods.dismissAlert(index)">
            <FontAwesomeIcon :icon="['fas', 'xmark']" class="fa-xs" />
          </div>
        </div>
        <div class="message-body">
          <div class="message-content">
            <span>{{ notification.message }}</span>
          </div>
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>
<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {AlertType, useAlertStore} from "@/stores/AlertStore";
import {reactive} from "vue";

const alertStore = useAlertStore()

const methods = {
  getNoticeIcon(type: AlertType) {
    switch (type) {
      case AlertType.INFO:
        return ["fas", "triangle-exclamation"];
      case AlertType.WARNING:
        return ["fas", "circle-exclamation"];
      case AlertType.SUCCESS:
        return ["far", "circle-check"];
      case AlertType.GUIDE:
        return ["fas", "flag"];
      default:
        return ["fas", "hands-clapping"];
    }
  },
  dismissAlert(index: number) {
    alertStore.notifications.splice(index, 1)
  }
};
</script>
<style scoped lang="scss">
@import '@assets/main.scss';

.notifications-wrapper {
  z-index: 10;
  position: fixed;
  transform: translate(-50%, 10px);
  left: 50%;
  top: 50px;

  .all-clear {
    display: flex;
    height: 40px;
    justify-content: center;
    align-items: center;
    transition: .5s;

    .alert-cleaner {
      border: 1px $standard-gray-in-white solid;
      background-color: rgba(0, 0, 0, 0.62);
      border-radius: 10px;
      padding: 0;
      width: 45px;
      height: 21px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: $standard-light-gray-in-white;
      font-size: .64rem;

      span {

        padding: 3px;
      }
    }
  }

  .notice-message-list {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    padding: 0;

    .message-item {
      z-index: 2;
      background-color: rgba(0, 0, 0, 0.62);
      backdrop-filter: blur(5px);
      color: $standard-light-gray-in-white;
      width: 160px;
      display: flex;
      flex-direction: column;
      border-radius: 10px;
      transition: transform 0s;
      margin-bottom: 10px;
      box-shadow: $standard-box-shadow;
      border: 1px $standard-weight-gray-in-white solid;
      user-select: none;
      position: absolute;

      .message-header {
        height: 15px;
        display: flex;
        flex-direction: row;
        padding: 5px 5px 0px;
        transition: .2s;
        color: $standard-gray-in-white;
        flex-shrink: 0;


        .message-icon {
          flex-grow: 1;
          display: flex;
          align-items: center;
          transition: .2s;
          color: #f6e0c0;

          &.warning {
            color: #e74444;
          }

          &.info {
            color: #f6cb70;
          }

          &.success {
            color: #4daf73;
          }

          &.guide {
            color: $light-signature-purple;
          }


          .message-title {
            padding: 0 8px;
            color: white;
            font-size: .74rem;
          }
        }



        .close-box {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: .2s;
          color: $standard-gray-in-white;
          position: relative;
          right: -10px;
          top: -10px;
          border-radius: 50%;
          border: 1.4px #787878 solid;
          background-color: #333333;
          opacity: 0;

        }
      }

      .message-body {
        display: flex;
        flex-direction: row;
        flex-grow: 1;


        .message-content {
          flex-grow: 1;
          display: flex;
          align-items: center;
          padding: 2px 8px;
          font-size: .62rem;
          text-overflow: ellipsis;

        }
      }

      &:nth-child(1) {
        transform: scale(1.1);
        top: 11px
      }

      &:nth-child(2) {
        transform: scale(1.2);
        top: 22px;
      }

      &:nth-child(3) {
        transform: scale(1.3);
        top: 32px;
      }
    }
  }
}


.alert-fade-enter-active {
  animation: alert-fade-in $duration;
}

.alert-fade-leave-active {
  animation: alert-fade-in $duration reverse;
}

@keyframes alert-fade-in {
  0% {
    opacity: 0;
    margin-top: 14px;
  }

  100% {
    opacity: 1;
    margin-top: 0px;
  }
}

</style>
