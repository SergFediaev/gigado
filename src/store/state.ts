import {ItemType, StateType, TasksType} from './types/stateTypes'
import {KEYS} from '../strings/keys'

const defaultState: StateType = {
    lists: Array<ItemType>(),
    tasks: {} as TasksType,
} as const

const getLocalStorageState = (): StateType => {
    const localStorageState = localStorage.getItem(KEYS.STATE)
    return localStorageState ? JSON.parse(localStorageState) : defaultState
}

export const setLocalStorageState = (state: StateType) => localStorage.setItem(KEYS.STATE, JSON.stringify(state))

export const state: StateType = getLocalStorageState()