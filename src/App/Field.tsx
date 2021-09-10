import React, { useState } from "react"

export interface StandardComponentProps {
    x: number
    y: number
    hasBomb?: boolean
    isOpen?: boolean
    hasFlag?: boolean
}

export function Field({ x, y }: StandardComponentProps) {
    const [click, setClick] = useState({ value: "" })
    const [hasFlag, setHasFlag] = useState({ hasFlag: false })

    function leftClick() {
        setClick({ value: "left!" })
    }

    function rightClick(e: React.MouseEvent) {
        e.preventDefault()
        setClick({ value: "🚩" })
        hasFlag //idk
        setHasFlag({ hasFlag: true })
    }

    return (
        <button onClick={leftClick} onContextMenu={rightClick}>
            {click.value} !{x}
            {y}!
        </button>
    )
}
