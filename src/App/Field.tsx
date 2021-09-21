import React from "react"
import "../Sass/components/field.sass"

export type States = "flag" | "opened"
type FieldProps = {
    x: number
    y: number
    state: States
    leftClick: (x: number, y: number) => void
    rightClick: (x: number, y: number) => void
    minesAround: number
    openBombs: boolean
    className: string
}

export function Field({
    x,
    y,
    state,
    leftClick,
    rightClick,
    minesAround,
    openBombs,
    className,
}: FieldProps) {
    const getState = () => {
        if (state === "opened") {
            if (minesAround) {
                return minesAround
            }
            if (openBombs) {
                return "💣"
            }
            return null
        }

        switch (state) {
            case "flag":
                return "🚩"
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
