import { StrictMode, useCallback, useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import { Board } from "@/Components/Board"
import { Face, FaceTypes } from "@/Components/Face"
import { Select } from "@/Components/Select"
import { Timer } from "@/Components/Timer"
import "./index.sass"

const DIFFICULTIES: Select = [
    { value: "easy", title: "Easy" },
    { value: "normal", title: "Normal" },
    { value: "hard", title: "Hard" },
]

function App() {
    const [diff, setDiff] = useState<string>("easy")
    const [gameState, setGameState] = useState<FaceTypes>("start")
    const gameResetFn = useRef<() => void>()

    const changeDifficulty = useCallback((value: string) => {
        setDiff(value)
    }, [])

    const changeEmoji = useCallback((value: FaceTypes) => {
        setGameState(value)
    }, [])

    const gameResetter = useCallback((resetter) => {
        gameResetFn.current = resetter
    }, [])

    const resetHandler = () => {
        gameResetFn.current()
    }

    return (
        <>
            <div className="menu">
                <Select options={DIFFICULTIES} value={diff} onChange={changeDifficulty} />
                <Face state={gameState} onResetGame={resetHandler} />
                <Timer state={gameState} />
            </div>
            <Board difficulty={diff} onGameState={changeEmoji} getReset={gameResetter} />
        </>
    )
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
