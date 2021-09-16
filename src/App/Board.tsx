import React from "react"
import { Field, States } from "./Field"
import { cloneDeep } from "lodash"
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

const generateMine = (cellsCount: number, rowsCount: number): [number, number] => {
    return [Math.floor(Math.random() * cellsCount), Math.floor(Math.random() * rowsCount)]
}

const setMinesAroundCount = (board: board, x: number, y: number) => {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (board?.[x + j]?.[y + i]) {
                board[x + j][y + i].minesAround++
            }
        }
    }

    // //top
    // if (board?.[x]?.[y - 1]) {
    //     board[x][y - 1].minesAround++
    // }
    // // topRight
    // if (board?.[x + 1]?.[y - 1]) {
    //     board[x + 1][y - 1].minesAround++
    // }
    // //right
    // if (board?.[x + 1]?.[y]) {
    //     board[x + 1][y].minesAround++
    // }
    // // bottom right
    // if (board?.[x + 1]?.[y + 1]) {
    //     board[x + 1][y + 1].minesAround++
    // }
    // // bottom
    // if (board?.[x]?.[y + 1]) {
    //     board[x][y + 1].minesAround++
    // }
    // //bottom left
    // if (board?.[x - 1]?.[y + 1]) {
    //     board[x - 1][y + 1].minesAround++
    // }
    // //left
    // if (board?.[x - 1]?.[y]) {
    //     board[x - 1][y].minesAround++
    // }
    // //top left
    // if (board?.[x - 1]?.[y - 1]) {
    //     board[x - 1][y - 1].minesAround++
    // }
}

const firstOpening = (board: board, x: number, y: number) => {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (board?.[x + j]?.[y + i] && !board?.[x + j]?.[y + i].opened) {
                console.log(board[x + j][y + i].minesAround)
                if (board[x + j][y + i].minesAround > 0) {
                    let minesCount = board[x + j][y + i].minesAround
                    board[x + j][y + i].opened = true
                    board[x + j][y + i].minesAround = minesCount
                } else {
                    board[x + j][y + i].opened = true
                }
            }
        }
    }
    console.log(board)

    // if (!board?.[x]?.[y - 1].opened) {
    //     board[x][y - 1].opened = true
    // }
    // // topRight
    // if (!board?.[x + 1]?.[y - 1].opened) {
    //     board[x + 1][y - 1].opened = true
    // }
    // //right
    // if (!board?.[x + 1]?.[y].opened) {
    //     board[x + 1][y].opened = true
    // }
    // // bottom right
    // if (!board?.[x + 1]?.[y + 1].opened) {
    //     board[x + 1][y + 1].opened = true
    // }
    // // bottom
    // if (!board?.[x]?.[y + 1].opened) {
    //     board[x][y + 1].opened = true
    // }
    // //bottom left
    // if (!board?.[x - 1]?.[y + 1].opened) {
    //     board[x - 1][y + 1].opened = true
    // }
    // //left
    // if (!board?.[x - 1]?.[y].opened) {
    //     board[x - 1][y].opened = true
    // }
    // //top left
    // if (!board?.[x - 1]?.[y - 1].opened) {
    //     board[x - 1][y - 1].opened = true
    // }
}

// const hasNeighbors = (board: board, x: number, y: number) => {}

export function Board() {
    const firstStep = React.useRef<boolean>(true)
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
                    cell.isMine = false
                    cell.minesAround = 0
                    cell.flagged = false
                })
            })
            return prevState
        })
    }

    const setMines = (excludeX: number, excludeY: number) => {
        clearBoard()
        let minesCount = 10
        const minesData: Array<[number, number]> = []

        while (minesCount > 0) {
            const mine = generateMine(CELLS, ROWS)

            if (
                mine[0] !== excludeX &&
                mine[1] !== excludeY &&
                !minesData.some((existMine) => existMine[0] === mine[0] && existMine[1] === mine[1])
            ) {
                minesData.push(mine)
                minesCount--
            }
        }

        setUserBoard((prevState) => {
            const mutateBoard = cloneDeep(prevState)

            minesData.forEach(([mineX, mineY]) => {
                mutateBoard[mineX][mineY].isMine = true
                setMinesAroundCount(mutateBoard, mineX, mineY)
            })

            minesData.forEach(([mineX, mineY]) => {
                mutateBoard[mineX][mineY].minesAround = 0
            })

            return mutateBoard
        })

        setUserBoard((prevState) => {
            const mutateBoard = cloneDeep(prevState)

            if (mutateBoard[excludeX][excludeY].minesAround > 0) {
                setMines(excludeX, excludeY)
            }

            return mutateBoard
        })
    }

    const openAllCells = (x: number, y: number) => {
        setUserBoard((prevState) => {
            const mutateBoard = cloneDeep(prevState)

            firstOpening(mutateBoard, x, y)

            return mutateBoard
        })
    }

    const leftHandle = (x: number, y: number) => {
        if (firstStep.current) {
            setMines(x, y)
            openAllCells(x, y)
            firstStep.current = false
            userBoard[x][y].opened = true
        }

        setUserBoard((prevState) => {
            const mutateBoard = cloneDeep(prevState)

            if (mutateBoard[x][y].isMine) {
                console.log("Game over")
                return mutateBoard
            }

            if (mutateBoard[x][y].minesAround === 0 && !mutateBoard[x][y].flagged) {
                mutateBoard[x][y].opened = true
            }

            return mutateBoard
        })
    }

    const rightHandle = (x: number, y: number) => {
        setUserBoard((prevState) => {
            const mutateBoard = cloneDeep(prevState)

            if (!mutateBoard[x][y].opened && mutateBoard[x][y].minesAround === 0) {
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
