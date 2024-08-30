<template>
  <div class="container-wrapper">
    <MainHeader/>
    <div class="container">
      <RouterView v-slot="{ Component }">
        <Transition name="fade">
          <Component :is="Component"/>
        </Transition>
      </RouterView>
    </div>
    <GlobalNavigationBar />
    <NavigatorStack />
    <div class="background"
         :class="[{ curtain: backgroundStore.needCurtainManager }, { popup: backgroundStore.needBackground || backgroundStore.needPopup}]"
         v-show="backgroundStore.needBackground">
      <NicknameInitializer v-show="backgroundStore.needNicknameInitializer"/>
      <GlobalPopup/>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
import MainHeader from '@/views/global/MainHeader.vue';
import GlobalNavigationBar from '@/views/global/GlobalNavigationBar.vue';
import { useBackgroundStore } from '@/stores/BackgroundStore'
import NicknameInitializer from '@/components/global/NicknameInitializer.vue'
import GlobalPopup from '@/components/global/GlobalPopup.vue'
import NavigatorStack from '@/views/global/NavigatorStack.vue'
import { onMounted } from 'vue'
import { useScheduleCategoryStore } from '@/stores/ScheduleCategoryStore'

const backgroundStore = useBackgroundStore();
</script>
<style scoped lang="scss">
@import '@assets/main';

.container-wrapper {
  position: relative;
  background: white;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  max-width: 32rem;

  .container {
    height: calc(100% - 120px);
    overflow-y: scroll;
  }

  .background {
    z-index: 4;

    &.curtain {
      position: absolute;
      background: rgba(0, 0, 0, .5);
      width: 100%;
      height: 100%;
      backdrop-filter: blur(2px);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &.popup {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

@media (prefers-color-scheme: dark) {
  .container-wrapper {
    background-color: $dark-mode-background;
  }
}
</style>
