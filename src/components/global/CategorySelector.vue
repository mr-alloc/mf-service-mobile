<template>
  <div class="category-selector-container">
    <div class="inner-selector-wrapper">
      <div class="current-selected" v-on:click="() => state.isSelectMode = !state.isSelectMode">
        <div class="default-selected-option" v-if="state.selected.id === 0">{{ defaultValue.name }}</div>
        <div v-else class="selected-option">
          <div class="color-frame">
            <span class="color-preview" :style="{ backgroundColor: `#${state.selected.color}`}"></span>
          </div>
          <div class="category-name">{{ state.selected.name }}</div>
        </div>
      </div>
      <Transition name="down-fade">
        <ul class="schedule-category-group" v-show="state.isSelectMode">
          <li class="category-item" v-on:click="() => methods.selectCategory(defaultValue)">
            <div class="category-name">{{ defaultValue.name }}</div>
          </li>
          <li class="category-item" v-for="category in state.categories"
              :key="category.id" v-on:click="() => methods.selectCategory(category as ScheduleCategory)">
            <div class="color-frame">
              <span class="color-preview" :style="{ backgroundColor: `#${category.color}`}"></span>
            </div>
            <div class="category-name">{{ category.name }}</div>
          </li>
        </ul>
      </Transition>
    </div>
    <SimpleIconButton button-name="생성" :icon="['fas', 'tag']" :click-behavior="methods.createCategory" />
  </div>
</template>
<script setup lang="ts">
import SimpleIconButton from '@/components/global/SimpleIconButton.vue'
import { useThrottleFn } from '@vueuse/core'
import NavigateComponent from '@/classes/NavigateComponent'
import { useNavigateStackStore } from '@/stores/NavigateStackStore'
import { onMounted, reactive } from 'vue'
import { call } from '@/utils/NetworkUtil'
import { ResponseBody } from '@/classes/api-spec/schedule/GetScheduleCategories'
import Schedule from '@/constant/api-meta/Schedule'
import ScheduleCategory from '@/classes/ScheduleCategory'

const navigateStackStore = useNavigateStackStore()
const methods = {
  createCategory: useThrottleFn(() => {
    const component = new NavigateComponent('카테고리 생성', 'CreateCategory', {})
    navigateStackStore.stackComponent(component)
  }, 2000),
  selectCategory(category: ScheduleCategory) {
    state.selected = category
    state.isSelectMode = false
  }
}
const defaultValue = ScheduleCategory.fromJson({ categoryId: 0, name: '카테고리 선택', color: '' })
const state = reactive({
  selected: defaultValue,
  categories: new Array<ScheduleCategory>(),
  isSelectMode: false
})
defineExpose({
  getCategoryId: () => state.selected.id
})
onMounted(() => {
  call<any, ResponseBody>(Schedule.GetCategories, null, (respose) => {
    const responseBody = ResponseBody.fromJson(respose.data)
    state.categories = responseBody.categories
  })
})
</script>
<style scoped lang="scss">
@import "@assets/main";

.category-selector-container {
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  .inner-selector-wrapper {
    flex-grow: 1;
    position: relative;

    .current-selected {
      display: flex;
      width: 100%;
      border: 1px solid $dark-mode-border;
      background-color: $dark-mode-panel;
      border-radius: 10px;
      justify-content: center;
      align-items: center;

      .selected-option {
        padding: 2px 8px;
        display: flex;
        flex-direction: row;
        align-items: center;

        .color-frame {
          width: 1.2rem;
          height: 1.2rem;
          overflow: hidden;
          border-radius: 5px;

          .color-preview {
            display: inline-block;
            width: 100%;
            height: 100%;
          }
        }

        .category-name {
          padding: 0 8px;
        }
      }
    }

    .schedule-category-group {
      position: absolute;
      z-index: 1;
      display: flex;
      width: 100%;
      border: 1px solid $dark-mode-border;
      background-color: $dark-mode-panel;
      border-radius: 10px;
      justify-content: center;
      align-items: center;
      top: 35px;
      flex-direction: column;

      .category-item {
        width: max-content;
        padding: 2px 8px;
        display: flex;
        flex-direction: row;
        align-items: center;

        .color-frame {
          width: 1.2rem;
          height: 1.2rem;
          overflow: hidden;
          border-radius: 5px;

          .color-preview {
            display: inline-block;
            width: 100%;
            height: 100%;
          }
        }

        .category-name {
          flex-grow: 1;
          padding: 0 8px;
        }
      }
    }
  }
}
</style>
