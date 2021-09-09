import React from "react"

export interface StandardComponentProps {
    value: string
    x: number
    y: number
}

export function Field({ value, x, y }: StandardComponentProps) {
    function leftClick() {
        console.log("left!")
        return (value = "left")
    }

    function rightClick(e: React.MouseEvent) {
        e.preventDefault()
        console.log("right!")
        return (value = "right")
    }
    return (
        <button onClick={leftClick} onContextMenu={rightClick}>
            {value}!{x}
            {y}!
        </button>
    )
}
