export type SettingsType = {
    dashboard: DashboardType
    lists: ListsType
    dev: DevType
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