import React from "react"

type timerProp = {
    seconds: number
    minute: number
}

export function Timer({ seconds = 0, minute = 0 }: timerProp) {
    return (
        <div>
            <p>
                {minute}:{seconds}
            </p>
        </div>
    )
}
