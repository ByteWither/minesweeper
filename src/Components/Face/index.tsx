import React from "react"

export type FaceTypes = "lose" | "win"

type stateList = {
    [key in FaceTypes]: string
}

const STATE_LIST: stateList = {
    lose: "💀",
    win: "😎",
    // game: "🙂",
}

type faceProps = {
    state: FaceTypes
}

export function Face({ state }: faceProps) {
    require("./index.sass")

    return (
        <div>
            <button>{STATE_LIST[state]}</button>
        </div>
    )
}
