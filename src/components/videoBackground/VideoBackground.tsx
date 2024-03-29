import {EMOJIS, FILE_TYPES, VIDEO_BACKGROUNDS} from '../../strings/strings'
import {createRef, memo, useState} from 'react'
import s from './VideoBackground.module.css'
import {VideoBackgroundOptionType} from '../../store/types/settingsTypes'
import beach from '../../assets/video/beach.mp4'
import ocean from '../../assets/video/ocean.mp4'
import fireplace from '../../assets/video/fireplace.mp4'
import lift from '../../assets/video/lift.mp4'
import rain_en from '../../assets/video/rain_en.mp4'
import rain_ru from '../../assets/video/rain_ru.mp4'
import pain from '../../assets/video/pain.mp4'
import onboarding from '../../assets/video/onboarding.mp4'

type VideoBackgroundPropsType = {
    video: VideoBackgroundOptionType | typeof VIDEO_BACKGROUNDS.ONBOARDING
    autoPlay?: boolean
    loop?: boolean
    muted?: boolean
    controlSound?: boolean
}

export const VideoBackground = memo(({
                                         video,
                                         autoPlay = true,
                                         loop = true,
                                         muted = true,
                                         controlSound = false,
                                     }: VideoBackgroundPropsType) => {
        const player = createRef<HTMLVideoElement>()
        const [showMuted, setShowMuted] = useState(muted)

        const muteVideoHandler = () => {
            if (player.current) {
                player.current.muted = !player.current.muted
                player.current.volume = .3
                setShowMuted(!showMuted)
            }
        }

        let source
        switch (video) {
            case VIDEO_BACKGROUNDS.BEACH:
                source = beach
                break
            case VIDEO_BACKGROUNDS.OCEAN:
                source = ocean
                break
            case VIDEO_BACKGROUNDS.FIREPLACE:
                source = fireplace
                break
            case VIDEO_BACKGROUNDS.ANIME1:
                source = lift
                break
            case VIDEO_BACKGROUNDS.ANIME2:
                source = rain_en
                break
            case VIDEO_BACKGROUNDS.ANIME3:
                source = rain_ru
                break
            case VIDEO_BACKGROUNDS.ANIME4:
                source = pain
                break
            case VIDEO_BACKGROUNDS.ONBOARDING:
                source = onboarding
                break
        }

        return <div className={s.background}>
            <video ref={player}
                   controls={false}
                   autoPlay={autoPlay}
                   loop={loop}
                   muted={muted}
                   src={source}>
                <source src={source}
                        type={FILE_TYPES.MP4}/>
            </video>
            {controlSound && <span className={s.controlSound}
                                   onClick={muteVideoHandler}
                                   title={showMuted ? 'Включить звук' : 'Выключить звук'}>{showMuted ? EMOJIS.UNMUTE : EMOJIS.MUTE}</span>}
        </div>
    },
)