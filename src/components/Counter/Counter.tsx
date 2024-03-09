import s from './Counter.module.css'

export type CounterType = {
    id: string
    name: string
    initialCount: number
    currentCount: number
    limitCount: number
    setCount: (counterId: string, count: number) => void
    isDone: boolean
}

export const Counter = ({
                            id,
                            name,
                            initialCount,
                            currentCount,
                            limitCount,
                            setCount,
                            isDone,
                        }: CounterType) => <div className={s.counter}>
    <h3>{name}</h3>
    <div className={s.control}>
        <button onClick={() => setCount(id, --currentCount)}>-</button>
        <span className={s.count}>{currentCount}</span>
        <button onClick={() => setCount(id, ++currentCount)}>+</button>
    </div>
    <button onClick={() => setCount(id, 0)}>Reset</button>
</div>