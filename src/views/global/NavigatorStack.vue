<template>
  <div class="navigator-stack-container" :class="{ active: navigateStackStore.stack.length > 0 }">
    <TransitionGroup class="stack-element-group" tag="ul" name="up-fade">
      <li class="each-stack" :key="index" v-for="(component, index) in navigateStackStore.stack">
        <div class="panel-header">
          <div class="back-icon-area" v-on:click="navigateStackStore.pullComponent">
             <FontAwesomeIcon class="fa-2xl" :icon="['fas', 'chevron-left']" />
          </div>
          <div class="page-title-area">
            <span class="title-text">{{ component.title }}</span>
          </div>
        </div>
        <div class="panel-body">
          <Component :is="component.name" v-bind="component.props"/>
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>
<script setup lang="ts">

import { useNavigateStackStore } from '@/stores/NavigateStackStore'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const navigateStackStore = useNavigateStackStore()
</script>
<style scoped lang="scss">
@import "@assets/main";

.navigator-stack-container {
  z-index: 2;
  background-color: rgb(0, 0, 0, .3);

  &.active {
    backdrop-filter: blur(2px);
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .stack-element-group {
    padding: 20px 3px 0;
    height: 100%;
    width: 100%;

    .each-stack {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      background-color: white;
      height: 100%;

      .panel-header {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 50px;
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

      }
    }
  }
}
</style>
