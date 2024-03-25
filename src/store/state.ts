import {ItemType, StateType, TasksType} from './types/stateTypes'
import {KEYS} from '../strings/keys'
import {EMOJIS, STRINGS} from '../strings/strings'
import {OptionType} from '../components/select/Select'

const defaultState: StateType = {
    lists: Array<ItemType>(),
    tasks: {} as TasksType,
    selectedItemOption: STRINGS.LIST,
} as const

const getLocalStorageState = (): StateType => {
    const localStorageState = localStorage.getItem(KEYS.STATE)
    return localStorageState ? JSON.parse(localStorageState) : defaultState
}

export const setLocalStorageState = (state: StateType) => localStorage.setItem(KEYS.STATE, JSON.stringify(state))

export const state: StateType = getLocalStorageState()

export const itemOptions: OptionType[] = [
    {
        icon: EMOJIS.LIST,
        name: STRINGS.LIST,
    },
    {
        icon: EMOJIS.COUNTER,
        name: STRINGS.COUNTER,
    },
    {
        icon: EMOJIS.NOTE,
        name: STRINGS.NOTE,
        disabled: true,
    },
    {
        icon: EMOJIS.PICTURE,
        name: STRINGS.PICTURE,
        disabled: true,
    },
    {
        icon: EMOJIS.PLAYLIST,
        name: STRINGS.PLAYLIST,
        disabled: true,
    },
]