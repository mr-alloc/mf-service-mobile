import {defineStore} from "pinia";
import {reactive} from "vue";

export const useNavigateMenuStore = defineStore("leftMenu", () => {
    const state = reactive({
        activeHomeMenu: false,
        activeCalendarMenu: false,
        activeDiscussMenu: false,
        activeFamiliesMenu: false,
        activeSettingsMenu: false
    });
    function refreshAllActivated() {
        state.activeHomeMenu = false;
        state.activeCalendarMenu = false;
        state.activeDiscussMenu = false
        state.activeFamiliesMenu = false;
        state.activeSettingsMenu = false
    }

    return {
        state,
        refreshAllActivated

    }
})
