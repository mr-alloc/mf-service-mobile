<template>
  <div class="global-navigation-bar-container">
    <div class="navigate-button-wrapper" v-on:click="methods.moveTo('/')"
         :class="{ selected: navigateMenuStore.state.activeHomeMenu }">
      <button class="navigate-button">
        <div class="button-content">
          <FontAwesomeIcon :icon="['fas', 'business-time']" class="fa-xl" />
          <span class="menu-name">준비</span>
        </div>
      </button>
    </div>
    <div class="navigate-button-wrapper" v-on:click="methods.moveTo('/calendar')"
         :class="{ selected: navigateMenuStore.state.activeCalendarMenu }">
      <button class="navigate-button">
        <div class="button-content">
          <FontAwesomeIcon :icon="['fas', 'calendar-days']" class="fa-xl" />
          <span class="menu-name">일정</span>
        </div>
      </button>
    </div>
    <div class="navigate-button-wrapper" v-on:click="methods.moveTo('/families')"
         :class="{ selected: navigateMenuStore.state.activeFamiliesMenu }">
      <button class="navigate-button">
        <div class="button-content">
          <FontAwesomeIcon :icon="['fas', 'users']" class="fa-xl" />
          <span class="menu-name">패밀리</span>
        </div>
      </button>
    </div>

  </div>
</template>
<script setup lang="ts">

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useNavigateMenuStore } from '@/stores/NavigateMenuStore'
import { useRouter } from 'vue-router'

const navigateMenuStore = useNavigateMenuStore();
const router = useRouter()
const methods = {
  moveTo(path: string) {
    router.push(path);
  }
}
</script>
<style scoped lang="scss">
@import "@assets/main";

.global-navigation-bar-container {
  flex-shrink: 0;
  height: $footer-height;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  padding: 5px 8px 15px 8px;
  background-color: white;

  .navigate-button-wrapper {
    border-radius: 5px;
    color: $standard-weight-gray-in-white;
    width: 100%;
    display: flex;
    user-select: none;
    justify-content: center;
    align-items: center;

    .navigate-button {

      .button-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .menu-name {
          font-weight: bold;
          font-size: .64rem;
        }
      }
    }

    &.selected {
      color: $text-signature-purple !important;
    }
  }
}
</style>
