import React from "react"
import { Field, States } from "./Field"
import { cloneDeep } from 'lodash'

const ROWS = 10
const CELLS = 10

type boardItem = {
    isMine: boolean
    minesAround: number
    flagged: boolean
    opened: boolean
}
type board = Array<Array<boardItem>>

export function Board() {
    // const [firstStep, setFirstStep] = React.useState<boolean>(true)

    const [userBoard, setUserBoard] = React.useState<board>([])

    const boardFill = () => {
        const board: board = []
        for (let r = 0; r < ROWS; r++) {
            const rows: Array<boardItem> = []
            for (let c = 0; c < CELLS; c++) {
                rows.push({
                    isMine: false,
                    minesAround: 5,
                    flagged: false,
                    opened: false,
                })
            }
            board.push(rows)
        }
        // console.log(board)
        setUserBoard(board)
    }

    React.useEffect(() => {
        boardFill()
    }, [])

    const leftHandle = (x: number, y: number) => {
        console.log(x, y)
        setUserBoard((prevState) => {
            const mutateBoard = cloneDeep(prevState)

            mutateBoard[x][y].opened = true
            
            return mutateBoard
        })
    }

    const rightHandle = (x: number, y: number) => {
        setUserBoard((prevState) => {
            const mutateBoard = cloneDeep(prevState)

            mutateBoard[x][y].flagged = !mutateBoard[x][y].flagged

            return mutateBoard
        })
    }

    const getActualState = (x: number, y: number): States => {
        const field = userBoard[x][y]
        if (field.flagged) {
            return "flag"
        } else if (field.opened) {
            return "opened"
        } else if (field.isMine) {
            return "bomb"
        }
        return null
    }

    // const generateBoard = () => {
    //     console.log("Board generated!")
    // }

    // if (firstStep === true) {
    //     generateBoard()
    // }

    return (
        <div className="board">
            {userBoard.map((cells, rowIndex) => (
                <div className="board-row" key={rowIndex}>
                    {cells.map((_cell, cellIndex) => (
                        <Field
                            key={"" + cellIndex + rowIndex}
                            x={rowIndex}
                            y={cellIndex}
                            state={getActualState(rowIndex, cellIndex)}
                            leftClick={leftHandle}
                            rightClick={rightHandle}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}
