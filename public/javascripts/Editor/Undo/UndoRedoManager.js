const undoActions = new Stack();

function addUndoAction(action) {
    undoActions.push(action);
}

function undo() {
    return;

    if (undoActions.isEmpty()) return;

    const action = undoActions.pop();
    action();
}