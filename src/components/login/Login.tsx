import s from './Login.module.css'
import {useNavigate} from 'react-router-dom'
import {PATHS} from '../../strings/paths'
import {memo, useState} from 'react'
import {PROJECT, RENDERING, STRINGS, TITLES} from '../../strings/strings'
import {settings} from '../../store/settings'

export const Login = memo(() => {
    if (settings.dev.logMainRender) console.log(RENDERING.LOGIN)

    const navigate = useNavigate()
    const [invertBackground, setInvertBackground] = useState(false)

    return <div className={s.login}>
        <iframe title={TITLES.YOUTUBE_BACKGROUND}
                src={`https://www.youtube.com/embed/78GOZ1PMp7k?controls=0&autoplay=1&mute=1&playsinline=1&loop=1&playlist=78GOZ1PMp7k&amp;start=30`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen></iframe>
        <div className={`${s.logo} ${invertBackground && s.inverse}`}>
            <h1 onMouseEnter={() => setInvertBackground(true)}
                onMouseLeave={() => setInvertBackground(false)}>{PROJECT.NAME}</h1>
            <p>{PROJECT.SLOGAN}</p>
            <div className={s.buttons}>
                <button onClick={() => navigate(`${PATHS.DASHBOARD}`)}>{STRINGS.BUTTONS.DASHBOARD}</button>
                <button onClick={() => navigate(`${PATHS.SETTINGS}`)}>{STRINGS.BUTTONS.SETTINGS}</button>
            </div>
        </div>
    </div>
})