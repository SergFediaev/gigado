import S from './ActionButton.module.css'

type ActionButtonPropsType = {
    name: string
    onClickCallback: () => void
    icon?: string
    important?: boolean
    tooltips?: boolean
}

export const ActionButton = ({
                                 name,
                                 onClickCallback,
                                 icon,
                                 important,
                                 tooltips,
                             }: ActionButtonPropsType) => {
    return <button
        className={`${S.button} ${important && S.important}`}
        onClick={onClickCallback}
    >{icon && `${icon} `}{tooltips && name}</button>
}