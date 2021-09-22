import React from "react"
import ReactDOM from "react-dom"
import { Board } from "Components/Board"
import { Face, FaceTypes } from "Components/Face"
import { Select } from "Components/Select"

const DIFFICULTIES: Select = [
    { value: "easy", title: "Easy" },
    { value: "normal", title: "Normal" },
    { value: "hard", title: "Hard" },
]

function App() {
    const [diff, setDiff] = React.useState<string>("easy")
    const [gameState, setGameState] = React.useState<FaceTypes>(null)

    const changeDifficulty = React.useCallback((value: string) => {
        setDiff(value)
    }, [])

    const changeEmoji = React.useCallback((value: FaceTypes) => {
        setGameState(value)
    }, [])

    require("./index.sass")

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

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root"),
)
