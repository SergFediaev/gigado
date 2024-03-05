import s from './InputForm.module.css'

type InputFormPropsType = {
    inputValue: string
    placeholder: string
    onChange: (inputValue: string) => void
    buttonIcon: string
    onClick: () => void
};

export const InputForm = ({
                              inputValue,
                              placeholder,
                              onChange,
                              buttonIcon,
                              onClick,
                          }: InputFormPropsType) => <form className={s.form}>
    <input
        value={inputValue}
        placeholder={placeholder}
        onChange={(event) => onChange(event.currentTarget.value)}
    />
    <button
        type="submit"
        onClick={onClick}
    >{buttonIcon}</button>
</form>