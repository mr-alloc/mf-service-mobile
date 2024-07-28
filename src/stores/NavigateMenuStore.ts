import {defineStore} from "pinia";
import {reactive} from "vue";

export const useNavigateMenuStore = defineStore("leftMenu", () => {
    const state = reactive({
        activeHomeMenu: false,
        activeCalendarMenu: false,
        activeFamiliesMenu: false,
    });
    function refreshAllActivated() {
        state.activeHomeMenu = false;
        state.activeCalendarMenu = false;
        state.activeFamiliesMenu = false;
    }

    return {
        state,
        refreshAllActivated

    }
})
