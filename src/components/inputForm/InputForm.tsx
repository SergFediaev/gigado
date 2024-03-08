import s from './InputForm.module.css'

type InputFormPropsType = {
    inputValue: string
    placeholder: string
    onChange: (inputValue: string) => void
    buttonIcon: string
    onClick: () => void
    buttonTitle?: string
};

export const InputForm = ({
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
</form>