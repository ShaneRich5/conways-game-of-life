import React, { useEffect, useState } from 'react'

const generateGrid = (rowCount: number, columnCount: number) => {
  let gridBuilder: any = []

  for (let row = 0; row < rowCount; row++) {
    gridBuilder.push([])

    for (let column = 0; column < columnCount; column++) {
      gridBuilder[row].push({ row, column, populated: false })
    }
  }

  return gridBuilder
}

function App() {
  const rowCount = 30
  const columnCount = 30
  const [grid, setGrid] = useState<any>(null)
  const [cells, setCells] = useState<any>({})
  const [isActive, setIsActive] = useState(false)
  const [generation, setGeneration] = useState(0)

  
  const createNextGeneration = () => {
    const updatedCells: any = {}
    const emptyCells: any = {}

    for (let key in cells) {
      const { x, y } = cells[key]

      const neighbors = [
        { x: x - 1, y: y}, // top
        { x: x + 1, y: y}, // bottom
        { x: x, y: y - 1}, // left
        { x: x, y: y + 1}, // right
        { x: x - 1, y: y - 1}, // top left
        { x: x - 1, y: y + 1}, // top right
        { x: x + 1, y: y - 1}, // bottom left
        { x: x + 1, y: y + 1}, // bottom right
      ]

      let populatedNeighborCount = 0

      for (let neighbor of neighbors) {
        const { x: neighborX, y: neighborY } = neighbor
        const neighborKey = `${neighborX}-${neighborY}`

        if (neighborKey in cells) {
          populatedNeighborCount++
        } else {
          emptyCells[neighborKey] = { x: neighborX, y: neighborY }
        }
      }

      if (populatedNeighborCount === 2 || populatedNeighborCount === 3) {
        updatedCells[key] = { x, y }
      }
    }

    for (let key in emptyCells) {
      const { x, y } = emptyCells[key]

      const neighbors = [
        { x: x - 1, y: y}, // top
        { x: x + 1, y: y}, // bottom
        { x: x, y: y - 1}, // left
        { x: x, y: y + 1}, // right
        { x: x - 1, y: y - 1}, // top left
        { x: x - 1, y: y + 1}, // top right
        { x: x + 1, y: y - 1}, // bottom left
        { x: x + 1, y: y + 1}, // bottom right
      ]

      let populatedNeighborCount = 0

      for (let neighbor of neighbors) {
        const { x: neighborX, y: neighborY } = neighbor
        const neighborKey = `${neighborX}-${neighborY}`

        if (neighborKey in cells) {
          populatedNeighborCount++
        } else {
          emptyCells[neighborKey] = { x: neighborX, y: neighborY }
        }
      }

      if (populatedNeighborCount === 3) {
        updatedCells[key] = { x, y }
      }
    }
    
    setGeneration(generation + 1)
    setCells(updatedCells)
  }

  useEffect(() => {
    let gridBuilder = generateGrid(rowCount, columnCount)
    setGrid(gridBuilder)
  }, [rowCount, columnCount])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isActive) {
      intervalId = setInterval(() => {
        createNextGeneration()
      }, 1000)
    }

    return () => clearInterval(intervalId)
  }, [isActive, cells, createNextGeneration])

  const isCellPopulated = (row: number, column: number) => {
    var key = `${row}-${column}`
    return key in cells
  }

  const toggleCellSelection = (x: number, y: number) => {
    var key = `${x}-${y}`
    var cached: any = Object.assign({}, cells)

    if (key in cached) {
      delete cached[key]
    } else {
      cached[key] = { x, y }
    }

    setCells(cached)
  }

  const clearBoard = () => {
    setIsActive(false)
    setCells({})
    setGeneration(0)
  }
  
  return (
    <div>
      <div className="table">
        <div className="table-row-group">
          {grid && grid.map((tableRow: any, rowIdx: number) => (
            <div className="table-row" key={`row-${rowIdx}`}>
              {tableRow.map(({ row, column }: any) => (
                <div
                  key={`r${row}-c${column}`}
                  onClick={() => toggleCellSelection(row, column)}
                  className={`${isCellPopulated(row, column) ? 'bg-blue-300' : ''} table-cell border-solid border-2 border-light-blue-500 w-8 h-8`}
                ></div>    
              ))}
            </div>  
          ))}
        </div>
      </div>
      <div>
        <div className="m-4 space-x-2">
          <button
            type="button"
            disabled={isActive}
            onClick={() => createNextGeneration()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >Next Generation</button>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >{isActive ? 'Pause' : 'Start'}</button>
          <button
            type="button"
            onClick={() => clearBoard()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >Reset</button>
          <span>Generation: {generation}</span>
          <span>Population: {Object.keys(cells).length}</span>
        </div>
      </div>
    </div>
  );
}

export default App
