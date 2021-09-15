import React from "react"
import "../Sass/components/field.sass"

export type States = "bomb" | "flag" | "opened" | number
type FieldProps = {
    x: number
    y: number
    state: States
    leftClick: (x: number, y: number) => void
    rightClick: (x: number, y: number) => void
}

export function Field({ x, y, state, leftClick, rightClick }: FieldProps) {
    const getState = () => {
        if (typeof state === "number") {
            return "" + state
        }

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
        <button className="field" onClick={leftClickHandle} onContextMenu={rightClickHandle}>
            {getState()}
            {/* {x}
            {y} */}
        </button>
    )
}
