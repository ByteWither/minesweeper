import React from "react"
import { Field, States } from "./Field"
import { cloneDeep } from "lodash"
import "../Sass/blocks/board.sass"

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
}

const openEmptyCell = (board: board, x: number, y: number) => {
    const steps = [
        [0, -1],
        [0, +1],
        [-1, 0],
        [+1, 0],
    ]
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            steps.forEach(([stepX, stepY]) => {
                const stepCoords = stepX + stepY
                const coords = j + i

                if (
                    stepCoords === coords &&
                    board?.[x + j]?.[y + i] &&
                    !board[x + j][y + i].isMine &&
                    !board[x + j][y + i].opened &&
                    !board[x + j][y + i].flagged &&
                    board[x][y].minesAround === 0
                ) {
                    if (board[x + j][y + i].minesAround === 0) {
                        board[x + j][y + i].opened = true
                    }
                    openEmptyCell(board, x + j, y + i)
                } else if (
                    board?.[x + j]?.[y + i] &&
                    !board[x + j][y + i].isMine &&
                    !board[x + j][y + i].opened &&
                    !board[x + j][y + i].flagged &&
                    board[x][y].minesAround === 0
                ) {
                    if (board[x + j][y + i].minesAround > 0 && board[x][y].opened) {
                        board[x + j][y + i].opened = true
                    }
                }
            })
        }
    }
}

const getPointsAround = (x: number, y: number) => {
    const result: Array<[number, number]> = []
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            result.push([x + i, y + j])
        }
    }
    return result
}

const getOpenedCells = (board: board, countOpenCells: number) => {
    board.forEach((row) => {
        row.map((cell) => {
            if (cell.opened) {
                countOpenCells--
            }
        })
    })
    return countOpenCells
}

const getMinesCells = (board: board) => {
    board.forEach((row) => {
        row.map((cell) => {
            if (cell.isMine) {
                cell.opened = true
            }
        })
    })
}

type boardProps = {
    difficulty: string
}

export function Board({ difficulty }: boardProps) {
    const firstStep = React.useRef<boolean>(true)
    // const [difficultyLevel, setDifficultyLevel] = React.useState(difficulty)
    const [userBoard, setUserBoard] = React.useState<board>([])

    let ROWS: number
    let CELLS: number
    let MINESCOUNT: number

    console.log(difficulty)

    switch (difficulty) {
        case "Easy":
            ROWS = 9
            CELLS = 9
            MINESCOUNT = 10
            break
        case "Normal":
            ROWS = 16
            CELLS = 16
            MINESCOUNT = 40
            break
        case "Hard":
            ROWS = 30
            CELLS = 16
            MINESCOUNT = 99
            break
    }
    const countOpenCells = React.useRef(ROWS * CELLS - MINESCOUNT)

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
        const minesData: Array<[number, number]> = []
        const around = getPointsAround(excludeX, excludeY)

        while (MINESCOUNT > 0) {
            const mine = generateMine(CELLS, ROWS)

            if (
                !around.some(
                    (aroundMine) => aroundMine[0] === mine[0] && aroundMine[1] === mine[1],
                ) &&
                !minesData.some((existMine) => existMine[0] === mine[0] && existMine[1] === mine[1])
            ) {
                minesData.push(mine)
                MINESCOUNT--
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
    }

    const leftHandle = (x: number, y: number) => {
        if (firstStep.current) {
            setMines(x, y)
            firstStep.current = false
            userBoard[x][y].opened = true
        }

        setUserBoard((prevState) => {
            const mutateBoard = cloneDeep(prevState)

            openEmptyCell(mutateBoard, x, y)

            return mutateBoard
        })

        setUserBoard((prevState) => {
            const mutateBoard = cloneDeep(prevState)

            if (mutateBoard[x][y].isMine && !mutateBoard[x][y].flagged) {
                console.log("Game over")
                getMinesCells(mutateBoard)
                return mutateBoard
            }

            if (!mutateBoard[x][y].flagged) {
                mutateBoard[x][y].opened = true
            }

            return mutateBoard
        })

        setUserBoard((prevState) => {
            const mutateBoard = cloneDeep(prevState)
            let count = getOpenedCells(mutateBoard, countOpenCells.current)

            if (count === 0) {
                console.log("Win!")
            }

            return mutateBoard
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
        }
        return null
    }

    const getActualNumber = (x: number, y: number) => {
        const field = userBoard[x][y]

        if (field.minesAround > 0) {
            return field.minesAround
        }
        return null
    }

    const openBombs = (x: number, y: number) => {
        const field = userBoard[x][y]

        if (field.opened && field.isMine) {
            return true
        }
        return false
    }

    const getClass = (x: number, y: number) => {
        const field = userBoard[x][y]

        if (field.opened) {
            return "field field-opened"
        }

        return "field"
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
                            minesAround={getActualNumber(rowIndex, cellIndex)}
                            openBombs={openBombs(rowIndex, cellIndex)}
                            className={getClass(rowIndex, cellIndex)}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}
