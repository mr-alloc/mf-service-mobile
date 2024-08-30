<template>
  <div class="navigator-stack-container" :class="{ active: navigateStackStore.stack.length > 0 }">
    <TransitionGroup class="stack-element-group" tag="ul" name="up-fade">
      <li class="each-stack" :key="index" v-show="component.visible"
          v-for="(component, index) in navigateStackStore.stack">
        <div class="panel-header">
          <div class="page-title-area">
            <span class="title-text">{{ component.title }}</span>
          </div>
        </div>
        <div class="panel-body">
          <Component :is="component.name" v-bind="component.props"/>
        </div>
        <div class="panel-footer">
          <SimpleIconButton button-name="닫기" :click-behavior="navigateStackStore.pullComponent"
                            :icon="['far', 'circle-xmark']" />
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>
<script setup lang="ts">

import { useNavigateStackStore } from '@/stores/NavigateStackStore'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import SimpleIconButton from '@/components/global/SimpleIconButton.vue'

const navigateStackStore = useNavigateStackStore()
</script>
<style scoped lang="scss">
@import "@assets/main";

.navigator-stack-container {
  z-index: -1;
  background-color: rgb(0, 0, 0, .3);
  position: absolute;
  width: 100%;
  height: 100%;;

  &.active {
    backdrop-filter: blur(2px);
    z-index: 2;
  }

  .stack-element-group {
    height: 100%;
    width: 100%;
    position: relative;
    list-style: none;
    padding: 0;

    .each-stack {
      background-color: white;
      height: 100%;
      width: 100%;
      position: absolute;
      display: flex;
      flex-direction: column;

      .panel-header {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 50px;
        flex-shrink: 0;
        position: relative;

        .back-icon-area {
          position: absolute;
          width: 65px;
          height: 100%;
          padding: 5px 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
        }

        .page-title-area {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;

          .title-text {
            font-weight: bold;
            font-size: 1.5rem;
          }
        }
      }

      .panel-body {
        overflow-y: scroll;
        flex-grow: 1;
      }

      .panel-footer {
        height: 80px;
        flex-shrink: 0;
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        padding: 10px 0;

      }
    }
  }
}

@media (prefers-color-scheme: dark) {
  .navigator-stack-container {
    .stack-element-group {

      .each-stack {
        background-color: $dark-mode-background;
      }
    }
  }
}
</style>
