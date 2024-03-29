import s from './Login.module.css'
import {useNavigate} from 'react-router-dom'
import {PATHS} from '../../strings/paths'
import {memo, useState} from 'react'
import {PROJECT, RENDERING, STRINGS, VIDEO_BACKGROUNDS} from '../../strings/strings'
import {settings} from '../../store/settings'
import {VideoBackground} from '../videoBackground/VideoBackground'

export const Login = memo(() => {
    if (settings.dev.logMainRender) console.log(RENDERING.LOGIN)

    const navigate = useNavigate()
    const [invertBackground, setInvertBackground] = useState(false)

    return <>
        <VideoBackground video={VIDEO_BACKGROUNDS.BEACH}/>
        <div className={`${s.logo} ${invertBackground && s.inverse}`}>
            <h1 onMouseEnter={() => setInvertBackground(true)}
                onMouseLeave={() => setInvertBackground(false)}>{PROJECT.NAME}</h1>
            <p>{PROJECT.SLOGAN}</p>
            <div className={s.buttons}>
                <button onClick={() => navigate(`${PATHS.DASHBOARD}`)}>{STRINGS.BUTTONS.DASHBOARD}</button>
                <button onClick={() => navigate(`${PATHS.SETTINGS}`)}>{STRINGS.BUTTONS.SETTINGS}</button>
            </div>
        </div>
    </>
})