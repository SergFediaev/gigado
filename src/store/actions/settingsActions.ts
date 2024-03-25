import {SETTINGS_ACTIONS} from '../../strings/actions'

export const setShowStats = (isEnabled: boolean) => ({
    type: SETTINGS_ACTIONS.SET_SHOW_STATS,
    payload: {
        isEnabled,
    },
} as const)

export const setShowListId = (isEnabled: boolean) => ({
    type: SETTINGS_ACTIONS.SET_SHOW_LIST_ID,
    payload: {
        isEnabled,
    },
} as const)

export const setShowListInput = (isEnabled: boolean) => ({
    type: SETTINGS_ACTIONS.SET_SHOW_LIST_INPUT,
    payload: {
        isEnabled,
    },
} as const)

export const setShowListTooltips = (isEnabled: boolean) => ({
    type: SETTINGS_ACTIONS.SET_SHOW_LIST_TOOLTIPS,
    payload: {
        isEnabled,
    },
} as const)

export const setDevMode = (isEnabled: boolean) => ({
    type: SETTINGS_ACTIONS.SET_DEV_MODE,
    payload: {
        isEnabled,
    },
} as const)

export const setMarkup = (isEnabled: boolean) => ({
    type: SETTINGS_ACTIONS.SET_MARKUP,
    payload: {
        isEnabled,
    },
} as const)

export const setLogMainRender = (isEnabled: boolean) => ({
    type: SETTINGS_ACTIONS.SET_MAIN_RENDERING,
    payload: {
        isEnabled,
    },
} as const)

export const setLogTasksRender = (isEnabled: boolean) => ({
    type: SETTINGS_ACTIONS.SET_TASKS_RENDERING,
    payload: {
        isEnabled,
    },
} as const)

export const setAnimate = (isEnabled: boolean) => ({
    type: SETTINGS_ACTIONS.SET_ANIMATE,
    payload: {
        isEnabled,
    },
} as const)