import React from "react"
import { Field } from "./Field"

function boardRow(i: number) {
    const fields = []
    for (let j: number = 0; j < 10; j++) {
        fields.push(<Field key={j.toString()} x={j} y={i}></Field>)
    }
    return fields
}

function fields() {
    const rows = []
    for (let i: number = 0; i < 10; i++) {
        rows.push(<div className="board-row">{boardRow(i)}</div>)
    }
    return rows
}

export function Board() {
    return <div className="board">{fields()}</div>
}
