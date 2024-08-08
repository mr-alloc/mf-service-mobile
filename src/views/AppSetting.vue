<script setup lang="ts">

import FamilySelector from '@/components/header/FamilySelector.vue'
</script>
<template>
  <div class="app-setting-container">
    <div class="container-title">앱 설정</div>
    <ul class="convenience-group">
      <li class="group-item">
        <div class="item-title">주 패밀리 설정</div>
        <div class="item-feature">
          <FamilySelector />
        </div>
      </li>
    </ul>
  </div>
</template>
<style scoped lang="scss">
@import '@assets/main';

.app-setting-container {
  .container-title {
    padding: 8px 20px 0;
    font-weight: bold;
    font-size: 1.6rem;

  }

  .convenience-group {
    margin-top: 20px;
    border-top: $standard-light-gray-in-white 1px solid;

    .group-item {
      display: flex;
      flex-direction: row;
      border-bottom: $standard-light-gray-in-white 1px solid;
      padding: 8px 20px;

      .item-title {
        flex-shrink: 0;
        width: 40%;
        display: flex;
        align-items: center;
      }

      .item-feature {
        flex-grow: 1;
      }
    }
  }
}
</style>
