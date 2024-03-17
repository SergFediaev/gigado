import {StateType} from './types/stateTypes'
import {KEYS} from '../strings/keys'

const getLocalStorageState = (): StateType => {
    const localStorageState = localStorage.getItem(KEYS.STATE)
    return localStorageState ? JSON.parse(localStorageState) : {lists: [], tasks: {}} as StateType
}

export const setLocalStorageState = (state: StateType) => localStorage.setItem(KEYS.STATE, JSON.stringify(state))

export const state: StateType = getLocalStorageState()