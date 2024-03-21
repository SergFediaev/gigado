import s from './SettingSection.module.css'
import {ReactNode} from 'react'

type Props = {
    name: string
    children: ReactNode
}

export const SettingSection = ({name, children}: Props) => <div className={s.section}>
    <h3>{name}</h3>
    {children}
</div>