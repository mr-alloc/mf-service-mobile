<template>
  <div class="create-category-container">
    <div class="create-input-form">
      <BlinkInput ref="nameInput" id="category-name" type="text" label="카테고리명"
                  :placeHolder="defaultValues.name"
                  :is-hold="state.inputHold" :validate="methods.validateName"
                  warning-message="카테고리 이름을 입력해 주세요." :no-mark="true"
      />
      <div class="for-example-color">
        <span class="sample-schedule" :style="{
          backgroundColor: `#${state.selectedColor}`,
          color: methods.isDarkColor(state.selectedColor) ? 'white' : 'black'
        }">🚨10시 유산소 운동🚨</span>
      </div>
      <ColorSelector :select-color="methods.whenSelectedColor" />

    </div>
    <div class="control-panel">
      <div class="control-button" v-on:click="methods.createCategory">
        <span class="button-text">생성</span>
      </div>
      <div class="control-button" v-on:click="() => navigateStackStore.pullComponent()">
        <span class="button-text">취소</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import BlinkInput from '@/components/global/BlinkInput.vue'
import { reactive, ref } from 'vue'
import { useNavigateStackStore } from '@/stores/NavigateStackStore'
import type InputComponent from '@/classes/InputComponent'
import { ex } from '@/utils/Undefinable'
import ColorSelector from '@/views/global/ColorSelector.vue'
import { useAlertStore } from '@/stores/AlertStore'

const navigateStackStore = useNavigateStackStore()
const defaultValues = {
  name: '아르바이트'
}
const nameInput = ref<InputComponent | null>(null)
const inputValues = reactive({
  name: ''
})
const state = reactive({
  inputHold: false,
  isSubmittable: false,

  isValidName: false,
  selectedColor: ''
})

const methods = {
  validateName() {
    inputValues.name = ex(nameInput.value)
      .to<InputComponent, string>(value => value.input.value, '')
    state.isValidName = 0 < inputValues.name.length && inputValues.name.length <= 50
    if (!state.isValidName) {
      nameInput.value?.input.focus()
    }
    return state.isValidName
  },
  createCategory() {
    useAlertStore().info('쉿! 준비중!', '(속삭이며) 조금만 더 기다려 주세요..')
  },
  whenSelectedColor(color: string) {
    state.selectedColor = color
  },
  isDarkColor(hexColor: string) {
    // hex 코드를 RGB 값으로 변환
    const rgb = this.hexToRgb(hexColor)

    // 밝기 계산
    const brightness = (rgb.r + rgb.g + rgb.b) / 3

    // 밝기 기준 값 설정 (예: 128)
    const threshold = 128

    // 밝기가 기준 값 미만이면 어두운 색으로 판단
    return brightness < threshold
  },
  hexToRgb(hex: string) {
    // hex 코드에서 '#' 제거
    hex = hex.replace('#', '')

    // 16진수 숫자를 두 자리씩 잘라서 배열에 저장
    const bigint = parseInt(hex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255

    // RGB 객체 생성
    return { r, g, b }
  }
}
</script>
<style scoped lang="scss">
@import '@assets/main';

.create-category-container {

  .create-input-form {

    .for-example-color {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;

      .sample-schedule {
        border-radius: 5px;
      }
    }
  }

  padding: 0 20px;

  .control-panel {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;

    .control-button {
      transition: $duration;
      border-radius: 5px;
      padding: 5px 10px;
      user-select: none;

      .button-text {
        padding: 0;
      }

    }
  }
}
</style>
