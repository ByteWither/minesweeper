import { memo } from "react"
import "./index.sass"

export type States = "flag" | "opened" | "bomb"
type FieldProps = {
    x: number
    y: number
    state: States
    leftClick: (x: number, y: number) => void
    rightClick: (x: number, y: number) => void
    minesAround: number
}

function FieldComponent({
    x = 0,
    y = 0,
    state = null,
    leftClick = null,
    rightClick = null,
    minesAround = 0,
}: FieldProps) {
    const getState = () => {
        switch (state) {
            case "flag":
                return "🚩"
            case "bomb":
                return "💣"
            case "opened":
                return minesAround || null
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

    let className = "field"

    if (state === "bomb") className += " field--bomb"
    if (state === "opened") className += " field--opened"

    return (
        <button className={className} onClick={leftClickHandle} onContextMenu={rightClickHandle}>
            {getState()}
        </button>
    )
}

export const Field = memo(FieldComponent)
