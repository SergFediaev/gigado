import {SettingsType} from '../types/settingsTypes'
import {SettingsActionType} from '../types/settingsActionTypes'
import {SETTINGS_ACTIONS} from '../../strings/actions'
import {ERRORS} from '../../strings/errors'

export const settingsReducer = (settings: SettingsType, action: SettingsActionType): SettingsType => {
    const {type, payload} = action
    switch (type) {

        case SETTINGS_ACTIONS.SET_SHOW_LIST_ID:
            return {...settings, lists: {...settings.lists, showId: payload.isEnabled}} as SettingsType

        case SETTINGS_ACTIONS.SET_SHOW_LIST_INPUT:
            return {...settings, lists: {...settings.lists, showInput: payload.isEnabled}} as SettingsType

        case SETTINGS_ACTIONS.SET_SHOW_LIST_TOOLTIPS:
            return {...settings, lists: {...settings.lists, showTooltips: payload.isEnabled}} as SettingsType

        case SETTINGS_ACTIONS.SET_DEV_MODE:
            return {...settings, dev: {...settings.dev, mode: payload.isEnabled}} as SettingsType

        case SETTINGS_ACTIONS.SET_MARKUP:
            return {...settings, dev: {...settings.dev, markup: payload.isEnabled}} as SettingsType

        case SETTINGS_ACTIONS.SET_MAIN_RENDERING:
            return {...settings, dev: {...settings.dev, logMainRender: payload.isEnabled}} as SettingsType

        case SETTINGS_ACTIONS.SET_TASKS_RENDERING:
            return {...settings, dev: {...settings.dev, logTasksRender: payload.isEnabled}} as SettingsType

        case SETTINGS_ACTIONS.SET_ANIMATE:
            return {...settings, dev: {...settings.dev, animate: payload.isEnabled}}

        default: {
            if (settings.dev.errors) throw new Error(ERRORS.INVALID_ACTION_TYPE)
            else return settings
        }
    }
}