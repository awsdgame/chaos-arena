const grid = document.querySelector('#grid');
const gridSize = 6;
let maxPlayerUnits = 3;
let playerUnits = [];
const startBtn = document.getElementById("startBtn");
let isPlayerTurn = false;
let selectedUnit = null;

function createGrid() {
    grid.innerHTML = ''; // Clear existing grid
    for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.x = i; // Set data attributes for coordinates
        cell.dataset.y = j; // Set data attributes for coordinates
        cell.addEventListener('click', () => onCellClick(cell)); // Add click event listener

        grid.appendChild(cell); // Add cell to grid
       
    }
}}

// Showing modal for messages
function showModal(message) {
  const modal = document.getElementById("customModal");
  const modalMessage = document.getElementById("modalMessage");
  const closeButton = document.querySelector(".close-button");

  modalMessage.textContent = message;
  modal.style.display = "block";

  closeButton.onclick = () => modal.style.display = "none";

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

// Function to place enemy units
function placeEnemyUnits() {
    enemyUnits = [];
    const cells = document.querySelectorAll('.cell');
    let count = 0;
    for(let i = cells.length - 1; i >= 0; i--) {
        const cell = cells[i];
        const y = parseInt(cell.dataset.y);
        if(y >= gridSize - 3 && !cell.classList.contains('player-unit')) {
            cell.classList.add('enemy-unit'); // Add enemy unit class
            enemyUnits.push({x: parseInt(cell.dataset.x), y: y}); // Add the unit to the enemy units array
            count++; // Increment count for each enemy unit placed
            if (count >= maxPlayerUnits) break;
        }
    }
}

// Function to set up unit placement
  function setupUnitPlacement() {
    const cells = document.querySelectorAll(".cell");
    playerUnits = [];

    cells.forEach(cell => {
      cell.addEventListener("click", () => {
        const y = parseInt(cell.dataset.y);
        if (y > 2 || cell.classList.contains("player-unit") || playerUnits.length >= maxPlayerUnits) return; // Prevent placement in the last 3 rows or if already occupied

        cell.classList.add("player-unit");
        playerUnits.push({ x: parseInt(cell.dataset.x), y }); // Add the unit to the player units array
      });
    });
  }
function onCellClick(cell) {
  const x = parseInt(cell.dataset.x);
  const y = parseInt(cell.dataset.y);

  // If still placing units
  if (!isPlayerTurn && playerUnits.length < maxPlayerUnits) {
    if (y > 2 || cell.classList.contains('player-unit')) return; // limit rows and avoid double place

    cell.classList.add('player-unit');
    playerUnits.push({ x, y });
    return;
  }

  // After placement - player turn for moving units
  if (!isPlayerTurn) return; // Not your turn yet, no moves

  // Select your own unit
  if (cell.classList.contains('player-unit')) {
    selectedUnit = playerUnits.find(u => u.x === x && u.y === y);
    highlightMoves(selectedUnit);
  }
  // Move to highlighted empty cell
  else if (selectedUnit && cell.classList.contains('highlight')) {
    moveUnit(selectedUnit, x, y);
    clearHighlights();
    selectedUnit = null;
    endPlayerTurn();
  }
}

// Highlight valid move cells (adjacent empty cells)
function highlightMoves(unit) {
  clearHighlights();
  const directions = [
    [0, 1], [0, -1], [1, 0], [-1, 0]
  ];
  directions.forEach(([dx, dy]) => {
    const nx = unit.x + dx;
    const ny = unit.y + dy;
    if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
      const cell = getCell(nx, ny);
      if (!cell.classList.contains('player-unit') && !cell.classList.contains('enemy-unit')) {
        cell.classList.add('highlight');
      }
    }
  });
}

// Remove highlight classes
function clearHighlights() {
  document.querySelectorAll('.highlight').forEach(cell => cell.classList.remove('highlight'));
}

// Move unit in data and update UI
function moveUnit(unit, x, y) {
  const oldCell = getCell(unit.x, unit.y);
  oldCell.classList.remove('player-unit');

  unit.x = x;
  unit.y = y;

  const newCell = getCell(x, y);
  newCell.classList.add('player-unit');
}

// Helper: get cell by coords
function getCell(x, y) {
  return grid.querySelector(`.cell[data-x='${x}'][data-y='${y}']`);
}

function enemyTurn() {
  isPlayerTurn = false;
  alert("Enemy turn... (AI not implemented yet)");
  // TODO: Enemy AI moves

  // For now, immediately switch back
  isPlayerTurn = true;
  alert("Your turn!");
}
// End player turn and switch to enemy turn

function endPlayerTurn() {
  isPlayerTurn = false;
  enemyTurn();
}

// Start button triggers enemy placement and starts the battle
startBtn.addEventListener('click', () => {
  if (playerUnits.length < maxPlayerUnits) {
    alert(`Place all your ${maxPlayerUnits} units first!`);
    return;
  }
  placeEnemyUnits();
  isPlayerTurn = true;
  showModal("Your turn!"); // Show modal for player turn
});

createGrid();
setupUnitPlacement();