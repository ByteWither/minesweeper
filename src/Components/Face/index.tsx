import React from "react"

export type FaceTypes = "lose" | "win" | "game"

type stateList = {
    [key in FaceTypes]: string
}

const STATE_LIST: stateList = {
    lose: "💀",
    win: "😎",
    game: "🙂",
}

type faceProps = {
    state: FaceTypes
    onResetGame: () => void
}

export function Face({ state, onResetGame }: faceProps) {
    require("./index.sass")

    const onClick = () => {
        onResetGame()
    }

    return (
        <div className="face">
            <button onClick={onClick}>{STATE_LIST[state]}</button>
        </div>
    )
}
