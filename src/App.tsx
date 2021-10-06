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

const isCellPopulated = (r: number, c: number, grid: any) => {
  const maxRow = grid.length - 1
  const maxColumn = grid[0].length - 1

  if (r < 0 || r > maxRow || c < 0 || c > maxColumn) {
    return false
  }

  return grid[r][c]['populated']
}

const shouldKeepPopulatedCellAlive = (row: number, column: number, grid: any) => {
  let populatedNeighborCount = 0

  const adjacentPoints = [
    [row - 1, column],  // top
    [row + 1, column],  // bottom
    [row, column - 1],  // left
    [row, column + 1],  // right
    [row - 1, column - 1],  // top left
    [row - 1, column + 1],  // top right
    [row + 1, column - 1],  // bottom left
    [row + 1, column + 1],  // bottom right
  ]

  for (let [r, c] of adjacentPoints) {
    if (isCellPopulated(r, c, grid)) {
      populatedNeighborCount++
    }
  }

  return populatedNeighborCount == 2 || populatedNeighborCount == 3
}

const shouldPopulateDeadCell = (row: number, column: number, grid: any) => {
  let populatedNeighborCount = 0

  const adjacentPoints = [
    [row - 1, column],  // top
    [row + 1, column],  // bottom
    [row, column - 1],  // left
    [row, column + 1],  // right
    [row - 1, column - 1],  // top left
    [row - 1, column + 1],  // top right
    [row + 1, column - 1],  // bottom left
    [row + 1, column + 1],  // bottom right
  ]

  for (let [r, c] of adjacentPoints) {
    if (isCellPopulated(r, c, grid)) {
      populatedNeighborCount++
    }
  }

  return populatedNeighborCount == 3
} 

function App() {
  const [rowCount, setRowCount] = useState(30)
  const [columnCount, setColumnCount] = useState(30)
  const [grid, setGrid] = useState<any>(null)
  const [cells, setCells] = useState<any>({})

  useEffect(() => {
    let gridBuilder = generateGrid(rowCount, columnCount)
    setGrid(gridBuilder)
  }, [rowCount, columnCount])

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

  const createNextGeneration = () => {
    // let gridBuilder = generateGrid(rowCount, columnCount)

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

      console.log('key:', key)
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
    
    console.log('cells:', cells)
    console.log('updatedCells:', updatedCells)
    console.log('emptyCells:', Object.keys(emptyCells).length, emptyCells)
    
    setCells(updatedCells)
    // for (let row = 0; row < rowCount; row++) {
    //   for (let column = 0; column < columnCount; column++) {
    //     const currentCell = grid[row][column]

    //     if (!currentCell.populated) {
    //       gridBuilder[row][column]['populated'] = shouldPopulateDeadCell(row, column, grid)
    //     } else {
    //       gridBuilder[row][column]['populated'] = shouldKeepPopulatedCellAlive(row, column, grid)
    //     }
    //   }
    // }

    // setGrid(gridBuilder)
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
      <div className="m-4">
        <button
          type="button"
          onClick={() => createNextGeneration()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >Next Generation</button>
      </div>
      </div>
    </div>
  );
}

export default App
