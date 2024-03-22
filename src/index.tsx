import React from 'react'
import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import {HashRouter} from 'react-router-dom'
import {state} from './store/state'
import {App} from './components/app/App'
import './components/common.css'
import {SettingsType} from './store/types/settingsTypes'
import {settings} from './store/settings'
import {RENDERING} from './strings/strings'

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
)

export const render = (settings: SettingsType) => {
    if (settings.dev.logMainRender) console.log(RENDERING.INDEX)

    return root.render(
        <HashRouter>
            <App
                initialState={state}
                initialSettings={settings}
            />
        </HashRouter>,
    )
}

render(settings)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()