<template>
  <div class="notification-indicator-container">
    <div class="icon-wrapper">
      <FontAwesomeIcon :icon="faBell" class="fa-2x" />
      <span class="alert-count">1</span>
    </div>
  </div>
</template>
<script setup lang="ts">

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBell } from '@fortawesome/free-regular-svg-icons'
</script>
<style scoped lang="scss">
@import '@assets/main';

.notification-indicator-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    color: $standard-gray-in-white;
    position: relative;

    .alert-count {
      border-radius: 50%;
      color: white;
      background-color: $signature-purple;
      width: 15px;
      height: 15px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: .64rem;
      position: absolute;
      top: -3px;
      right: -3px;
    }
  }
}
</style>
