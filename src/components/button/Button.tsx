import React, {memo} from 'react'
import s from './Button.module.css'

type ButtonPropsType = {
    name: string
    onClick: () => void
    disabled?: boolean
    important?: boolean
}

export const Button = memo(({name, onClick, disabled, important}: ButtonPropsType) => <button
    onClick={onClick}
    disabled={disabled}
    className={`${s.button} ${important && s.importantButton} ${disabled && s.disabledButton}`}
>{name}</button>)