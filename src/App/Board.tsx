import React from "react"
import { Field, States } from "./Field"
import { cloneDeep, toNumber } from "lodash"
import "../Sass/blocks/board.sass"

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
                    minesAround: 0,
                    flagged: false,
                    opened: false,
                })
            }
            board.push(rows)
        }
        setUserBoard(board)
    }

    React.useEffect(() => {
        boardFill()
    }, [])

    const clearBoard = () => {
        setUserBoard((prevState) => {
            prevState.map((item) => {
                item.map((cell) => {
                    cell.flagged = false
                })
            })
            return prevState
        })
    }

    const hasNeighbors = (x: number, y: number) => {
        const neighbors = []

        // ничего более изящного я пока не придумал :(
        if (userBoard[x][y + 1]) {
            neighbors.push(!userBoard[x][y + 1].isMine)
        }
        if (userBoard[x + 1] && userBoard[x + 1][y + 1]) {
            neighbors.push(!userBoard[x + 1][y + 1].isMine)
        }
        if (userBoard[x + 1] && userBoard[x + 1][y]) {
            neighbors.push(!userBoard[x + 1][y].isMine)
        }
        if (userBoard[x + 1] && userBoard[x + 1][y - 1]) {
            neighbors.push(!userBoard[x + 1][y - 1].isMine)
        }
        if (userBoard[x][y - 1]) {
            neighbors.push(!userBoard[x][y - 1].isMine)
        }
        if (userBoard[x - 1] && userBoard[x - 1][y - 1]) {
            neighbors.push(!userBoard[x - 1][y - 1].isMine)
        }
        if (userBoard[x - 1] && userBoard[x - 1][y]) {
            neighbors.push(!userBoard[x - 1][y].isMine)
        }
        if (userBoard[x - 1] && userBoard[x - 1][y + 1]) {
            neighbors.push(!userBoard[x - 1][y + 1].isMine)
        }

        let result = 1

        neighbors.map((cell) => {
            result *= toNumber(cell)
        })

        return result
    }

    const setMine = (x: number, y: number) => {
        setUserBoard((prevState) => {
            let mineCount = CELLS
            for (let c = 0; c < mineCount; c++) {
                const xMine = Math.floor(Math.random() * CELLS)
                const yMine = Math.floor(Math.random() * ROWS)

                if (!userBoard[xMine][yMine].opened && !userBoard[xMine][yMine].isMine) {
                    userBoard[xMine][yMine].isMine = true
                    console.log("Mine: ", xMine, yMine)

                    if (!hasNeighbors(x, y)) {
                        userBoard[xMine][yMine].isMine = false
                        mineCount++
                    }
                } else {
                    mineCount++
                }
            }
            return prevState
        })
    }

    const setCountMines = () => {
        setUserBoard((prevState) => {
            prevState.map((rows, rowIndex) => {
                rows.map((cell, cellIndex) => {
                    if (!cell.isMine && !hasNeighbors(rowIndex, cellIndex)) {
                        // userBoard[rowIndex][cellIndex].minesAround++
                        cell.minesAround++
                    }
                })
            })

            console.log(prevState)
            return prevState
        })
    }

    const generateBoard = (x: number, y: number) => {
        console.log("Board generated!")
        clearBoard()
        setMine(x, y)
        setCountMines()
    }

    const leftHandle = (x: number, y: number) => {
        console.log(x, y)

        //test
        if (userBoard[x][y].isMine) {
            console.log("You lose")
        }

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
            return "bomb"
        } else if (field.minesAround) {
            return field.minesAround
        }
        return null
    }

    return (
        <div className="board">
            {userBoard.map((cells, rowIndex) => (
                <div className="board-row" key={rowIndex}>
                    {cells.map((_cell, cellIndex) => (
                        <Field
                            key={"" + rowIndex + cellIndex}
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
