import {BackgroundOptionType, SettingsType, VideoBackgroundOptionType} from '../../store/types/settingsTypes'
import s from './Settings.module.css'
import React, {memo, useEffect, useReducer, useState} from 'react'
import {settingsReducer} from '../../store/reducers/settingsReducer'
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
} from '../../store/actions/settingsActions'
import {backgroundOptions, setLocalStorageSettings, videoBackgroundOptions} from '../../store/settings'
import {Button} from '../button/Button'
import {PATHS} from '../../strings/paths'
import {useNavigate} from 'react-router-dom'
import {LINKS, PROJECT, RENDERING, STRINGS} from '../../strings/strings'
import {SettingCheckbox} from './SettingCheckbox/SettingCheckbox'
import {SettingSection} from './SettingSection/SettingSection'
import {Select} from '../select/Select'
import {SettingSelect} from './SettingSelect/SettingSelect'
import {Background} from '../Background/Background'

type SettingsPropsType = {
    initialSettings: SettingsType
}

export const Settings = memo(({initialSettings}: SettingsPropsType) => {
    if (initialSettings.dev.logMainRender) console.log(RENDERING.SETTINGS)

    //region Local state.
    const [settings, dispatchSettings] = useReducer(settingsReducer, initialSettings)
    const [devModeCount, setDevModeCount] = useState<number>(0)
    useEffect(() => setLocalStorageSettings(settings), [settings])
    const navigate = useNavigate()
    //endregion

    //region App handlers.
    const setBackgroundHandler = (background: BackgroundOptionType | string) => dispatchSettings(setBackground(background as BackgroundOptionType))

    const setOverlayHandler = (isEnabled: boolean) => dispatchSettings(setOverlay(isEnabled))

    const setVideoBackgroundHandler = (video: VideoBackgroundOptionType | string) => dispatchSettings(setVideoBackground(video as VideoBackgroundOptionType))

    const setBackgroundSoundHandler = (isEnabled: boolean) => dispatchSettings(setBackgroundSound(isEnabled))
    //endregion

    //region Dashboard handlers.
    const setShowStatsHandler = (isEnabled: boolean) => dispatchSettings(setShowStats(isEnabled))
    //endregion

    //region Lists handlers.
    const setShowListIdHandler = (isEnabled: boolean) => dispatchSettings(setShowListId(isEnabled))

    const setShowListInputHandler = (isEnabled: boolean) => dispatchSettings(setShowListInput(isEnabled))

    const setShowListTooltipsHandler = (isEnabled: boolean) => dispatchSettings(setShowListTooltips(isEnabled))
    //endregion

    //region Dev handlers.
    const enableDevModeHandler = () => {
        if (settings.dev.mode) return

        if (devModeCount < 9) {
            setDevModeCount(devModeCount + 1)
        } else {
            dispatchSettings(setDevMode(true))
            setDevModeCount(0)
        }
    }

    const setDevModeHandler = (isEnabled: boolean) => dispatchSettings(setDevMode(isEnabled))

    const setMarkupHandler = (isEnabled: boolean) => dispatchSettings(setMarkup(isEnabled))

    const setLogMainRenderHandler = (isEnabled: boolean) => dispatchSettings(setLogMainRender(isEnabled))

    const setLogTasksRenderHandler = (isEnabled: boolean) => dispatchSettings(setLogTasksRender(isEnabled))

    const setAnimateHandler = (isEnabled: boolean) => dispatchSettings(setAnimate(isEnabled))
    //endregion

    return <div className={s.settings}>
        <Background appSettings={settings.app}/>
        <Button
            name={STRINGS.NAV.BACK}
            onClick={() => navigate(PATHS.BACK)}
        />
        <SettingSection name={STRINGS.SETTINGS.APP}>
            <SettingSelect>
                <p>{STRINGS.SETTINGS.BACKGROUND}</p>
                <Select selectedOption={settings.app.background}
                        options={backgroundOptions}
                        setSelected={setBackgroundHandler}/>
                {settings.app.background === STRINGS.VIDEO &&
                    <Select selectedOption={settings.app.videoBackground}
                            options={videoBackgroundOptions}
                            setSelected={setVideoBackgroundHandler}/>}
            </SettingSelect>
            {settings.app.background !== STRINGS.COLOR &&
                <SettingCheckbox name={STRINGS.SETTINGS.OVERLAY}
                                 checked={settings.app.overlay}
                                 onChange={setOverlayHandler}/>}
            {settings.app.background === STRINGS.VIDEO &&
                <SettingCheckbox name={STRINGS.SETTINGS.VIDEO_SOUND}
                                 checked={settings.app.backgroundSound}
                                 onChange={setBackgroundSoundHandler}/>}
        </SettingSection>
        <SettingSection name={STRINGS.SETTINGS.DASHBOARD}>
            <SettingCheckbox name={STRINGS.SETTINGS.SHOW_STATS}
                             checked={settings.dashboard.showStats}
                             onChange={setShowStatsHandler}/>
        </SettingSection>
        <SettingSection name={STRINGS.SETTINGS.LISTS}>
            <SettingCheckbox
                name={STRINGS.SETTINGS.SHOW_LIST_ID}
                checked={settings.lists.showId}
                onChange={setShowListIdHandler}
            />
            <SettingCheckbox
                name={STRINGS.SETTINGS.SHOW_LIST_INPUT}
                checked={settings.lists.showInput}
                onChange={setShowListInputHandler}
            />
            <SettingCheckbox
                name={STRINGS.SETTINGS.SHOW_LIST_TOOLTIPS}
                checked={settings.lists.showTooltips}
                onChange={setShowListTooltipsHandler}
            />
        </SettingSection>
        {settings.dev.mode && <SettingSection name={STRINGS.SETTINGS.DEV_TITLE}>
            <SettingCheckbox
                name={STRINGS.SETTINGS.DEV_MODE}
                checked={settings.dev.mode}
                onChange={setDevModeHandler}
            />
            <SettingCheckbox
                name={STRINGS.SETTINGS.SHOW_MARKUP}
                checked={settings.dev.markup}
                onChange={setMarkupHandler}
            />
            <SettingCheckbox
                name={STRINGS.SETTINGS.LOG_MAIN_RENDER}
                checked={settings.dev.logMainRender}
                onChange={setLogMainRenderHandler}
            />
            <SettingCheckbox
                name={STRINGS.SETTINGS.LOG_TASKS_RENDER}
                checked={settings.dev.logTasksRender}
                onChange={setLogTasksRenderHandler}
            />
            <SettingCheckbox
                name={STRINGS.SETTINGS.ANIMATIONS}
                checked={settings.dev.animate}
                onChange={setAnimateHandler}
            />
        </SettingSection>}
        <SettingSection name={STRINGS.SETTINGS.ABOUT}>
            <h2 onClick={enableDevModeHandler}
                style={settings.dev.mode ? {cursor: 'default'} : {cursor: 'pointer'}}
            >{PROJECT.NAME}{!settings.dev.mode && devModeCount > 0 &&
                <sup> (<span style={{color: '#0f0'}}>{devModeCount}</span>/10)</sup>}</h2>
            <p>{PROJECT.DESCRIPTION}</p>
            <p>{STRINGS.SETTINGS.VERSION} {PROJECT.VERSION}</p>
            <p>{STRINGS.SETTINGS.BUILD} {PROJECT.BUILD}</p>
            <p>{STRINGS.SETTINGS.GITHUB} <a href={LINKS.PROJECT_GITHUB}>{STRINGS.SETTINGS.PROJECT_GITHUB}</a></p>
        </SettingSection>
    </div>
})