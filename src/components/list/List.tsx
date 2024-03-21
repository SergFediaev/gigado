import {Task} from '../task/Task'
import React, {MouseEvent, useState} from 'react'
import s from './List.module.css'
import {ActionButton} from '../actionButton/ActionButton'
import {InputForm} from '../inputForm/InputForm'
import {useAutoAnimate} from '@formkit/auto-animate/react'
import {TaskType} from '../../store/types/stateTypes'
import {PATHS} from '../../strings/paths'
import {useNavigate} from 'react-router-dom'
import {settings} from '../../store/settings'
import {RENDERING} from '../../strings/strings'

export type ListPropsType = {
    id: string
    name: string
    changeListName: (listId: string, newListName: string) => void
    tasks: TaskType[]
    isDone: boolean
    isPinned: boolean
    deleteList: (listId: string) => void
    addTask: (listId: string, taskName: string) => void
    deleteTask: (listId: string, taskId: string) => void
    updateTask: (listId: string, taskId: string, isTaskChecked: boolean) => void
    changeTaskName: (listId: string, taskId: string, newTaskName: string) => void
    moveTaskVertical: (listId: string, taskId: string, moveDown: boolean) => void
    moveTaskHorizontal: (listId: string, taskId: string, moveRight: boolean) => void
    pinList: (listId: string, isPinned: boolean) => void
    isSelected: boolean
    completeList: (listId: string, isComplete: boolean) => void
    moveList: (listId: string, moveLeft: boolean) => void
    splitList: (listId: string) => void
    mergeLists: (listId: string) => void
    selectList: (id: string, isSelected: boolean) => void
    clearList: (id: string) => void
    selectedListsCount: number
    itemsCount: number
    listsCount: number
}

