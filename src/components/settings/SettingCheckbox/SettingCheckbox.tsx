import s from './SettingCheckbox.module.css'
import {memo} from 'react'

type SettingCheckboxPropsType = {
    name: string
    checked: boolean
    onChange: (checked: boolean) => void
}

export const SettingCheckbox = memo(({name, checked, onChange}: SettingCheckboxPropsType) => <div
    className={s.settings}>
    <span>{name}</span>
    <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.currentTarget.checked)}
    />
</div>)