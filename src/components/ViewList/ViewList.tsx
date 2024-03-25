import s from './ViewList.module.css'
import {TaskType} from '../../store/types/stateTypes'
import React, {memo} from 'react'
import {settings} from '../../store/settings'
import {ViewTask} from '../ViewTask/ViewTask'
import {RENDERING} from '../../strings/strings'

type ViewListPropsType = {
    id: string
    name: string
    tasks: TaskType[]
    isDone: boolean
    isPinned: boolean
}

export const ViewList = memo(({
                                  id,
                                  name,
                                  tasks,
                                  isDone,
                                  isPinned,
                              }: ViewListPropsType) => {
    if (settings.dev.logMainRender) console.log(RENDERING.VIEW_LIST_NAME, name)

    const tasksElements = tasks.map(task => <ViewTask key={task.id}
                                                      name={task.name}
                                                      isDone={task.isDone}/>)

    return <div className={`${s.toDoList} ${isDone ? s.completedToDoList : isPinned ? s.pinnedToDoList : undefined}`}>
        <h2>{isPinned && '📍 '}{isDone && '✅ '}<span
            className={`${isDone && s.completedToDoListName} ${s.listTitle}`}
        >{name}</span></h2>
        {settings.lists.showId && <p className={s.listId}>List ID: {id}</p>}
        <ol className={s.tasks}>{tasksElements.length > 0
            ? tasksElements
            : <span>The task list is empty for now. Added tasks will be displayed here.</span>}
        </ol>
    </div>
})