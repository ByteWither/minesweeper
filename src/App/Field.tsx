import React from "react"
import "../Sass/components/field.sass"

export type States = "bomb" | "flag" | "opened"
type FieldProps = {
    x: number
    y: number
    state: States
    leftClick: (x: number, y: number) => void
    rightClick: (x: number, y: number) => void
    minesAround: number
    className: string
}

export function Field({ x, y, state, leftClick, rightClick, minesAround, className }: FieldProps) {
    const getState = () => {
        if (state === "opened") {
            if (minesAround) {
                return minesAround
            }
            return null
        }

        switch (state) {
            case "flag":
                return "🚩"

            case "bomb":
                return null

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
        <button className={className} onClick={leftClickHandle} onContextMenu={rightClickHandle}>
            {getState()}
        </button>
    )
}
