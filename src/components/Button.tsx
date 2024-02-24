import React, {useState} from 'react'

type ButtonPropsType = {
    name: string
    onClick: () => void
    disabled?: boolean
}

export const Button = ({name, onClick}: ButtonPropsType) => {
    const [disabled, setDisabled] = useState<boolean>(false)

    const onClickHandler = () => onClick()

    return <button
        onClick={onClickHandler}
        disabled={disabled}>{name}</button>
}