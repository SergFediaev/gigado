import React from 'react'
import s from './Button.module.css'

type ButtonPropsType = {
    name: string
    onClick: () => void
    disabled?: boolean
    important?: boolean
}

export const Button = ({name, onClick, disabled, important}: ButtonPropsType) => {

    const onClickHandler = () => onClick()

    return <button
        onClick={onClickHandler}
        disabled={disabled}
        className={`${s.button} ${important && s.importantButton} ${disabled && s.disabledButton}`}
    >{name}</button>
}