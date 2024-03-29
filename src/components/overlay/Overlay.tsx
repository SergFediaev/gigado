import s from './Overlay.module.css'
import {memo} from 'react'

type OverlayPropsType = {
    opacity?: number
}

export const Overlay = memo(({opacity = .5}: OverlayPropsType) => <div className={s.overlay}
                                                                       style={{opacity}}></div>)