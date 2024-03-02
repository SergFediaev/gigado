import {Task, TaskType} from '../task/Task'
import {Button} from '../button/Button'
import {Input} from '../input/Input'
import {useState} from 'react'
import S from './ToDoList.module.css'
import {ActionButton} from '../actionButton/ActionButton'

export type ListType = {
    id: string
    name: string
    tasks: TaskType[]
    isDone: boolean
    isPinned: boolean
    deleteList: (listId: string) => void
    addTask: (listId: string, taskName: string) => void
    deleteTask: (listId: string, taskId: string) => void
    updateTask: (listId: string, taskId: string, isTaskChecked: boolean) => void
    pinList: (listId: string, isPinned: boolean) => void
    isSelected: boolean
    completeList: (listId: string, isComplete: boolean) => void
    moveList: (listId: string, moveLeft: boolean) => void
    splitList: (listId: string) => void
    viewList: (listId: string) => void
}

export const List = ({
                         id,
                         name,
                         tasks,
                         isDone,
                         isPinned,
                         deleteList,
                         addTask,
                         deleteTask,
                         updateTask,
                         pinList,
                         isSelected,
                         completeList,
                         moveList,
                         splitList,
                         viewList,
                     }: ListType) => {

    const tasksElements = Object.values(tasks).map(task => {
        const deleteTaskHandler = (listId: string, taskId: string) => {
            deleteTask(id, taskId)
        }

        const updateTaskHandler = (listId: string, taskId: string, isTaskChecked: boolean) => {
            updateTask(id, taskId, isTaskChecked)
        }

        return <Task
            key={task.id}
            id={task.id}
            listId={id}
            name={task.name}
            isDone={task.isDone}
            deleteTask={deleteTaskHandler}
            updateTask={updateTaskHandler}
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

    const [isListSelected, selectList] = useState<boolean>(isSelected)

    const selectListHandler = () => {
        selectList(!isListSelected)
    }

    const [showTooltips, setShowTooltips] = useState(false)

    return <div
        className={`${S.toDoList} ${isDone ? S.completedToDoList : isPinned ? S.pinnedToDoList : undefined} ${isListSelected && S.selected}`}>
        <h2>{isPinned && '📍 '}{isDone && '✅ '}<span
            className={`${isDone && S.completedToDoListName} ${S.listTitle}`}
            onClick={selectListHandler}>{name}</span>
        </h2>
        {isListSelected && <div className={S.control}>
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
            <ActionButton
                name={isDone ? 'Uncomplete' : 'Complete'}
                icon={isDone ? '❎' : '✅'}
                onClickCallback={() => completeList(id, !isDone)}
                tooltips={showTooltips}
            />
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
            {tasks.length > 1 && <ActionButton
                name="Split"
                icon="💔"
                onClickCallback={() => splitList(id)}
                tooltips={showTooltips}
            />}
            <ActionButton
                name="View"
                icon="👀"
                onClickCallback={() => viewList(id)}
                tooltips={showTooltips}
            />
            <ActionButton
                name="Delete"
                icon="❌"
                onClickCallback={deleteListHandler}
                important
                tooltips={showTooltips}
            />
        </div>}
        <p className={S.listId}>List ID: {id}</p>
        <ol className={S.tasks}>
            {tasksElements.length > 0 ? tasksElements :
                <span>The task list is empty for now. Added tasks will be displayed here.</span>}
        </ol>
        <Input
            inputValue={inputTaskName}
            onChangeCallback={inputTaskNameChange}
            placeholder={'Enter new task'}
        />
        <Button
            name="Add new task"
            onClick={addTaskHandler}
        />
    </div>
}