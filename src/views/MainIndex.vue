<template>
  <div class="main-index-container">
    <TransitionGroup name="down-fade" tag="ul" class="coming-mission-group">
      <li class="each-mission">

      </li>
    </TransitionGroup>
  </div>
</template>
<script setup lang="ts">
import {useAlertStore} from "@/stores/AlertStore";
import {useMemberInfoStore} from "@/stores/MemberInfoStore";
import {AccountRole} from "@/constant/AccountRole";
import {useRouter} from "vue-router";

const memberInfoStore = useMemberInfoStore();
const alertStore = useAlertStore();
const router = useRouter();
</script>
<style scoped lang="scss">
@import "@assets/main";

.main-index-container {
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
