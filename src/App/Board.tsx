import React from "react"
import { Field, States } from "./Field"
import { cloneDeep } from "lodash"

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
    const [_firstStep, setFirstStep] = React.useState<boolean>(true)
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

    const setMine = () => {
        setUserBoard((prevState) => {
            let mineCount = CELLS
            for (let c = 0; c < mineCount; c++) {
                const xMine = Math.floor(Math.random() * CELLS)
                const yMine = Math.floor(Math.random() * ROWS)

                if (!userBoard[xMine][yMine].opened && !userBoard[xMine][yMine].isMine) {
                    userBoard[xMine][yMine].isMine = true
                    console.log("Mine: ", xMine, yMine)
                } else {
                    mineCount++
                }
            }
            console.log(mineCount - CELLS)
            return prevState
        })
    }

    const generateBoard = (_x: number, _y: number) => {
        console.log("Board generated!")
        // const mutateBoard = cloneDeep(userBoard)
        setMine()
    }

    const leftHandle = (x: number, y: number) => {
        console.log(x, y)

        setUserBoard((prevState) => {
            const mutateBoard = cloneDeep(prevState)

            if (!mutateBoard[x][y].flagged) {
                mutateBoard[x][y].opened = true
            }

            return mutateBoard
        })

        setFirstStep((prevState) => {
            if (prevState) {
                generateBoard(x, y)
                prevState = false
            }
            return prevState
        })
    }

    const rightHandle = (x: number, y: number) => {
        setUserBoard((prevState) => {
            const mutateBoard = cloneDeep(prevState)

            if (!mutateBoard[x][y].opened) {
                mutateBoard[x][y].flagged = !mutateBoard[x][y].flagged
            }

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
            console.log("Bomb!")
            return "bomb"
        }
        return null
    }

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
