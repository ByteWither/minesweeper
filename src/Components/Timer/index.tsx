import React from "react"
import { FaceTypes } from "@/Components/Face"

type timerProp = {
    state: FaceTypes
}

export function Timer({ state }: timerProp) {
    const timerBlock = React.useRef<HTMLSpanElement>()

    const timer = React.useRef<number>(0)
    const timerValue = React.useRef<number>(0)

    const startGame = React.useCallback(() => {
        timer.current = window.setInterval(() => {
            timerValue.current += 1000

            const minutes = Math.floor(timerValue.current / 60000)
            const seconds = (timerValue.current - minutes * 60000) / 1000

            timerBlock.current.textContent = `${minutes < 10 ? `0${minutes}` : minutes}:${
                seconds < 10 ? `0${seconds}` : seconds
            }`
        }, 1000)
    }, [])

    const endGame = React.useCallback(() => {
        clearInterval(timer.current)
        timerValue.current = 0
    }, [])

    React.useEffect(() => {
        switch (state) {
            case "lose":
                endGame()
                break
            case "win":
                endGame()
                break
            case "game":
                startGame()
                break
            case "start":
                endGame()
                timerBlock.current.innerText = `00:00`
        }
    }, [state])

    return (
        <div>
            <span ref={timerBlock} />
        </div>
    )
}
