import { ChangeEventHandler } from "react"
import "./index.sass"

export type SelectOption = { value: string; title: string }

interface SelectProps {
    value: string
    options: SelectOption[]
    onChange: (value: string) => void
}

export function Select({ value, options, onChange }: SelectProps) {
    const changeHandler: ChangeEventHandler<HTMLSelectElement> = (event) => {
        onChange(event.target.value)
    }

    return (
        <div className="select">
            <select value={value} onChange={changeHandler}>
                {options.map((option) => {
                    return (
                        <option key={option.value} value={option.value}>
                            {option.title}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}
