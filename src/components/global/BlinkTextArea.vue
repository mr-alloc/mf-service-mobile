<script setup lang="ts">

import {reactive, ref} from "vue";

const textarea = ref<HTMLTextAreaElement | null>(null);
const props = defineProps<{
  label?: string,
  id?: string,
  name?: string,
  placeHolder: string,
  isHold?: boolean,
  defaultValue?: string,
  onInput: () => void,
  isFixSize?: boolean
}>()

const state = reactive({
  value: props.defaultValue ?? ""
});
defineExpose({
  getValue: () => state.value,
  getInput: () => textarea.value
});
</script>

<template>
  <div class="blink-textarea-container">
    <label v-if="props.label" :for="props.id">{{ props.label }}</label>
    <div class="text-area-wrapper">
      <textarea class="blink-input" ref="textarea" :id="props.id" :name="props.name" :placeholder="props.placeHolder"
                v-on:input="props.onInput" v-model="state.value"
                :class="{ hold: props.isHold, 'fix-size': props.isFixSize }"></textarea>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "@assets/main";

.blink-textarea-container {
  padding: 5px 8px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .text-area-wrapper {
    height: 100%;
    display: flex;
    align-items: center;

    textarea {
      width: 100%;
      padding: 5px 8px;
      border: 1px solid #ccc;
      outline: none !important;
      border-radius: 4px;
      font-size: .92rem;
      resize: vertical;
      background-color: white;
    }

    .fix-size {
      resize: none;
    }
  }
}

@media (prefers-color-scheme: dark) {
  .blink-textarea-container {
    .text-area-wrapper {
      textarea {
        background-color: $dark-mode-panel;
        color: $standard-gray-in-white;
      }
    }
  }
}
</style>
