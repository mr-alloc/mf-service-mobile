<template>
  <div class="refresh-token-container">
    <FontAwesomeIcon class="fa-3x" :icon="faSpinner" spin/>
  </div>
</template>
<script setup lang="ts">
import { inject, onMounted } from 'vue'
import {refreshToken} from "@/utils/LocalCache";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import { call } from '@/utils/NetworkUtil'
import { ResponseBody } from '@/classes/api-spec/member/GetUserSetting'
import Member from '@/constant/api-meta/Member'
import type SelectFamilyOption from '@/classes/SelectFamilyOption'
import { useOwnFamiliesStore } from '@/stores/OwnFamiliesStore'
import { useRouter } from 'vue-router'

const emitter: any = inject('emitter')
const router = useRouter()
const ownFamiliesStore = useOwnFamiliesStore()
onMounted(async () => {
  await refreshToken()
});
</script>
<style scoped lang="scss">
.refresh-token-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
