import s from './InputForm.module.css'
import {memo} from 'react'

type InputFormPropsType = {
    inputValue: string
    placeholder: string
    onChange: (inputValue: string) => void
    buttonIcon: string
    onClick: () => void
    buttonTitle?: string
};

export const InputForm = memo(({
                                   inputValue,
                                   placeholder,
                                   onChange,
                                   buttonIcon,
                                   onClick,
                                   buttonTitle,
                               }: InputFormPropsType) => <form className={s.form}>
    <input
        value={inputValue}
        placeholder={placeholder}
        onChange={(event) => onChange(event.currentTarget.value)}
    />
    <button
        type="submit"
        onClick={() => onClick()}
        title={buttonTitle}
    >{buttonIcon}</button>
</form>)