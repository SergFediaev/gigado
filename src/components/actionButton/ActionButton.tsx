import S from './ActionButton.module.css'
import {useState} from 'react'

type ActionButtonPropsType = {
    name: string
    onClickCallback: () => void
    icon?: string
    important?: boolean
}

export const ActionButton = ({
                                 name,
                                 onClickCallback,
                                 icon,
                                 important,
                             }: ActionButtonPropsType) => {

    const [hover, setHover] = useState<boolean>(false)

    return <button
        className={`${S.button} ${important && S.important}`}
        onClick={onClickCallback}
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
    >{icon && `${icon} `}{hover && name}</button>
}