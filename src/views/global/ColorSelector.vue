<template>
  <div class="color-selector-container">
    <ul class="color-group">
      <li class="pallet-color-wrapper" :class="{ selected: state.selectedColor === color }"
          v-for="color in colors" :key="color" v-on:click="() => methods.selectColor(color)">
        <span class="sample-color" :style="{
          backgroundColor: `#${color}`
        }"></span>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">

import { reactive } from 'vue'

const colors: string[] = [
  // 웜톤
  'F4A460', 'E67E22', 'D35400', 'F093BB', 'E55934',
  'FFC300', 'D4AC08', 'B26600', 'FFD700', 'FFA500',

  // 쿨톤
  '567DB4', '2196F3', '03A9F4', '00BCD4', '009688',
  '4CAF50', '8BC34A', '673AB7', '9C27B0', '1E90FF',

  // 중성톤
  '9E9E9E', '757575', 'BDBDBD', 'F5F5F5', 'EEEEEE',
  '333333', 'FFFFFF', 'A9A9A9', '808080', 'C0C0C0',

  // 어두운 톤
  '263238', '37474F', '455A64', '1B2631', '000000',
  '303030', '2F2F2F', '282828', '222222', '1C1C1C',

  // 밝은 톤
  'FFEB3B', 'FF9800', 'FF5722', 'FFC107', 'FF9800',
  'FFFF00', 'FFFFE0', 'FFFFCC', 'FFFFB2', 'FFFF99',

  // 추가된 색상 (다양한 계열 추가)
  'FF6347', 'FF1493', 'DC143C', '00FFFF', '00CED1',
  '9400D3', 'DA70D6', '8B4513', 'BA55D3', 'A020F0'
]
const state = reactive({
  selectedColor: ''
})
const props = defineProps<{
  selectColor: (color: string) => void
}>()
const methods = {
  selectColor(color: string) {
    state.selectedColor = color
    props.selectColor(color)
  }
}
</script>
<style scoped lang="scss">
@import '@assets/main';

.color-selector-container {
  width: 100%;
  padding: 10px 0;

  .color-group {
    display: flex;
    flex-wrap: wrap;
    height: 200px;
    list-style: none;
    padding: 0;

    .pallet-color-wrapper {
      flex: 1 1 10%;
      position: relative;

      .sample-color {
        display: flex;
        width: 100%;
        height: 100%;
      }


      &.selected {

        &:before {
          background-color: rgb(0, 0, 0, .25);
          content: "선택";
          position: absolute;
          font-size: .72rem;
          font-weight: bold;
          color: white;
          width: 100%;
          height: 100%;
          line-height: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>
