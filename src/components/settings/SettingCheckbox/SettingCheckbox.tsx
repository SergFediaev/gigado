import s from './SettingCheckbox.module.css'

type SettingCheckboxPropsType = {
    name: string
    checked: boolean
    onChange: (checked: boolean) => void
}

export const SettingCheckbox = ({name, checked, onChange}: SettingCheckboxPropsType) => <div className={s.settings}>
    <span>{name}</span>
    <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.currentTarget.checked)}
    />
</div>