import s from './SettingSelect.module.css'
import {memo, ReactNode} from 'react'

type SettingSelectPropsType = {
    children: ReactNode
}

export const SettingSelect = memo(({children}: SettingSelectPropsType) => <div
    className={s.settingSelect}>{children}</div>)