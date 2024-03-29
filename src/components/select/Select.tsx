import s from './Select.module.css'
import {KeyboardEvent, memo, MouseEvent, useState} from 'react'
import {useAutoAnimate} from '@formkit/auto-animate/react'
import {BUTTONS} from '../../strings/keys'
import {EMOJIS, STRINGS} from '../../strings/strings'

type SelectPropsType = {
    selectedOption: string
    options: OptionType[]
    setSelected: (option: string) => void
    endlessSelect?: boolean
}

export type OptionType = {
    name: string
    icon?: string
    disabled?: boolean
}

export const Select = memo(({
                                selectedOption,
                                options,
                                setSelected,
                                endlessSelect = true,
                            }: SelectPropsType) => {
    //region Local.
    const unlockedOptions = options.filter(option => !option.disabled)
    const selected = unlockedOptions.find(option => option.name === selectedOption) || options[0]
    const [showMenu, setShowMenu] = useState(false)
    const [select, setSelect] = useState(selected)
    const [endless, setEndless] = useState(endlessSelect)
    const [animate] = useAutoAnimate()
    //endregion

    //region Handlers.
    const closeMenuHandler = () => {
        setShowMenu(false)
        setSelect(selected)
    }

    const onSelectClickHandler = (event: MouseEvent) => {
        if (event.ctrlKey) setEndless(!endless)
        else setShowMenu(!showMenu)
    }

    const hoverHandler = (event: MouseEvent<HTMLDivElement>) => {
        event.currentTarget.focus()
        setShowMenu(true)
    }

    const keyPressHandler = (event: KeyboardEvent) => {
        event.preventDefault()

        if (event.key === BUTTONS.ESCAPE) {
            closeMenuHandler()
            return
        }

        if (event.key === BUTTONS.ENTER) {
            if (showMenu) {
                if (selected !== select) setSelected(select.name)
                setShowMenu(false)
            } else {
                setShowMenu(true)
            }
            return
        }

        if (event.key === BUTTONS.ARROW_UP || event.key === BUTTONS.ARROW_DOWN) {
            let stepIndex = unlockedOptions.indexOf(select)
            const {key} = event

            if (key === BUTTONS.ARROW_UP) {
                stepIndex -= 1

                if (stepIndex < 0) {
                    if (endless) stepIndex = unlockedOptions.length - 1
                    else return
                }
            } else {
                stepIndex += 1

                if (stepIndex === unlockedOptions.length) {
                    if (endless) stepIndex = 0
                    else return
                }
            }

            for (let iteration = 0; iteration < unlockedOptions.length; iteration++) {
                if (selectedOption === unlockedOptions[iteration].name) {
                    setSelect(unlockedOptions[stepIndex])
                    setSelected(unlockedOptions[stepIndex].name)
                    return
                }
            }
        }
    }
    //endregion

    return <div autoFocus={showMenu}
                className={s.select}
                onMouseEnter={hoverHandler}
                onMouseLeave={closeMenuHandler}
                ref={animate}
                onKeyDown={keyPressHandler}
                tabIndex={0}>
        <div onClick={onSelectClickHandler}
             className={`${s.selected}  ${showMenu && s.selectOpened}`}>
                <span
                    className={s.selectedOption}>{selectedOption}</span><span>{showMenu
            ? (endless ? STRINGS.EMPTY : `${EMOJIS.WALL} `) + EMOJIS.ARROW_UP
            : EMOJIS.ARROW_DOWN}</span>
        </div>
        {showMenu && <ul>
            {options.map((option, index) => {
                const optionName = `${option.icon ? `${option.icon} ` : STRINGS.EMPTY}${option.name}`

                const onOptionClickHandler = () => {
                    setSelected(option.name)
                    setShowMenu(false)
                }

                return option.disabled
                    ? <li
                        key={index}
                        className={s.locked}
                    >{optionName}</li>
                    : <li
                        key={index}
                        className={select === option ? s.selection : STRINGS.EMPTY}
                        onClick={onOptionClickHandler}
                        onMouseEnter={() => setSelect(option)}
                    >{optionName}</li>
            })}
        </ul>}
    </div>
})