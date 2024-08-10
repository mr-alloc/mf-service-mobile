<template>
  <div class="app-setting-container">
    <div class="container-title">앱 설정</div>
    <ul class="convenience-group">
      <li class="group-item">
        <div class="item-title">기본 일정</div>
        <div class="item-feature">
          <PreferFamilySelector :refresh-function="methods.changePreferFamily"
                                :selected-family="new FamilySummary(0, '', LocalAsset.DEFAULT_NO_IMAGE, '개인 일정', '', 0)" />
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">

import { onMounted } from 'vue'
import PreferFamilySelector from '@/components/global/PreferFamilySelector.vue'
import { FamilySummary } from '@/classes/api-spec/family/GetOwnFamilies'
import LocalAsset from '@/constant/LocalAsset'

const methods = {
  changePreferFamily(familyId: number) {

  }
}

onMounted(() => {

})
</script>
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
