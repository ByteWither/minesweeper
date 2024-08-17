import { GameStates, STATE_LIST } from "@/Components/Menu"
import "./index.sass"

interface FaceProps {
    gameState: GameStates
    onResetGame: () => void
}

export function Face({ gameState, onResetGame }: FaceProps) {
    const onClick = () => {
        onResetGame()
    }

    return (
        <div className="face">
            <button onClick={onClick} className="face__button">
                {STATE_LIST[gameState]}
            </button>
        </div>
    )
}
