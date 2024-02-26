import React from 'react'
import S from './Button.module.css'

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
        className={`${S.button} ${important && S.importantButton} ${disabled && S.disabledButton}`}
    >{name}</button>
}