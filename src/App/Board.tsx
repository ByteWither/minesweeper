import React from "react"
import { Field } from "./Field"

function boardRow() {
    const fields = []
    for (let j: number = 0; j < 10; j++) {
        fields.push(<Field value={j}></Field>)
    }
    return fields
}

// function fields() {
//     const rows = []
//     for (let i: number = 0; i < 10; i++) {
//         rows.push(<div className="board-row">{}</div>)
//     }
//     return rows
// }

export function Board() {
    return <div className="board">{boardRow()}</div>
}
