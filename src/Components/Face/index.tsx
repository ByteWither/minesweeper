import "./index.sass"

export type FaceTypes = "lose" | "win" | "game" | "start"

type stateList = {
    [key in FaceTypes]: string
}

const STATE_LIST: stateList = {
    lose: "💀",
    win: "😎",
    game: "🙂",
    start: "🙂",
}

type faceProps = {
    state: FaceTypes
    onResetGame: () => void
}

export function Face({ state, onResetGame }: faceProps) {
    const onClick = () => {
        onResetGame()
    }

    return (
        <div className="face">
            <button onClick={onClick}>{STATE_LIST[state]}</button>
        </div>
    )
}
