import { defineStore } from 'pinia'
import { ref } from 'vue'
import NavigateComponent from '@/classes/NavigateComponent'

export const useNavigateStackStore = defineStore('navigatorStack', () => {

    const stack = ref<Array<NavigateComponent>>(new Array<NavigateComponent>());

    function stackComponent(component: NavigateComponent) {
        stack.value.push(component);
    }

    function pullComponent() {
        stack.value.pop();
    }

    return {
        stack,
        stackComponent,
        pullComponent
    }
});