export const List = ({
                         id,
                         name,
                         changeListName,
                         tasks,
                         isDone,
                         isPinned,
                         deleteList,
                         addTask,
                         deleteTask,
                         updateTask,
                         changeTaskName,
                         pinList,
                         isSelected,
                         completeList,
                         moveList,
                         splitList,
                         moveTaskVertical,
                         moveTaskHorizontal,
                         mergeLists,
                         selectList,
                         clearList,
                         selectedListsCount,
                         itemsCount,
                         listsCount,
                     }: ListPropsType) => {
    if (settings.dev.logMainRender) console.log(RENDERING.LIST_NAME, name)

    const tasksElements = tasks.map(task => {

        const deleteTaskHandler = (listId: string, taskId: string) => {
            deleteTask(id, taskId)
        }

        const updateTaskHandler = (listId: string, taskId: string, isTaskChecked: boolean) => {
            updateTask(id, taskId, isTaskChecked)
        }

        const changeTaskNameHandler = (listId: string, taskId: string, newTaskName: string) => {
            changeTaskName(id, taskId, newTaskName)
        }

        const moveTaskVerticalHandler = (listId: string, taskId: string, moveDown: boolean) => {
            moveTaskVertical(listId, taskId, moveDown)
        }

        const moveTaskHorizontalHandler = (listId: string, taskId: string, moveRight: boolean) => {
            moveTaskHorizontal(listId, taskId, moveRight)
        }

        return <Task
            key={task.id}
            id={task.id}
            listId={id}
            name={task.name}
            changeTaskName={changeTaskNameHandler}
            isDone={task.isDone}
            isSelected={task.isSelected}
            deleteTask={deleteTaskHandler}
            updateTask={updateTaskHandler}
            moveTaskVertical={moveTaskVerticalHandler}
            moveTaskHorizontal={moveTaskHorizontalHandler}
            tasksCount={tasks.length}
            listsCount={listsCount}
        />
    })

    const deleteListHandler = () => {
        deleteList(id)
    }

    const [inputTaskName, setInputTaskName] = useState<string>('')

    const addTaskHandler = () => {
        addTask(id, inputTaskName)
        setInputTaskName('')
    }

    const inputTaskNameChange = (inputTaskName: string) => {
        setInputTaskName(inputTaskName)
    }

    const selectListHandler = (event: MouseEvent<HTMLSpanElement>) => {
        if (event.ctrlKey) setListNameEditing(true)
        else selectList(id, !isSelected)
    }

    const [showTooltips, setShowTooltips] = useState(settings.lists.showTooltips)

    const [listNameEditing, setListNameEditing] = useState<boolean>(false)

    const [listNameInput, setListNameInput] = useState<string>(name)

    const changeListNameHandler = () => {
        setListNameEditing(false)
        if (name !== listNameInput) changeListName(id, listNameInput)
    }

    const [animateListRef] = useAutoAnimate<HTMLElement>()

    const [animateTasksRef] = useAutoAnimate<HTMLOListElement>()

    const [showTaskInput, setShowTaskInput] = useState<boolean>(settings.lists.showInput)

    const [spin, setSpin] = useState<boolean>(false)

    const clearListHandler = () => {
        setSpin(true)
        clearList(id)
    }

    const navigate = useNavigate()

    const onListHoverHandler = () => {
        if (!settings.lists.showInput) setShowTaskInput(true)

    }

    const onListUnhoverHandler = () => {
        if (!settings.lists.showInput) setShowTaskInput(false)
    }

    return <div
        ref={animateListRef}
        className={`${s.toDoList} ${isDone ? s.completedToDoList : isPinned ? s.pinnedToDoList : undefined} ${isSelected && s.selected} ${spin && s.spinAnimation}`}
        onMouseEnter={() => onListHoverHandler()}
        onMouseLeave={() => onListUnhoverHandler()}
        onAnimationEnd={() => setSpin(false)}
    >
        <h2>{isPinned && '📍 '}{isDone && '✅ '}{listNameEditing ? <textarea
            className={s.editable}
            value={listNameInput}
            onChange={(event) => setListNameInput(event.currentTarget.value)}
            onBlur={changeListNameHandler}
            autoFocus
        /> : <span
            className={`${isDone && s.completedToDoListName} ${s.listTitle}`}
            onClick={(event) => selectListHandler(event)}
        >{name}</span>}</h2>
        {isSelected && <div className={s.control}>
            <ActionButton
                name={showTooltips ? 'Hide tooltips' : 'Show tooltips'}
                icon={showTooltips ? '🙈' : '❓'}
                onClickCallback={() => setShowTooltips(!showTooltips)}
                tooltips={showTooltips}
            />
            <ActionButton
                name={isPinned ? 'Unpin' : 'Pin'}
                icon={isPinned ? '📌' : '📍'}
                onClickCallback={() => pinList(id, !isPinned)}
                tooltips={showTooltips}
            />
            {itemsCount > 1 && <>
                <ActionButton
                    name="Move left"
                    icon="⬅️"
                    onClickCallback={() => moveList(id, true)}
                    tooltips={showTooltips}
                />
                <ActionButton
                    name="Move right"
                    icon="➡️"
                    onClickCallback={() => moveList(id, false)}
                    tooltips={showTooltips}
                />
            </>}
            {tasks.length > 1 && <ActionButton
                name="Split"
                icon="🔪"
                onClickCallback={() => splitList(id)}
                tooltips={showTooltips}
            />}
            {selectedListsCount > 1 && <ActionButton
                name="Merge"
                icon="🩹"
                onClickCallback={() => mergeLists(id)}
                tooltips={showTooltips}
            />}
            <ActionButton
                name="View"
                icon="👀"
                onClickCallback={() => navigate(`${PATHS.DASHBOARD}${PATHS.LIST}/${id}`)}
                tooltips={showTooltips}
            />
            {tasks.length > 0 && <>
                <ActionButton
                    name={isDone ? 'Uncomplete' : 'Complete'}
                    icon={isDone ? '❎' : '✅'}
                    onClickCallback={() => completeList(id, !isDone)}
                    tooltips={showTooltips}
                />
                <ActionButton
                    name="Clear all tasks"
                    icon="🧹"
                    onClickCallback={clearListHandler}
                    important
                    tooltips={showTooltips}
                />
            </>}
            <ActionButton
                name="Delete"
                icon="🗑️"
                onClickCallback={deleteListHandler}
                important
                tooltips={showTooltips}
            />
        </div>}
        {settings.lists.showId && <p className={s.listId}>List ID: {id}</p>}
        <ol
            className={s.tasks}
            ref={animateTasksRef}
        >
            {tasksElements.length > 0 ? tasksElements :
                <span>The task list is empty for now. Added tasks will be displayed here.</span>}
        </ol>
        {showTaskInput && <InputForm
            inputValue={inputTaskName}
            placeholder="Enter new task"
            onChange={inputTaskNameChange}
            buttonIcon="➕"
            onClick={addTaskHandler}
        />}
    </div>
}