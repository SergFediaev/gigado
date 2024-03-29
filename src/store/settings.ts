import {KEYS} from '../strings/keys'
import {SettingsType} from './types/settingsTypes'
import {render} from '../index'
import {STRINGS, VIDEO_BACKGROUNDS} from '../strings/strings'
import {OptionType} from '../components/select/Select'

const defaultSettings: SettingsType = {
    app: {
        background: STRINGS.VIDEO,
        overlay: false,
        videoBackground: VIDEO_BACKGROUNDS.OCEAN,
        backgroundSound: false,
    },
    dashboard: {
        showStats: true,
    },
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

export const backgroundOptions: OptionType[] = [
    {name: STRINGS.COLOR},
    {name: STRINGS.WALLPAPER},
    {name: STRINGS.RANDOM_WALLPAPER},
    {name: STRINGS.VIDEO},
]

export const videoBackgroundOptions: OptionType[] = [
    {name: VIDEO_BACKGROUNDS.BEACH},
    {name: VIDEO_BACKGROUNDS.OCEAN},
    {name: VIDEO_BACKGROUNDS.FIREPLACE},
    {name: VIDEO_BACKGROUNDS.ANIME1},
    {name: VIDEO_BACKGROUNDS.ANIME2},
    {name: VIDEO_BACKGROUNDS.ANIME3},
    {name: VIDEO_BACKGROUNDS.ANIME4},
]