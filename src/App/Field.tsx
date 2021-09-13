import React from "react"

export type States = "bomb" | "flag" | "opened"
type FieldProps = {
    x: number
    y: number
    state: States
    leftClick: (x: number, y: number) => void
    rightClick: (x: number, y: number) => void
}

export function Field({ x, y, state, leftClick, rightClick }: FieldProps) {
    const getState = () => {
        switch (state) {
            case "opened":
                return "👍"

            case "flag":
                return "🚩"

            case "bomb":
                return "💣"

            default:
                return null
        }
    }

    const leftClickHandle = () => {
        leftClick(x, y)
    }

    const rightClickHandle = (e: React.MouseEvent) => {
        e.preventDefault()
        rightClick(x, y)
    }

    return (
        <button onClick={leftClickHandle} onContextMenu={rightClickHandle}>
            {getState()}
            {x}
            {y}
        </button>
    )
}
