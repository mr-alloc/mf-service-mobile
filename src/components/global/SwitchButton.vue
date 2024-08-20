<template>
  <div class="classic-switch" :class="{ active: state.isTurnOn }" v-on:mouseup="methods.reflect()">
    <span class="switch-ball"></span>
  </div>
</template>

<script lang="ts" setup>

import { reactive } from 'vue'

const props = defineProps<{
  switch: () => boolean,
  default: boolean
}>()

const state = reactive({
  isTurnOn: props.default
})

const methods = {
  reflect() {
    state.isTurnOn = props.switch && props.switch()
  }
}
</script>

<style lang="scss">
@import '@assets/main';

.classic-switch {
  width: 40px;
  height: 23px;
  background-color: $standard-light-gray-in-white;
  border-radius: 15px;
  padding: 2px;
  transition: $duration;

  .switch-ball {
    width: 21px;
    height: 100%;
    background-color: white;
    display: inline-block;
    border-radius: 15px;
    box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.1);
    transition: $duration;
  }

  &:active {

    .switch-ball {
      width: 25px;
    }
  }


  &.active {
    background-color: #4ED164;

    .switch-ball {
      margin-left: 14px;
    }

    &:active {

      .switch-ball {
        margin-left: 10px;
      }
    }
  }
}

@media (prefers-color-scheme: dark) {
  .classic-switch {
    background-color: $dark-mode-panel;

    .switch-ball {
      background-color: $dark-mode-edge;
    }
  }
}
</style>
