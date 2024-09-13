
let initialValues = [];

function validatePuzzle(grid) {
    const checkDuplicates = (arr) => {
        const seen = new Set();
        for (const num of arr) {
            if (num !== 0 && seen.has(num)) return true;
            seen.add(num);
        }
        return false;
    };

    for (let i = 0; i < 9; i++) {
        if (checkDuplicates(grid[i])) return false;
        const column = grid.map(row => row[i]);
        if (checkDuplicates(column)) return false;
    }

    for (let boxRow = 0; boxRow < 9; boxRow += 3) {
        for (let boxCol = 0; boxCol < 9; boxCol += 3) {
            const box = [];
            for (let r = boxRow; r < boxRow + 3; r++) {
                for (let c = boxCol; c < boxCol + 3; c++) {
                    if (grid[r][c] !== 0) box.push(grid[r][c]);
                }
            }
            if (checkDuplicates(box)) return false;
        }
    }

    return true;
}

function solveSudoku() {
    const cells = Array.from(document.querySelectorAll('.cell'));
    const grid = Array.from({ length: 9 }, (_, row) =>
        Array.from({ length: 9 }, (_, col) =>
            parseInt(cells[row * 9 + col].value) || 0
        )
    );

    console.log("Initial Grid:", grid); // Debugging line

    if (!initialValues.length) {
        initialValues = grid.map(row => [...row]);
        console.log("Stored Initial Values:", initialValues); // Debugging line
    }

    if (!validatePuzzle(grid)) return alert('Initial puzzle is invalid!');

    if (solve(grid)) {
        cells.forEach((cell, idx) => {
            const row = Math.floor(idx / 9);
            const col = idx % 9;
            const newValue = grid[row][col];
            cell.value = newValue;

            if (initialValues[row][col] !== newValue) {
                cell.classList.add('changed');
                cell.classList.remove('initial');
            } else {
                cell.classList.add('initial');
                cell.classList.remove('changed');
            }
        });
    } else {
        alert('No solution found!');
    }

    console.log("Solved Grid:", grid); // Debugging line
}

function solve(grid) {
    const emptyCell = findEmpty(grid);
    if (!emptyCell) return true;

    const [row, col] = emptyCell;
    for (let num = 1; num <= 9; num++) {
        if (isValid(grid, num, row, col)) {
            grid[row][col] = num;
            if (solve(grid)) return true;
            grid[row][col] = 0; // Backtrack
        }
    }
    return false;
}

function findEmpty(grid) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (grid[r][c] === 0) return [r, c];
        }
    }
    return null;
}

function isValid(grid, num, row, col) {
    // Check row
    if (grid[row].includes(num)) return false;

    // Check column
    if (grid.some(r => r[col] === num)) return false;

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (grid[r][c] === num) return false;
        }
    }
    return true;
}

function clearGrid() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.value = '';
        cell.classList.remove('initial', 'changed');
    });
    initialValues = [];
}