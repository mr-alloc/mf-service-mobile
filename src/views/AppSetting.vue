<template>
  <div class="app-setting-container">
    <div class="container-title">앱 설정</div>
    <ul class="convenience-group">
      <li class="group-item">
        <div class="item-title">기본 일정</div>
        <div class="item-feature">
          <PreferFamilySelector :refresh-function="methods.changePreferFamily"
                                :selected-family="state.mainFamily" />
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">

import { onMounted, reactive } from 'vue'
import PreferFamilySelector from '@/components/global/PreferFamilySelector.vue'
import { FamilySummary } from '@/classes/api-spec/family/GetOwnFamilies'
import LocalAsset from '@/constant/LocalAsset'
import * as GetUserSetting from '@/classes/api-spec/member/GetUserSetting'
import * as ChangeMainFamilySetting from '@/classes/api-spec/member/ChangeMainFamilySetting'
import { call } from '@/utils/NetworkUtil'
import Member from '@/constant/api-meta/Member'
import { useOwnFamiliesStore } from '@/stores/OwnFamiliesStore'
import PopupUtil from '@/utils/PopupUtil'


const ownFamiliesStore = useOwnFamiliesStore()
const methods = {
  changePreferFamily(familyId: number) {
    const toBeMain = familyId !== 0
      ? ownFamiliesStore.families.find(family => family.id === familyId)
      : defaultFamily
    if (!toBeMain) {
      PopupUtil.alert('기본 일정 변경실패', '소속된 패밀리가 아닙니다.')
      return
    }

    PopupUtil.confirm('기본 일정 변경', `기본 일정을 "${toBeMain.name}"(으)로 변경 할까요?`, () => {
      const requestBody = new ChangeMainFamilySetting.RequestBody(familyId)
      call<ChangeMainFamilySetting.RequestBody, ChangeMainFamilySetting.ResponseBody>(Member.ChangeMainFamilySetting, requestBody, (response) => {
        state.mainFamily = toBeMain
      })
    })
  }
}
const defaultFamily = new FamilySummary(0, '', LocalAsset.DEFAULT_NO_IMAGE, '개인 일정', '', 0)
const state = reactive({
  mainFamily: defaultFamily
})
onMounted(() => {
  call<any, GetUserSetting.ResponseBody>(Member.GetUserSetting, null, (response) => {
    const responseBody = GetUserSetting.ResponseBody.fromJson(response.data)
    state.mainFamily = ownFamiliesStore.families.find(family => family.id === responseBody.mainFamily) ?? defaultFamily
  })
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
