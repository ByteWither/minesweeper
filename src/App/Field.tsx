import React from "react"

export interface StandardComponentProps {
    value: number
}

export function Field({ value }: StandardComponentProps) {
    return <button>{value}</button>
}
