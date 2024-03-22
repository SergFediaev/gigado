import s from './ActionButton.module.css'
import {memo} from 'react'

type ActionButtonPropsType = {
    name: string
    onClickCallback: () => void
    icon?: string
    important?: boolean
    tooltips?: boolean
}

export const ActionButton = memo(({
                                      name,
                                      onClickCallback,
                                      icon,
                                      important,
                                      tooltips,
                                  }: ActionButtonPropsType) => <button
    className={`${s.button} ${important && s.important}`}
    onClick={onClickCallback}
>{icon && `${icon} `}{tooltips && name}</button>)