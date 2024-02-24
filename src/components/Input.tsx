import {ChangeEvent} from 'react'

type InputPropsType = {
    inputValue: string
    onChangeCallback: (inputValue: string) => void
}

export const Input = ({inputValue, onChangeCallback}: InputPropsType) => {

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        onChangeCallback(event.currentTarget.value)
    }

    return <input
        type="text"
        value={inputValue}
        onChange={(event) => {
            onChangeHandler(event)
        }}/>
}