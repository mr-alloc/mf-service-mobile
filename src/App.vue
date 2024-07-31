<script setup lang="ts">
import { RouterView } from 'vue-router';
import MainHeader from '@/views/global/MainHeader.vue';
import GlobalNavigationBar from '@/views/global/GlobalNavigationBar.vue';
</script>

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
<!--    <div class="background"-->
<!--         :class="[{ curtain: backgroundStore.needCurtainManager }, { popup: backgroundStore.needBackground || backgroundStore.needPopup}]"-->
<!--         v-show="backgroundStore.needBackground" v-on:click="methods.clickBackground">-->
<!--      <InitNickname v-show="backgroundStore.needNicknameInitializer"/>-->
<!--      <LoadingSpinner v-show="backgroundStore.needCurtainManager" :title="backgroundStore.loadingInfo.title"-->
<!--                      :content="backgroundStore.loadingInfo.content"/>-->
<!--      <GlobalPopup/>-->
<!--    </div>-->
  </div>
</template>
<style scoped lang="scss">
@import '@assets/main';

.container-wrapper {
  background: white;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  max-width: 32rem;

  .container {
    height: calc(100% - 120px);
  }

  .background {
    z-index: 1;

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
</style>
