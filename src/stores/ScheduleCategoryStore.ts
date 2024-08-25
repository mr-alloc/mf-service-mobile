import { defineStore } from 'pinia'
import type ScheduleCategory from '@/classes/ScheduleCategory'
import { ref } from 'vue'
import { call } from '@/utils/NetworkUtil'
import { ResponseBody } from '@/classes/api-spec/schedule/GetScheduleCategories'
import Schedule from '@/constant/api-meta/Schedule'
import { useThrottleFn } from '@vueuse/core'
import NavigateComponent from '@/classes/NavigateComponent'
import { useNavigateStackStore } from '@/stores/NavigateStackStore'
import CollectionUtil from '@/utils/CollectionUtil'

export const useScheduleCategoryStore = defineStore('scheduleCategory', () => {

    const categories = ref<Array<ScheduleCategory>>([])
    const categoryColors = ref<Map<number, ScheduleCategory>>(new Map())

    async function fetchScheduleCategories() {
        await call<any, ResponseBody>(Schedule.GetCategories, null, (respose) => {
            const responseBody = ResponseBody.fromJson(respose.data)
            categories.value = responseBody.categories
            categoryColors.value = CollectionUtil.toMap(
                responseBody.categories,
                (category) => category.id
            )
        })
    }

    const createCategory = useThrottleFn(async () => {
        const navigateStackStore = useNavigateStackStore()
        const component = new NavigateComponent('카테고리 생성', 'CreateCategory', {})
        navigateStackStore.stackComponent(component)
    }, 2000)


    return {
        categories,
        categoryColors,
        fetchScheduleCategories,
        createCategory

    }
})
