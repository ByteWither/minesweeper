import React, { useState } from "react"

export interface StandardComponentProps {
    x: number
    y: number
}

export function Field({ x, y }: StandardComponentProps) {
    const [click, setClick] = useState({ value: "" })

    function leftClick() {
        setClick({ value: "left!" })
    }

    function rightClick(e: React.MouseEvent) {
        e.preventDefault()
        setClick({ value: "🚩" })
    }

    return (
        <button onClick={leftClick} onContextMenu={rightClick}>
            {click.value} !{x}
            {y}!
        </button>
    )
}
