import { defineStore } from 'pinia'
import { ref } from 'vue'
import NavigateComponent from '@/classes/NavigateComponent'

export const useNavigateStackStore = defineStore('navigatorStack', () => {

    const stack = ref<Array<NavigateComponent>>(new Array<NavigateComponent>());

    function stackComponent(component: NavigateComponent) {
        stack.value.push(component);
    }

    function pullComponent() {
        const lastStack = stack.value[stack.value.length - 1]
        lastStack.notVisible()
        setTimeout(() => {
            stack.value.pop()
        }, 300)
    }

    return {
        stack,
        stackComponent,
        pullComponent
    }
});
