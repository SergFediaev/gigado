import {ListType, StateType} from '../../store/types/stateTypes'
import s from './ViewItem.module.css'
import {useNavigate, useParams} from 'react-router-dom'
import {Error404} from '../error404/Error404'
import {PATHS} from '../../strings/paths'
import {Button} from '../button/Button'
import React, {memo} from 'react'
import {ViewList} from '../ViewList/ViewList'
import {RENDERING, STRINGS} from '../../strings/strings'
import {settings} from '../../store/settings'

type ViewItemPropsType = {
    initialState: StateType
}

export const ViewItem = memo(({initialState}: ViewItemPropsType) => {
    if (settings.dev.logMainRender) console.log(RENDERING.VIEW_ITEM)

    const navigate = useNavigate()
    const {id} = useParams()
    const list = initialState.lists.find(list => list.id === id) as ListType

    return list
        ? <div className={s.viewItem}>
            <Button
                name={STRINGS.NAV.TO_DASHBOARD}
                onClick={() => navigate(PATHS.DASHBOARD)}/>
            <ViewList id={list.id}
                      name={list.name}
                      tasks={initialState.tasks[list.id]}
                      isDone={list.isDone}
                      isPinned={list.isPinned}/>
        </div>
        : <Error404/>
})