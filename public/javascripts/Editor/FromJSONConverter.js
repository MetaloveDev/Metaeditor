function fromJSONConvert(jsonData, container) {
    document.getElementById("loading-chapter-screen").style.display = 'block';

    setTimeout(() => {
        blocks.forEach(block => {
            block.remove();
        })

        arrows.forEach(arrow => {
            arrow.deleteArrow();
        })

        blocks = []
        arrows = []

        let firstBlock = true;
        let delta = 0;

        let tempId = 0;
        jsonData.blocks.forEach(blockInfo => {
            let position = new Vector2(blockInfo.position.x, blockInfo.position.y - delta)

            if (firstBlock) {
                position.y = 500;
                delta = blockInfo.position.y - 500;
                firstBlock = false;
            }

            const block = new Block(position, blockSize, container)
            block.header.input.textContent = blockInfo.header.input;
            block.id = blockInfo.id;

            block.editorId =
                (blockInfo.editorId === undefined || blockInfo.editorId === null) ?
                    block.editorId = tempId++ :
                    blockInfo.editorId;

            blockInfo.formsList.forEach(formInfo => {
                const keyValuePairForm = new KeyValuePairForm(block, Object.keys(fieldTypes), block.addButton, block.formsList.length)
                keyValuePairForm.keyForm.input.textContent = formInfo.key.input === "" ? "None" : formInfo.key.input
                keyValuePairForm.valueForm.input.textContent = formInfo.value.input === "" ? "None" : formInfo.value.input
                block.formsList.push(keyValuePairForm)
            })

            blocks.push(block)
        });

        jsonData.arrows.forEach(arrowInfo => {
            const fromBlock = getBlockById(arrowInfo.from, blocks)
            const toBlock = getBlockById(arrowInfo.to, blocks)
            const arrow = new Arrow(container, fromBlock)
            arrow.form.input.textContent = arrowInfo.value.input === "" ? "None" : arrowInfo.value.input
            arrow.setFrom(fromBlock.bottomPoint)
            arrow.setTo(toBlock.topPoint, toBlock)
            arrow.placeArrow()

            fromBlock.arrowsList.push(arrow)
            toBlock.arrowsList.push(arrow)

            arrows.push(arrow)

            arrow.editorId =
                (arrowInfo.editorId === undefined || arrowInfo.editorId === null) ?
                    arrow.editorId = tempId++ :
                    arrowInfo.editorId;
        });

        if (!(jsonData.bookmarks === undefined || jsonData.bookmarks === null)) {
            jsonData.bookmarks.forEach(bookmarksInfo => {
                let position = new Vector2(bookmarksInfo.position.x, bookmarksInfo.position.y - delta)
                const bookmark = new Bookmark(position, container);
                bookmark.header.input.textContent = bookmarksInfo.header.input;
                bookmarks.push(bookmark);

                bookmark.editorId =
                    (bookmarksInfo.editorId === undefined || bookmarksInfo.editorId === null) ?
                        bookmark.editorId = tempId++ :
                        bookmarksInfo.editorId;
            })
        }

        if (blocks.length !== 0) {
            lastAddedBlock = blocks[blocks.length - 1];

            let targetPosition = blocks[blocks.length - 1].position;
            targetPosition.y += blocks[blocks.length - 1].docElement.offsetHeight / 2.0;

            moveViewportTo(targetPosition);

            blocks.forEach(block => {
                trySetBegin(block);
                checkEnd(block);
            });
        }

        document.getElementById("loading-chapter-screen").style.display = 'none';

        if (jsonData.checkList === undefined || jsonData.checkList === null) return;

        checkList = jsonData.checkList;

        writeActions = true;
    }, 100)
}

function getBlockById(id, blocks) {
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].id === id) {
            return blocks[i]
        }
    }
}