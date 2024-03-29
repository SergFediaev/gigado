import {STRINGS} from '../../strings/strings'
import s from './Background.module.css'
import {VideoBackground} from '../videoBackground/VideoBackground'
import {Overlay} from '../overlay/Overlay'
import {AppType} from '../../store/types/settingsTypes'
import {memo} from 'react'

type BackgroundPropsType = {
    appSettings: AppType
}

export const Background = memo(({appSettings}: BackgroundPropsType) => {
    switch (appSettings.background) {

        case STRINGS.COLOR:
            return <div className={s.color}></div>

        case STRINGS.WALLPAPER:
            return <>
                <div className={s.wallpaper}></div>
                {appSettings.overlay && <Overlay/>}
            </>

        case STRINGS.RANDOM_WALLPAPER:
            return <>
                <div className={s.randomWallpaper}
                     style={{backgroundImage: `url(${STRINGS.RANDOM_BACKGROUND_IMAGE_URL})`}}></div>
                {appSettings.overlay && <Overlay/>}
            </>

        case STRINGS.VIDEO:
            return <>
                <VideoBackground video={appSettings.videoBackground}
                                 muted={!appSettings.backgroundSound}/>
                {appSettings.overlay && <Overlay/>}
            </>
    }
})