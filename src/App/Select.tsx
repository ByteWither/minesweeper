import React from "react"

type value = string

export type Select = Array<{
    value: value
    title: string
}>

type selectProps = {
    value: value
    options: Select
    onChange?: (value: value) => void
}

export function Select({ value = null, options = [], onChange = null }: selectProps) {
    const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (onChange) onChange(e.target.value)
    }

    // const options: Array<string> = ["Easy", "Normal", "Hard"]

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
