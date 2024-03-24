import {Dashboard} from '../dashboard/Dashboard'
import {StateType} from '../../store/types/stateTypes'
import {Route, Routes} from 'react-router-dom'
import {PATHS} from '../../strings/paths'
import {Error404} from '../error404/Error404'
import {ViewItem} from '../viewItem/ViewItem'
import React, {memo, useState} from 'react'
import s from './App.module.css'
import {RENDERING, STRINGS} from '../../strings/strings'
import {Settings} from '../settings/Settings'
import {SettingsType} from '../../store/types/settingsTypes'
import {Login} from '../login/Login'

type AppPropsType = {
    initialState: StateType
    initialSettings: SettingsType
}

export const App = memo(({initialState, initialSettings}: AppPropsType) => {
    if (initialSettings.dev.logMainRender) console.log(RENDERING.APP)

    const [backgroundImage, setBackgroundImage] = useState<string>(STRINGS.RANDOM_BACKGROUND_IMAGE_URL)
    const setBackgroundImageHandler = () => setBackgroundImage(STRINGS.RANDOM_BACKGROUND_IMAGE_URL)

    return <div
        className={`${s.dashboard} ${initialSettings.dev.markup && s.debug}`}
        style={{backgroundImage: `url(${backgroundImage})`}}
    >
        <Routes>
            <Route
                path={PATHS.DASHBOARD}
                element={<Dashboard initialState={initialState}/>}
            />
            <Route
                path={PATHS.ROOT}
                element={<Login/>}
            />
            <Route
                path={PATHS.SETTINGS}
                element={<Settings initialSettings={initialSettings}/>}
            />
            <Route
                path={PATHS.ERROR_404}
                element={<Error404/>}
            />
            <Route
                path={`${PATHS.DASHBOARD}${PATHS.LIST}${PATHS.ID}`}
                element={<ViewItem initialState={initialState}/>}
            />
            <Route
                path={`${PATHS.DASHBOARD}${PATHS.LIST}${PATHS.ALL}`}
                element={<Error404/>}
            />
            <Route
                path={PATHS.ALL}
                element={<Error404/>}
            />
        </Routes>
    </div>
})