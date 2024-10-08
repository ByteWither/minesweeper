import { memo, useCallback, useEffect, useRef, useState } from "react"
import { Field, States } from "@/Components/Field"
import "./index.sass"

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

const getMinesCells = (board: board) => {
    board.forEach((row) => {
        row.map((cell) => {
            if (cell.isMine) {
                if (cell.flagged) {
                    cell.flagged = false
                }
                cell.opened = true
            }
        })
    })
}

type gameStateTypes = "lose" | "win" | "game" | "start"

type boardProps = {
    difficulty: string
    onGameState: (state: gameStateTypes) => void
    getReset: (resetter: () => void) => void
}

function BoardComponent({ difficulty, onGameState, getReset = null }: boardProps) {
    const firstStep = useRef<boolean>(true)
    const [userBoard, setUserBoard] = useState<board>([])

    const rows = useRef<number>(9)
    const cells = useRef<number>(9)
    const minesCount = useRef<number>(10)

    const countOpenCells = useRef(rows.current * cells.current - minesCount.current)

    const boardFill = () => {
        clearBoard()
        const board: board = []
        for (let r = 0; r < rows.current; r++) {
            const rowsData: Array<boardItem> = []
            for (let c = 0; c < cells.current; c++) {
                rowsData.push({
                    isMine: false,
                    minesAround: 0,
                    flagged: false,
                    opened: false,
                })
            }

            board.push(rowsData)
        }
        setUserBoard(board)
    }

    useEffect(() => {
        switch (difficulty) {
            case "easy":
                rows.current = 9
                cells.current = 9
                minesCount.current = 10
                break
            case "normal":
                rows.current = 16
                cells.current = 16
                minesCount.current = 40
                break
            case "hard":
                rows.current = 20
                cells.current = 20
                minesCount.current = 99
                break
        }
        countOpenCells.current = rows.current * cells.current - minesCount.current
        boardFill()
    }, [difficulty])

    useEffect(() => {
        if (userBoard.length) {
            if (userBoard.some((row) => row.some((cell) => cell.isMine && cell.opened))) {
                onGameState("lose")
            } else if (
                userBoard.every((row) =>
                    row.every((cell) => (!cell.isMine && cell.opened) || cell.isMine),
                )
            ) {
                onGameState("win")
            }
        }
    }, [userBoard])

    const clearBoard = () => {
        firstStep.current = true
        onGameState("start")

        setUserBoard((prevState) => {
            const mutateBoard = structuredClone(prevState)

            mutateBoard.map((item) => {
                item.map((cell) => {
                    cell.isMine = false
                    cell.minesAround = 0
                    cell.flagged = false
                    cell.opened = false
                })
            })

            return mutateBoard
        })
    }

    useEffect(() => {
        if (getReset) getReset(clearBoard)
    }, [getReset])

    const setMines = (excludeX: number, excludeY: number) => {
        clearBoard()
        const minesData: Array<[number, number]> = []
        const around = getPointsAround(excludeX, excludeY)
        const countMines = minesCount.current

        while (minesCount.current > 0) {
            const mine = generateMine(cells.current, rows.current)

            if (
                !around.some(
                    (aroundMine) => aroundMine[0] === mine[0] && aroundMine[1] === mine[1],
                ) &&
                !minesData.some((existMine) => existMine[0] === mine[0] && existMine[1] === mine[1])
            ) {
                minesData.push(mine)
                minesCount.current--
            }
        }

        minesCount.current = countMines

        setUserBoard((prevState) => {
            const mutateBoard = structuredClone(prevState)

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

    const leftHandle = useCallback((x: number, y: number) => {
        if (firstStep.current) {
            setMines(x, y)
            onGameState("game")
            firstStep.current = false
        }

        setUserBoard((prevState) => {
            if (!prevState[x][y].opened && !prevState[x][y].flagged) {
                const mutateBoard = structuredClone(prevState)
                mutateBoard[x][y].opened = true

                if (mutateBoard[x][y].isMine) {
                    getMinesCells(mutateBoard)
                } else {
                    openEmptyCell(mutateBoard, x, y)
                }

                return mutateBoard
            }

            return prevState
        })
    }, [])

    const rightHandle = useCallback((x: number, y: number) => {
        setUserBoard((prevState) => {
            if (!prevState[x][y].opened) {
                const mutateBoard = structuredClone(prevState)

                mutateBoard[x][y].flagged = !mutateBoard[x][y].flagged

                return mutateBoard
            }
            return prevState
        })
    }, [])

    const getActualState = (x: number, y: number): States => {
        const field = userBoard[x][y]

        if (field.isMine && field.opened) {
            return "bomb"
        } else if (field.opened) {
            return "opened"
        } else if (field.flagged) {
            return "flag"
        } else {
            return null
        }
    }

    const getMinesAround = (x: number, y: number) => {
        const field = userBoard[x][y]

        if (field.opened) {
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
                            minesAround={getMinesAround(rowIndex, cellIndex)}
                        />
                    ))}
                </div>
            ))}
            <h1>{}</h1>
        </div>
    )
}

export const Board = memo(BoardComponent)
