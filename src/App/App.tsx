import React from "react"
import { Board } from "./Board"
import { Select } from "./Select"

const DIFFICULTIES: Select = [
    { value: "easy", title: "Easy" },
    { value: "normal", title: "Normal" },
    { value: "hard", title: "Hard" },
]

export function App() {
    const [diff, setDiff] = React.useState<string>("easy")

    const changeDifficulty = (value: string) => {
        setDiff(value)
    }

    return (
        <>
            <Select options={DIFFICULTIES} value={diff} onChange={changeDifficulty} />
            <Board difficulty={diff} />
        </>
    )
}
