import {
    setAnimate,
    setBackground,
    setBackgroundSound,
    setDevMode,
    setLogMainRender,
    setLogTasksRender,
    setMarkup,
    setOverlay,
    setShowListId,
    setShowListInput,
    setShowListTooltips,
    setShowStats,
    setVideoBackground,
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
    | SetBackgroundType
    | SetOverlayType
    | SetBackgroundSoundType
    | SetVideoBackgroundType

type SetBackgroundType = ReturnType<typeof setBackground>

type SetOverlayType = ReturnType<typeof setOverlay>

type SetBackgroundSoundType = ReturnType<typeof setBackgroundSound>

type SetVideoBackgroundType = ReturnType<typeof setVideoBackground>

type SetShowStatsType = ReturnType<typeof setShowStats>

type SetShowListIdType = ReturnType<typeof setShowListId>

type SetShowListInputType = ReturnType<typeof setShowListInput>

type SetShowListTooltipsType = ReturnType<typeof setShowListTooltips>

type SetDevModeType = ReturnType<typeof setDevMode>

type SetMarkupType = ReturnType<typeof setMarkup>

type SetLogMainRenderType = ReturnType<typeof setLogMainRender>

type SetLogTasksRenderType = ReturnType<typeof setLogTasksRender>

type SetAnimateType = ReturnType<typeof setAnimate>