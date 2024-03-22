export type SettingsType = {
    lists: ListsType
    dev: DevType
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