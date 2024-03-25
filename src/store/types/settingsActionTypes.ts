import {
    setAnimate,
    setDevMode,
    setLogMainRender,
    setLogTasksRender,
    setMarkup,
    setShowListId,
    setShowListInput,
    setShowListTooltips,
    setShowStats,
} from '../actions/settingsActions'

export type SettingsActionType =
    SetDevModeType
    | SetMarkupType
    | SetLogMainRenderType
    | SetLogTasksRenderType
    | SetShowListIdType
    | SetShowListInputType
    | SetShowListTooltipsType
    | SetAnimateType
    | SetShowStatsType

type SetShowStatsType = ReturnType<typeof setShowStats>

type SetShowListIdType = ReturnType<typeof setShowListId>

type SetShowListInputType = ReturnType<typeof setShowListInput>

type SetShowListTooltipsType = ReturnType<typeof setShowListTooltips>

type SetDevModeType = ReturnType<typeof setDevMode>

type SetMarkupType = ReturnType<typeof setMarkup>

type SetLogMainRenderType = ReturnType<typeof setLogMainRender>

type SetLogTasksRenderType = ReturnType<typeof setLogTasksRender>

type SetAnimateType = ReturnType<typeof setAnimate>