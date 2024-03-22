import {memo} from 'react'
import s from './Input.module.css'

type InputPropsType = {
    inputValue: string
    onChangeCallback: (inputValue: string) => void
    placeholder: string
}

export const Input = memo(({inputValue, onChangeCallback, placeholder}: InputPropsType) => <input
    type="text"
    value={inputValue}
    onChange={(event) => onChangeCallback(event.currentTarget.value)}
    placeholder={placeholder}
    className={s.input}
/>)