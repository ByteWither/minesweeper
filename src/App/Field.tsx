import React from "react"

export interface StandardComponentProps {
    x: number
    y: number
}

export function Field({ x, y }: StandardComponentProps) {
    return (
        <button>
            {x}
            {y}
        </button>
    )
}
