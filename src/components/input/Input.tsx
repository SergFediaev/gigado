import {ChangeEvent} from 'react'
import S from './Input.module.css'

type InputPropsType = {
    inputValue: string
    onChangeCallback: (inputValue: string) => void
    placeholder: string
}

export const Input = ({inputValue, onChangeCallback, placeholder}: InputPropsType) => {
    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        onChangeCallback(event.currentTarget.value)
    }

    return <input
        type="text"
        value={inputValue}
        onChange={(event) => {
            onChangeHandler(event)
        }}
        placeholder={placeholder}
        className={S.input}
    />
}