document.addEventListener('DOMContentLoaded', (event) => {
    document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    const workplace = document.getElementById('workplace');

    var rect = workplace.getBoundingClientRect();
    mousePosition = new Vector2(event.clientX - rect.left, event.clientY - rect.top)

    let lastBlockPosition = [];
    let movedBlocks = [];
    let firstMove = true;

    document.addEventListener('mousemove', function (e) {
        var rect = workplace.getBoundingClientRect();

        let newMousePosition = new Vector2(e.clientX - rect.left, e.clientY - rect.top)
        newMousePosition.x /= scale
        newMousePosition.y /= scale

        if (arrowToMove != null && state === State.ARROW_MOVING) {
            arrowToMove.placeArrow(new Vector2(e.clientX - 5, e.clientY - 5))
        }

        if (state === State.BLOCKS_MOVING) {
            let delta = newMousePosition.subtract(mousePosition)

            blocks.forEach(b => {
                if (b.docElement.classList.contains('selected')) {
                    if (firstMove) {
                        lastBlockPosition.push({
                            block: b,
                            position: new Vector2(b.position.x, b.position.y)
                        });

                        movedBlocks.push(b);
                    }
                    b.placeToMousePosition(delta)
                }

                trySetBegin(b);
            })

            bookmarks.forEach(b => {
                if (b.docElement.classList.contains('selected')) {
                    if (firstMove) {
                        lastBlockPosition.push({
                            block: b,
                            position: new Vector2(b.position.x, b.position.y)
                        });
                    }
                    b.placeToMousePosition(delta)
                }
            })
            firstMove = false;
        }

        mousePosition = newMousePosition;
    });

    document.addEventListener('mouseup', function (e) {
        if (state === State.ARROW_MOVING && e.button === 0) {
            for (let i = 0; i < blocks.length; i++) {
                if (e.target === blocks[i].arrowTrigger) {
                    blocks[i].arrowsList.push(arrowToMove)
                    arrowToMove.setTo(blocks[i].topPoint, blocks[i])
                }
            }

            blocks.forEach(b => {
                b.arrowTrigger.style.display = 'none';
            });

            if (arrowToMove.to == null) {
                invokeContextMenu();
            }
            else {
                arrowToMove.fromBlock.arrowsList.push(arrowToMove);
                arrows.push(arrowToMove);
                arrowToMove.placeArrow();

                addUndoAction(() => arrowToMove.deleteArrow());

                state = State.NONE;
            }
        }

        if (state === State.BLOCK_CONNECTION && blockToConnect !== null && e.button !== 1) {
            state = State.NONE;

            if (e.button === 2) {
                for (let i = 0; i < blocks.length; i++) {
                    if (e.target === blocks[i].arrowTrigger && blocks[i] !== blockToConnect) {
                        const arrow = new Arrow(workplace, blockToConnect);
                        arrow.setFrom(blockToConnect.bottomPoint);
                        arrow.setTo(blocks[i].topPoint, blocks[i]);
                        arrow.placeArrow();
                        addUndoAction(() => arrow.deleteArrow());

                        blockToConnect.arrowsList.push(arrow);
                        blocks[i].arrowsList.push(arrow);
                        arrows.push(arrow);

                        break;
                    }
                }
            }

            blockToConnect = null;

            blocks.forEach(b => {
                b.arrowTrigger.style.display = 'none';
            });

            document.getElementById("block-connection-info-panel").style.display = 'none';
        }

        if (state === State.BLOCKS_MOVING) {
            state = State.NONE;

            firstMove = true;
            addUndoAction(() => {
                lastBlockPosition.forEach(item => {
                    const delta = item.position.subtract(item.block.position);
                    item.block.placeToMousePosition(delta);
                });
                lastBlockPosition = [];
            });

            movedBlocks = [];
        }
    });

    document.addEventListener('mousedown', function (e) {
        if (e.button === 0 && state === State.NONE && e.target === workplace) {
            blocks.forEach(b => b.docElement.classList.remove('selected'));
            bookmarks.forEach(b => b.docElement.classList.remove('selected'));
            arrows.forEach(a => a.arrowParts.forEach(ap => ap.classList.remove('selected')));
        }
        else if (e.button === 1) {
            e.preventDefault()
        }
    })

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Delete') {
            blocks.forEach(b => {
                if (b.docElement.classList.contains('selected')) {
                    const header = b.header.input.textContent
                    addUndoAction(() => {
                        let block = new Block(b.position, blockSize, workplace);
                        block.header.input.textContent = header
                        for (let i = 0; i < b.formsList.length; i++) {
                            block.formsList[i] = new KeyValuePairForm(block, Object.keys(fieldTypes), block.addButton, block.formsList.length);
                            block.formsList[i].keyForm.input.textContent = b.formsList[i].keyForm.input.textContent;
                            block.formsList[i].valueForm.input.textContent = b.formsList[i].valueForm.input.textContent;
                        }
                        blocks.push(block);
                    });
                    b.remove();
                }
            })

            bookmarks.forEach(b => {
                if (b.docElement.classList.contains('selected')) {
                    const header = b.header.input.textContent;
                    addUndoAction(() => {
                        let bookmark = new Bookmark(b.position, workplace);
                        bookmark.header.input.textContent = header
                        bookmarks.push(bookmark);
                    });
                    b.remove();
                }
            })

            arrows.forEach(a => {
                if (a.arrowParts[0].classList.contains('selected')) {
                    addUndoAction(() => {
                        const arrow = new Arrow(workplace, a.fromBlock);
                        arrow.setFrom(a.fromBlock.bottomPoint);
                        arrow.setTo(a.toBlock.topPoint, a.toBlock);
                        arrow.fromBlock.arrowsList.push(arrow);
                        arrow.toBlock.arrowsList.push(arrow);
                        arrow.form.input.textContent = a.form.input.textContent;
                        arrow.placeArrow();
                        arrows.push(arrow);
                    });
                    a.deleteArrow();
                }
            })
        }
    });

    // window.addEventListener('beforeunload', function (event) {
    //     event.preventDefault();
    //     event.returnValue = '';
    //     fetch('/editor-exit/'+localStorage.getItem('save-name'), {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'text/plain',
    //         },
    //         body: localStorage.getItem('uid')
    //     });

    //     fetch('/logout', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'text/plain',
    //         },
    //         body: localStorage.getItem('uid')
    //     })
    // });
})