<template>
  <div class="simple-icon-button-container">
    <button class="icon-button" v-on:click="methods.clickButton" type="button">
      <FontAwesomeIcon :icon="props.icon" />
      <span class="name-text">{{ props.buttonName }}</span>
    </button>
  </div>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps<{
  clickBehavior: (event: MouseEvent) => void,
  icon: Array<string>,
  buttonName: string
}>()
const methods = {
  clickButton(event: MouseEvent) {
    event.stopPropagation()
    props.clickBehavior && props.clickBehavior(event)
  }
}
</script>
<style scoped lang="scss">
@import '@assets/main';

.simple-icon-button-container {
  padding: 0 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .icon-button {
    padding: 3px 5px;
    color: $signature-purple;
    border-radius: 5px;
    border: 1px solid $little-light-signature-purple;

    .name-text {
      padding: 3px 5px;
      font-weight: bold;
      font-size: .84rem;
    }
  }
}
</style>
