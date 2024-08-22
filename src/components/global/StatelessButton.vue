<template>
  <div class="stateless-button-container">
    <div class="stateless-button" v-on:click="props.clickBehavior">
      <div class="button-inner">
        <FontAwesomeIcon v-if="props.icon" :icon="props.icon"/>
        <span class="button-title">{{ props.title }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const props = defineProps<{
  icon?: Array<string>,
  title: string,
  clickBehavior: (event: MouseEvent) => void
}>();
</script>
<style scoped lang="scss">
@import "@assets/main";

.stateless-button-container {
  padding: 5px;
  width: 100%;

  .stateless-button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3px 5px;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    transition: $duration;


    .button-inner {
      transition: $duration;
      color: black;

    }

    &:active {
      transform: scale(.9);
    }
  }
}

@media (prefers-color-scheme: dark) {
  .stateless-button-container {

    .stateless-button {

      .button-inner {
        color: $standard-light-gray-in-white;
      }
    }
  }
}
</style>
