import React from "react"
import { Board } from "./Board"
import { Face, FaceTypes } from "./Face"
import { Select } from "./Select"

const DIFFICULTIES: Select = [
    { value: "easy", title: "Easy" },
    { value: "normal", title: "Normal" },
    { value: "hard", title: "Hard" },
]

export function App() {
    const [diff, setDiff] = React.useState<string>("easy")
    const [gameState, setGameState] = React.useState<FaceTypes>(null)

    const changeDifficulty = React.useCallback((value: string) => {
        setDiff(value)
    }, [])

    const changeEmoji = React.useCallback((value: FaceTypes) => {
        setGameState(value)
    }, [])

    return (
        <>
            <div className="menu">
                <Select options={DIFFICULTIES} value={diff} onChange={changeDifficulty} />
                <Face state={gameState} />
            </div>
            <Board difficulty={diff} onGameState={changeEmoji} />
        </>
    )
}
