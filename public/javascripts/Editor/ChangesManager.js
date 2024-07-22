let actionsSet = new Set();

let writeActions = false;

function sendAction(actionName, actionData) {
    if (writeActions) {
        const uniqueActionId = Math.random().toString(36).substr(2, 9);
        actionsSet.add(uniqueActionId);

        socket.emit('message', JSON.stringify({ uniqueActionId, actionName, actionData }));

        save();
    }
}

socket.on('changesMessage', (message) => {
    const workplace = document.getElementById('workplace');

    const { uniqueActionId, actionName, actionData } = JSON.parse(message);

    if (actionsSet.has(uniqueActionId)) {
        actionsSet.delete(uniqueActionId);
        return;
    }

    writeActions = false;

    // console.log(actionName);

    switch (actionName) {
        case 'BLOCK_MOVING': {
            const { editorId, position } = actionData;
            const block = blockByEditorId(editorId);
            if (block !== undefined)
                block.placeToNewPosition(position);
            break;
        }
        case 'BLOCK_TEXT_UPDATE': {
            const { blockEditorId, formEditorId, text } = actionData;
            const block = blockByEditorId(blockEditorId);
            if (block !== undefined) {
                if (block.header.editorId === formEditorId) {
                    block.header.input.textContent = text;
                } else {
                    for (let i = 0; i < block.formsList.length; i++) {
                        if (block.formsList[i].keyForm.editorId === formEditorId) {
                            block.formsList[i].keyForm.input.textContent = text;
                            break;
                        } else if (block.formsList[i].valueForm.editorId === formEditorId) {
                            block.formsList[i].valueForm.input.textContent = text;
                            break;
                        }
                    }
                }

            }
            break;
        }
        case 'KEY_VALUE_PAIR_FORM_ADD': {
            const { blockEditorId } = actionData;
            const block = blockByEditorId(blockEditorId);
            if (block !== undefined)
                block.addKeyValueForm();
            break;
        }
        case 'KEY_VALUE_PAIR_FORM_DELETE': {
            const { blockEditorId, formEditorId } = actionData;
            const block = blockByEditorId(blockEditorId);
            if (block !== undefined) {
                for (let i = 0; i < block.formsList.length; i++) {
                    if (block.formsList[i].keyForm.editorId === formEditorId) {
                        block.formsList[i].setAvatarImage();
                        block.formsList[i].isPremium();
                        block.formsList[i].isComment();
                        block.formsList[i].form.remove();
                        block.formsList = block.formsList.filter(item => item !== block.formsList[i])
                        updateEnd(block);
                    }
                }
                break;
            }
        }
        case 'BLOCK_CREATE': {
            const { blockEditorId, position } = actionData;
            const block = new Block(position, blockSize, workplace);
            block.editorId = blockEditorId;
            blocks.push(block);
            lastAddedBlock = block;
            break;
        }
        case 'BLOCK_DELETE': {
            const { blockEditorId } = actionData;
            const block = blockByEditorId(blockEditorId);
            if (block !== undefined)
                block.remove();
            break;
        }
        case 'ARROW_TEXT_UPDATE': {
            const { arrowEditorId, text } = actionData;
            const arrow = arrowByEditorId(arrowEditorId);
            if (arrow !== undefined) {
                arrow.form.input.textContent = text;
            }
            break;
        }
        case 'ARROW_CREATE': {
            const { arrowEditorId, fromEditorId, toEditorId } = actionData;
            const fromBlock = blockByEditorId(fromEditorId);
            const toBlock = blockByEditorId(toEditorId);
            const arrow = new Arrow(workplace, fromBlock);
            arrow.editorId = arrowEditorId;

            arrow.setFrom(fromBlock.bottomPoint)
            arrow.setTo(toBlock.topPoint, toBlock)
            arrow.placeArrow()
            toBlock.arrowsList.push(arrow)
            fromBlock.arrowsList.push(arrow)
            arrows.push(arrow)

            break;
        }
        case 'ARROW_DELETE': {
            const { arrowEditorId } = actionData;
            const arrow = arrowByEditorId(arrowEditorId);
            if (arrow !== undefined)
                arrow.deleteArrow();
            break;
        }
        case 'BOOKMARK_MOVING': {
            const { bookmarkEditorId, position } = actionData;
            const bookmark = bookmarkByEditorId(bookmarkEditorId);
            if (bookmark !== undefined)
                bookmark.placeToNewPosition(position);
            break;
        }
        case 'BOOKMARK_TEXT_UPDATE': {
            const { bookmarkEditorId, text } = actionData;
            const bookmark = bookmarkByEditorId(bookmarkEditorId);
            if (bookmark !== undefined) {
                bookmark.header.input.textContent = text;
            }
            break;
        }
        case 'BOOKMARK_CREATE': {
            const { bookmarkEditorId, position } = actionData;
            const bookmark = new Bookmark(position, workplace);
            bookmark.editorId = bookmarkEditorId;
            bookmarks.push(bookmark);
            break;
        }
        case 'BOOKMARK_DELETE': {
            const { bookmarkEditorId } = actionData;
            const bookmark = bookmarkByEditorId(bookmarkEditorId);
            if (bookmark !== undefined)
                bookmark.remove();
            break;
        }
        default:
            break;
    }

    writeActions = true;
}
);

function blockByEditorId(editorId) {
    for (let i = 0; i < blocks.length; i++)
        if (blocks[i].editorId === editorId)
            return blocks[i];
}

function arrowByEditorId(editorId) {
    for (let i = 0; i < arrows.length; i++)
        if (arrows[i].editorId === editorId)
            return arrows[i];
}

function bookmarkByEditorId(editorId) {
    for (let i = 0; i < bookmarks.length; i++)
        if (bookmarks[i].editorId === editorId)
            return bookmarks[i];
}

const ChangesType = {
    BLOCK_MOVING: 'BLOCK_MOVING',
    BLOCK_TEXT_UPDATE: 'BLOCK_TEXT_UPDATE',
    KEY_VALUE_PAIR_FORM_ADD: 'KEY_VALUE_PAIR_FORM_ADD',
    KEY_VALUE_PAIR_FORM_DELETE: 'KEY_VALUE_PAIR_FORM_DELETE',
    BLOCK_CREATE: 'BLOCK_CREATE',
    BLOCK_DELETE: 'BLOCK_DELETE',
    ARROW_TEXT_UPDATE: 'ARROW_TEXT_UPDATE',
    ARROW_CREATE: 'ARROW_CREATE',
    ARROW_DELETE: 'ARROW_DELETE',
    BOOKMARK_MOVING: 'BOOKMARK_MOVING',
    BOOKMARK_TEXT_UPDATE: 'BOOKMARK_TEXT_UPDATE',
    BOOKMARK_CREATE: 'BOOKMARK_CREATE',
    BOOKMARK_DELETE: 'BOOKMARK_DELETE',
}