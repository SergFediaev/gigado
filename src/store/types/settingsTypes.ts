import {STRINGS, VIDEO_BACKGROUNDS} from '../../strings/strings'

export type SettingsType = {
    app: AppType
    dashboard: DashboardType
    lists: ListsType
    dev: DevType
}

export type AppType = {
    background: BackgroundOptionType
    overlay: boolean
    videoBackground: VideoBackgroundOptionType
    backgroundSound: boolean
}

type DashboardType = {
    showStats: boolean
}

type ListsType = {
    showId: boolean
    showInput: boolean
    showTooltips: boolean
}

type DevType = {
    mode: boolean,
    debug: boolean,
    logMainRender: boolean,
    logTasksRender: boolean,
    markup: boolean,
    errors: boolean,
    animate: boolean,
}

export type BackgroundOptionType =
    typeof STRINGS.COLOR
    | typeof STRINGS.WALLPAPER
    | typeof STRINGS.RANDOM_WALLPAPER
    | typeof STRINGS.VIDEO

export type VideoBackgroundOptionType =
    typeof VIDEO_BACKGROUNDS.BEACH
    | typeof VIDEO_BACKGROUNDS.OCEAN
    | typeof VIDEO_BACKGROUNDS.FIREPLACE
    | typeof VIDEO_BACKGROUNDS.ANIME1
    | typeof VIDEO_BACKGROUNDS.ANIME2
    | typeof VIDEO_BACKGROUNDS.ANIME3
    | typeof VIDEO_BACKGROUNDS.ANIME4