import {ListType, StateType} from '../../store/types/stateTypes'
import s from './ViewItem.module.css'
import {useNavigate, useParams} from 'react-router-dom'
import {Error404} from '../error404/Error404'
import {PATHS} from '../../strings/paths'
import {Button} from '../button/Button'
import React, {memo} from 'react'

type ViewItemPropsType = {
    initialState: StateType
}

export const ViewItem = memo(({initialState}: ViewItemPropsType) => {
    const navigate = useNavigate()
    const {id} = useParams()
    const list = initialState.lists.find(list => list.id === id)

    return <>
        {list ? <div className={s.viewItem}>
            <Button name={'Back to dashboard 📊'} onClick={() => navigate(PATHS.DASHBOARD)}/>
            {(list as ListType).id}
            {(list as ListType).name}
            {(list as ListType).isDone}
            {(list as ListType).isPinned}
        </div> : <Error404/>}
    </>
})