import {v1} from 'uuid'
import {DataType} from '../components/dashboard/Dashboard'

const mockListId1 = v1()
const mockListId2 = v1()
const mockListId3 = v1()
const mockListId4 = v1()
const mockListId5 = v1()
const mockListId6 = v1()
const mockListId7 = v1()
const mockListId8 = v1()

export const mockLists: DataType = [
    {
        id: mockListId1,
        name: 'Список продуктов',
        isDone: false,
        isPinned: true,
        isSelected: false,
    },
    {
        id: v1(),
        name: 'Exercises',
        initialCount: 0,
        currentCount: 0,
        limitCount: 10,
        isDone: false,
    },
    {
        id: mockListId2,
        name: 'Надо изучить',
        isDone: false,
        isPinned: true,
        isSelected: false,
    },
    {
        id: mockListId3,
        name: 'Докупить',
        isDone: false,
        isPinned: false,
        isSelected: false,
    },
    {
        id: mockListId4,
        name: 'Доделать в проекте',
        isDone: false,
        isPinned: false,
        isSelected: false,
    },
    {
        id: mockListId5,
        name: 'Пустой список без названия',
        isDone: false,
        isPinned: false,
        isSelected: false,
    },
    {
        id: mockListId6,
        name: 'Почитать',
        isDone: false,
        isPinned: false,
        isSelected: false,
    },
    {
        id: mockListId7,
        name: 'Ремонт',
        isDone: true,
        isPinned: false,
        isSelected: false,
    },
    {
        id: mockListId8,
        name: 'Посмотреть',
        isDone: true,
        isPinned: false,
        isSelected: false,
    },
]

export const mockedTasks = {
    [mockListId1]: [
        {
            id: v1(),
            listId: mockListId1,
            name: 'Хлеб',
            isDone: false,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId1,
            name: 'Макароны',
            isDone: false,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId1,
            name: 'Молоко',
            isDone: false,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId1,
            name: 'Овощи',
            isDone: false,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId1,
            name: 'Сладости',
            isDone: false,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId1,
            name: 'Орехи',
            isDone: false,
            isSelected: false,
        },
    ],
    [mockListId2]: [
        {
            id: v1(),
            listId: mockListId2,
            name: 'HTML',
            isDone: true,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId2,
            name: 'CSS',
            isDone: false,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId2,
            name: 'Native',
            isDone: false,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId2,
            name: 'React',
            isDone: false,
            isSelected: false,
        },
    ],
    [mockListId3]: [
        {
            id: v1(),
            listId: mockListId3,
            name: 'Масло',
            isDone: false,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId3,
            name: 'Огурцы',
            isDone: false,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId3,
            name: 'Помидоры',
            isDone: true,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId3,
            name: 'Яблоки',
            isDone: true,
            isSelected: false,
        },
    ],
    [mockListId4]: [
        {
            id: v1(),
            listId: mockListId4,
            name: 'Имутабельность',
            isDone: true,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId4,
            name: 'Случайный задний фон по клику кнопки',
            isDone: false,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId4,
            name: 'Ассоциативные массивы',
            isDone: true,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId4,
            name: 'Удалить все листы разом',
            isDone: false,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId4,
            name: 'Меню-гамбургер',
            isDone: false,
            isSelected: false,
        },
    ],
    [mockListId5]: [],
    [mockListId6]: [
        {
            id: v1(),
            listId: mockListId6,
            name: 'Маршрутизация в реакте',
            isDone: false,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId6,
            name: 'Сравнение ссылок под капотом',
            isDone: false,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId6,
            name: 'Многопоточность',
            isDone: false,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId6,
            name: 'Асинхронные функции',
            isDone: false,
            isSelected: false,
        },
    ],
    [mockListId7]: [
        {
            id: v1(),
            listId: mockListId7,
            name: 'Выбрать обои',
            isDone: true,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId7,
            name: 'Разобрать старую мебель',
            isDone: true,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId7,
            name: 'Собрать новую кухню',
            isDone: true,
            isSelected: false,
        },
    ],
    [mockListId8]: [
        {
            id: v1(),
            listId: mockListId8,
            name: 'Вёрстка на Styled Components',
            isDone: true,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId8,
            name: 'TDD подход к разработке',
            isDone: true,
            isSelected: false,
        },
        {
            id: v1(),
            listId: mockListId8,
            name: 'ООП, СОЛИД и вот это вот всё',
            isDone: true,
            isSelected: false,
        },
    ],
}