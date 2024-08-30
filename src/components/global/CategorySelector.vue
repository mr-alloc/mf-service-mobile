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
          <li class="category-item" v-for="category in scheduleCategoryStore.categories"
              :key="category.id" v-on:click="() => methods.selectCategory(category as ScheduleCategory)">
            <div class="color-frame">
              <span class="color-preview" :style="{ backgroundColor: `#${category.color}`}"></span>
            </div>
            <div class="category-name">{{ category.name }}</div>
          </li>
        </ul>
      </Transition>
    </div>
    <SimpleIconButton button-name="생성" :icon="['fas', 'tag']" :click-behavior="scheduleCategoryStore.createCategory" />
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
import { useScheduleCategoryStore } from '@/stores/ScheduleCategoryStore'
import SelectImageOption from '@/classes/api-spec/SelectImageOption'

const scheduleCategoryStore = useScheduleCategoryStore()
const methods = {
  selectCategory(category: ScheduleCategory) {
    state.isSelectMode = false

    const afterChange = () => {
      //동일한 값 선택
      if (category.id === state.selected.id) return
      state.selected = category
    }

    if (props.beforeChange) {
      props.beforeChange(category, afterChange)
    } else {
      afterChange()
    }
  }
}
const props = defineProps<{
  defaultId?: number,
  beforeChange?: (category: ScheduleCategory, afterChange: () => void) => void
}>()
const defaultValue = ScheduleCategory.fromJson({ categoryId: 0, name: '카테고리 선택', color: '' })
const state = reactive({
  selected: defaultValue,
  isSelectMode: false,
  isModifyMode: false
})
defineExpose({
  getCategoryId: () => state.selected.id
});
onMounted(() => {
  if (props.defaultId) {
    state.selected = scheduleCategoryStore.categories.find(cat => cat.id === props.defaultId) ?? defaultValue
  }
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
      border: 1px solid $standard-light-gray-in-white;
      background-color: white;
      border-radius: 10px;
      justify-content: center;
      align-items: center;
      padding: 0 8px;

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
      width: max-content;
      background-color: white;
      border: 1px solid $standard-light-gray-in-white;
      border-radius: 10px;
      justify-content: center;
      align-items: flex-start;
      top: 35px;
      flex-direction: column;
      padding: 0;

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

@media (prefers-color-scheme: dark) {
  .category-selector-container {
    .inner-selector-wrapper {
      .current-selected {

        border: 1px solid $dark-mode-border;
        background-color: $dark-mode-background;
      }


      .schedule-category-group {

        border: 1px solid $dark-mode-border;
        background-color: $dark-mode-panel;
      }
    }
  }
}
</style>
