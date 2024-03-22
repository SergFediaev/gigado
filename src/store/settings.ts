import {KEYS} from '../strings/keys'
import {SettingsType} from './types/settingsTypes'
import {render} from '../index'

const defaultSettings: SettingsType = {
    lists: {
        showId: true,
        showInput: false,
        showTooltips: false,
    },
    dev: {
        mode: false,
        debug: false,
        logMainRender: false,
        logTasksRender: false,
        markup: false,
        errors: false,
        animate: true,
    },
} as const

const getLocalStorageSettings = (): SettingsType => {
    const settings = localStorage.getItem(KEYS.SETTINGS)
    return settings ? JSON.parse(settings) : defaultSettings
}

export const setLocalStorageSettings = (settings: SettingsType) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings))
    render(settings)
}

export const settings: SettingsType = getLocalStorageSettings()