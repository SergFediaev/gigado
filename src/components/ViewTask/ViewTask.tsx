import s from './ViewTask.module.css'
import React, {memo} from 'react'
import {settings} from '../../store/settings'
import {RENDERING} from '../../strings/strings'

type ViewTaskPropsType = {
    name: string
    isDone: boolean
}

export const ViewTask = memo(({
                                  name,
                                  isDone,
                              }: ViewTaskPropsType) => {
    if (settings.dev.logMainRender) console.log(RENDERING.VIEW_TASK_NAME, name)

    return <li className={s.task}>
        <div className={s.taskContainer}>
            <input type="checkbox"
                   checked={isDone}
                   className={s.taskStatus}/>
            <span className={`${isDone && s.doneTask}`}>{name}</span>
        </div>
    </li>
})