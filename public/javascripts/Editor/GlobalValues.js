const State = {
    NONE: 'NONE',
    SELECTING: 'SELECTING',
    BLOCKS_MOVING: 'BLOCKS_MOVING',
    ARROW_MOVING: 'ARROW_MOVING',
    TEMPLATE_SELECTING: 'TEMPLATE_SELECTING',
    ARROW_MOVING: 'ARROW_MOVING',
    BLOCK_CONNECTION: 'BLOCK_CONNECTION',
}

const Visibility = {
    VISIBLE: 'VISIBLE',
    PARTIALLY_VISIBLE: 'PARTIALLY_VISIBLE',
    INVISIBLE: 'INVISIBLE'
}

const StatState = {
    GOOD: 'GOOD',
    WARNING: 'WARNING',
    ERROR: 'ERROR',
    COMMENT: 'COMMENT',
    COUNTER: 'COUNTER',
    BOOKMARK: 'BOOKMARK',
}

let blocks = [];
let arrows = [];
let bookmarks = [];
let endBlocks = [];
let scrollable = [];
let arrowToMove;
let blockToConnect = null;
const blockSize = new Vector2(540, 50)
const startCellSize = new Vector2(25, 25)
let cellSize = new Vector2(25, 25)
let mousePosition = new Vector2(0, 0)
const selectedColor = '#4A87FF';
let scale = 1;
let state = State.NONE;
let copiedBlocks = [];
const autosaveDelay = 3
const socket = io("https://0ded-94-154-215-143.ngrok-free.app");