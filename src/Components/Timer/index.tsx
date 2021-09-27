import React from "react"
import { FaceTypes } from "Components/Face"

type timerProp = {
    state: FaceTypes
}

function TimerComponent({ state }: timerProp) {
    const seconds = React.useRef(0)
    const minute = React.useRef(0)
    const [secondValue, setSecondValue] = React.useState(seconds.current)
    const [minuteValue, setMinuteValue] = React.useState(minute.current)
    let timer: NodeJS.Timer

    const startGame = React.useCallback(() => {
        timer = setInterval(() => {
            setSecondValue((prevState) => {
                prevState++
                if (prevState !== 0 && prevState % 10 === 0) {
                    setMinuteValue(minute.current++)
                    prevState = 0
                }
                return prevState
            })
        }, 1000)
    }, [])

    const endGame = React.useCallback(() => {
        clearInterval(timer)
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
                setSecondValue((seconds.current = 0))
                setMinuteValue((minute.current = 0))
        }
    }, [state])

    return (
        <div>
            <p>
                {minuteValue}:{secondValue}
            </p>
        </div>
    )
}

export const Timer = React.memo(TimerComponent)
