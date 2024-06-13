let lastMousePosition;
const contextMenu = document.getElementById('template-context-menu')
let reservedArrow;
const divList = [];

function invokeContextMenu() {
    if (state !== State.NONE && state !== State.ARROW_MOVING) return;

    lastMousePosition = mousePosition

    contextMenu.style.display = 'block'
    contextMenu.style.left = mousePosition.x + "px"
    contextMenu.style.top = mousePosition.y + "px"

    contextMenu.style.transformOrigin = '0% 0%';
    contextMenu.style.transform = 'scale(' + 1 / scale + ')';

    reservedArrow = state === State.ARROW_MOVING ? arrowToMove : null;
    arrowToMove = null;

    setTimeout(() => state = State.TEMPLATE_SELECTING, 10);
}

document.addEventListener('DOMContentLoaded', () => {
    const workplace = document.getElementById('workplace')
    contextMenu.style.display = "none"
    contextMenu.style.overflowY = 'auto';

    contextMenu.addEventListener('wheel', function (e) {
        if ((contextMenu.scrollHeight - contextMenu.scrollTop <= contextMenu.clientHeight && e.deltaY > 0) || (contextMenu.scrollTop === 0 && e.deltaY < 0)) {
            e.preventDefault();
        }
    }, { passive: false });

    const frameTypeKeys = frameTypes.keys();
    let keysArray = Array.from(frameTypeKeys);
    keysArray.unshift('Mark');
    const newValue = 'Empty';
    keysArray.unshift(newValue);
    const list = keysArray.values();

    list.forEach(type => {
        const div = document.createElement('div');
        div.textContent = type
        contextMenu.appendChild(div)
        scrollable.push(div);
        divList.push(div);

        div.addEventListener('click', (e) => {
            contextMenu.style.display = 'none'

            let block;
            if (type == 'Dialog') block = dialogTemplate();
            else if (type == 'Text') block = textTemplate();
            else if (type == 'Customize') block = customizeTemplate();
            else if (type == 'Animation') block = animationTemplate();
            else if (type == 'Item') block = itemTemplate();
            else if (type == 'Love') block = loveTemplate();
            else if (type == 'Lucky') block = luckTemplate();
            else if (type == 'Option') block = optionTemplate();
            else if (type == 'Love-fork') block = loveForkTemplate();
            else if (type == 'Max-love') block = maxLoveTemplate();
            else if (type == 'Item-check') block = itemCheckTemplate();
            else if (type == 'Choice') block = choiceTemplate();
            else if (type == 'Choice-by-character') block = choiceByCharacterTemplate();
            else if (type == 'Choice-by-choice') block = choiceByChoiceTemplate();
            else if (type == 'Bubble') block = bubbleTemplate();
            else if (type == 'Counter') block = counterTemplate();
            else if (type == 'Counter-comparison') block = counterComparisonTemplate();
            else if (type == 'Counter-check') block = counterCheckTemplate();
            else if (type == 'Counter-value') block = counterValueTemplate();
            else if (type == 'Mark') markTemplate();
            else block = createBlock();
        })
    })

    document.addEventListener('click', (e) => {
        if (state !== State.TEMPLATE_SELECTING) return;

        if (reservedArrow != null) {
            reservedArrow.deleteArrow();
            reservedArrow = null;
        }

        contextMenu.style.display = 'none';

        state = State.NONE;
    });

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (e.button === 2) {
            if (e.target === workplace) {
                invokeContextMenu();
            }
        }
    });

    function markTemplate(position = lastMousePosition) {
        let adjustedPosition = new Vector2(
            Math.round(position.x / cellSize.x) * cellSize.x,
            Math.round(position.y / cellSize.y) * cellSize.y
        );

        let bookmark = new Bookmark(adjustedPosition, workplace);
        bookmarks.push(bookmark);

        state = State.NONE;

        addUndoAction(() => bookmark.remove());
    }

    function createBlock(position = lastMousePosition) {
        let adjustedPosition = new Vector2(
            Math.round(position.x / cellSize.x) * cellSize.x,
            Math.round(position.y / cellSize.y) * cellSize.y
        );
        // const id = blocks.length == 0 ? 0 : blocks[blocks.length - 1].id + 1
        let block = new Block(adjustedPosition, blockSize, workplace)

        if (reservedArrow !== null) {
            reservedArrow.setTo(block.topPoint, block)
            block.arrowsList.push(reservedArrow)
            reservedArrow.fromBlock.arrowsList.push(reservedArrow)
            arrows.push(reservedArrow)
            reservedArrow.placeArrow()
            reservedArrow = null;
        }

        lastAddedBlock = block;

        blocks.push(block)

        state = State.NONE;

        trySetBegin(block);

        addUndoAction(() => block.remove());

        return block
    }

    function dialogTemplate() {
        const block = createBlock()

        block.header.input.textContent = "Dialog"

        const keyValuePairForm = block.addKeyValueForm();
        keyValuePairForm.setKeyFormValue("character");
        keyValuePairForm.valueForm.list = fieldTypes["character"]
        // block.formsList.push(keyValuePairForm)

        const keyValuePairForm2 = block.addKeyValueForm();
        keyValuePairForm2.setKeyFormValue("text");
        keyValuePairForm2.valueForm.list = fieldTypes["text"]
        // block.formsList.push(keyValuePairForm2)

        const keyValuePairForm3 = block.addKeyValueForm();
        keyValuePairForm3.setKeyFormValue("emotion");
        keyValuePairForm3.valueForm.list = fieldTypes["emotion"]
        // block.formsList.push(keyValuePairForm3)

        const keyValuePairForm1 = block.addKeyValueForm();
        keyValuePairForm1.setKeyFormValue("location");
        keyValuePairForm1.valueForm.list = fieldTypes["location"]
        // block.formsList.push(keyValuePairForm1)
    }

    function textTemplate() {
        const block = createBlock()

        block.header.input.textContent = "Text"

        const keyValuePairForm1 = block.addKeyValueForm();
        keyValuePairForm1.setKeyFormValue("text");
        keyValuePairForm1.valueForm.list = fieldTypes["text"]
        // block.formsList.push(keyValuePairForm1)

        const keyValuePairForm = block.addKeyValueForm();
        keyValuePairForm.setKeyFormValue("location");
        keyValuePairForm.valueForm.list = fieldTypes["location"]
        // block.formsList.push(keyValuePairForm)

        return block;
    }

    function bubbleTemplate() {
        const block = createBlock()

        block.header.input.textContent = "Bubble"

        const keyValuePairForm = block.addKeyValueForm();
        keyValuePairForm.setKeyFormValue("text");
        keyValuePairForm.valueForm.list = fieldTypes["text"]
        // block.formsList.push(keyValuePairForm)

        const keyValuePairForm1 = block.addKeyValueForm();
        keyValuePairForm1.setKeyFormValue("bubble-type");
        keyValuePairForm1.valueForm.list = fieldTypes["bubble-type"]
        // block.formsList.push(keyValuePairForm1)

        return block;
    }

    function customizeTemplate() {
        const block = createBlock()

        block.header.input.textContent = "Customize"

        const keyValuePairForm = block.addKeyValueForm();
        keyValuePairForm.setKeyFormValue("character");
        keyValuePairForm.valueForm.list = fieldTypes["character"]
        // block.formsList.push(keyValuePairForm)

        const keyValuePairForm2 = block.addKeyValueForm();
        keyValuePairForm2.setKeyFormValue("outfit-set");
        keyValuePairForm2.valueForm.list = fieldTypes["outfit-set"]
        // block.formsList.push(keyValuePairForm2)

        const keyValuePairForm1 = block.addKeyValueForm();
        keyValuePairForm1.setKeyFormValue("location");
        keyValuePairForm1.valueForm.list = fieldTypes["location"]
        // block.formsList.push(keyValuePairForm1)

        return block;
    }

    function animationTemplate() {
        const block = createBlock()

        block.header.input.textContent = "Animation"

        const keyValuePairForm = block.addKeyValueForm();
        keyValuePairForm.setKeyFormValue("animation");
        keyValuePairForm.valueForm.list = fieldTypes["animation"]
        // block.formsList.push(keyValuePairForm)

        const keyValuePairForm1 = block.addKeyValueForm();
        keyValuePairForm1.setKeyFormValue("location");
        keyValuePairForm1.valueForm.list = fieldTypes["location"]
        // block.formsList.push(keyValuePairForm1)

        return block;
    }

    function itemTemplate() {
        const block = createBlock()

        block.header.input.textContent = "Item"

        const keyValuePairForm = block.addKeyValueForm();
        keyValuePairForm.setKeyFormValue("item-name");
        keyValuePairForm.valueForm.list = fieldTypes["item-name"]
        // block.formsList.push(keyValuePairForm)

        const keyValuePairForm1 = block.addKeyValueForm();
        keyValuePairForm1.setKeyFormValue("add");
        keyValuePairForm1.valueForm.list = fieldTypes["add"]
        // block.formsList.push(keyValuePairForm1)

        return block;
    }

    function loveTemplate() {
        const block = createBlock()

        block.header.input.textContent = "Love"

        const keyValuePairForm = block.addKeyValueForm();
        keyValuePairForm.setKeyFormValue("character");
        keyValuePairForm.valueForm.list = fieldTypes["character"]
        // block.formsList.push(keyValuePairForm)

        const keyValuePairForm1 = block.addKeyValueForm();
        keyValuePairForm1.setKeyFormValue("add");
        keyValuePairForm1.valueForm.list = fieldTypes["add"]
        // block.formsList.push(keyValuePairForm1)

        return block;
    }

    function luckTemplate() {
        const block = createBlock()

        block.header.input.textContent = "Lucky"

        const keyValuePairForm = block.addKeyValueForm();
        keyValuePairForm.setKeyFormValue("add");
        keyValuePairForm.valueForm.list = fieldTypes["add"]
        // block.formsList.push(keyValuePairForm)

        return block;
    }

    function optionTemplate(position = lastMousePosition) {
        const block = createBlock(position)

        block.header.input.textContent = "Option"

        const keyValuePairForm = block.addKeyValueForm();
        keyValuePairForm.setKeyFormValue("text");
        keyValuePairForm.valueForm.list = fieldTypes["text"]
        // block.formsList.push(keyValuePairForm)

        const keyValuePairForm1 = block.addKeyValueForm();
        keyValuePairForm1.setKeyFormValue("premium");
        keyValuePairForm1.valueForm.list = fieldTypes["premium"]
        // block.formsList.push(keyValuePairForm1)

        const keyValuePairForm2 = block.addKeyValueForm();
        keyValuePairForm2.setKeyFormValue("thought");
        keyValuePairForm2.valueForm.list = fieldTypes["thought"]
        // block.formsList.push(keyValuePairForm2)

        return block
    }

    function itemCheckTemplate() {
        const block = createBlock()

        block.header.input.textContent = "Item-check"

        const keyValuePairForm = block.addKeyValueForm();
        keyValuePairForm.setKeyFormValue("item-name");
        keyValuePairForm.valueForm.list = fieldTypes["item-name"]
        // block.formsList.push(keyValuePairForm)

        const block0 = createBlock(new Vector2(lastMousePosition.x - 350, lastMousePosition.y + 500))
        const block1 = createBlock(new Vector2(lastMousePosition.x + 350, lastMousePosition.y + 500))

        const arrow0 = new Arrow(workplace, block)
        arrow0.setFrom(block.bottomPoint)
        arrow0.setTo(block0.topPoint, block0)
        arrow0.placeArrow()
        block0.arrowsList.push(arrow0)
        block.arrowsList.push(arrow0)
        arrow0.setFormValue("0")
        arrows.push(arrow0)

        const arrow1 = new Arrow(workplace, block)
        arrow1.setFrom(block.bottomPoint)
        arrow1.setTo(block1.topPoint, block1)
        arrow1.placeArrow()
        block1.arrowsList.push(arrow1)
        block.arrowsList.push(arrow1)
        arrow1.setFormValue("1")
        arrows.push(arrow1)

        return block;
    }

    function maxLoveTemplate() {
        const block = createBlock()

        block.header.input.textContent = "Max-love"

        const block0 = createBlock(new Vector2(lastMousePosition.x - 350, lastMousePosition.y + 500))
        const block1 = createBlock(new Vector2(lastMousePosition.x + 350, lastMousePosition.y + 500))

        const arrow0 = new Arrow(workplace, block)
        arrow0.setFrom(block.bottomPoint)
        arrow0.setTo(block0.topPoint, block0)
        arrow0.placeArrow()
        block0.arrowsList.push(arrow0)
        block.arrowsList.push(arrow0)
        arrow0.setFormValue("character1")
        arrows.push(arrow0)

        const arrow1 = new Arrow(workplace, block)
        arrow1.setFrom(block.bottomPoint)
        arrow1.setTo(block1.topPoint, block1)
        arrow1.placeArrow()
        block1.arrowsList.push(arrow1)
        block.arrowsList.push(arrow1)
        arrow1.setFormValue("character2")
        arrows.push(arrow1)

        return block;
    }

    function loveForkTemplate() {
        const block = createBlock()

        block.header.input.textContent = "Love-fork"

        const keyValuePairForm = block.addKeyValueForm();
        keyValuePairForm.setKeyFormValue("character");
        keyValuePairForm.valueForm.list = fieldTypes["character"]
        // block.formsList.push(keyValuePairForm)

        const block0 = createBlock(new Vector2(lastMousePosition.x - 350, lastMousePosition.y + 500))
        const block1 = createBlock(new Vector2(lastMousePosition.x + 350, lastMousePosition.y + 500))

        const arrow0 = new Arrow(workplace, block)
        arrow0.setFrom(block.bottomPoint)
        arrow0.setTo(block0.topPoint, block0)
        arrow0.placeArrow()
        block0.arrowsList.push(arrow0)
        block.arrowsList.push(arrow0)
        arrow0.setFormValue("-1")
        arrows.push(arrow0)

        const arrow1 = new Arrow(workplace, block)
        arrow1.setFrom(block.bottomPoint)
        arrow1.setTo(block1.topPoint, block1)
        arrow1.placeArrow()
        block1.arrowsList.push(arrow1)
        block.arrowsList.push(arrow1)
        arrow1.setFormValue("1")
        arrows.push(arrow1)

        return block;
    }

    function choiceTemplate() {
        const block = createBlock()

        block.header.input.textContent = "Choice"

        const keyValuePairForm = block.addKeyValueForm();
        keyValuePairForm.setKeyFormValue("text");
        keyValuePairForm.valueForm.list = fieldTypes["text"]
        // block.formsList.push(keyValuePairForm)

        const keyValuePairForm2 = block.addKeyValueForm();
        keyValuePairForm2.setKeyFormValue("emotion");
        keyValuePairForm2.valueForm.list = fieldTypes["emotion"]
        // block.formsList.push(keyValuePairForm2)

        const keyValuePairForm3 = block.addKeyValueForm();
        keyValuePairForm3.setKeyFormValue("thought");
        keyValuePairForm3.valueForm.list = fieldTypes["thought"]
        // block.formsList.push(keyValuePairForm3)

        const keyValuePairForm1 = block.addKeyValueForm();
        keyValuePairForm1.setKeyFormValue("location");
        keyValuePairForm1.valueForm.list = fieldTypes["location"]
        // block.formsList.push(keyValuePairForm1)

        const block0 = optionTemplate(new Vector2(lastMousePosition.x - 750, lastMousePosition.y + 500))
        const block1 = optionTemplate(new Vector2(lastMousePosition.x, lastMousePosition.y + 500))
        const block2 = optionTemplate(new Vector2(lastMousePosition.x + 750, lastMousePosition.y + 500))

        const arrow0 = new Arrow(workplace, block)
        arrow0.setFrom(block.bottomPoint)
        arrow0.setTo(block0.topPoint, block0)
        arrow0.placeArrow()
        block0.arrowsList.push(arrow0)
        block.arrowsList.push(arrow0)
        arrows.push(arrow0)

        const arrow1 = new Arrow(workplace, block)
        arrow1.setFrom(block.bottomPoint)
        arrow1.setTo(block1.topPoint, block1)
        arrow1.placeArrow()
        block1.arrowsList.push(arrow1)
        block.arrowsList.push(arrow1)
        arrows.push(arrow1)

        const arrow2 = new Arrow(workplace, block)
        arrow2.setFrom(block.bottomPoint)
        arrow2.setTo(block2.topPoint, block2)
        arrow2.placeArrow()
        block2.arrowsList.push(arrow2)
        block.arrowsList.push(arrow2)
        arrows.push(arrow2)

        return block;
    }

    function choiceByCharacterTemplate() {
        const block = createBlock()

        block.header.input.textContent = "Choice-by-character"

        const keyValuePairForm = block.addKeyValueForm();
        keyValuePairForm.setKeyFormValue("character");
        keyValuePairForm.valueForm.list = fieldTypes["character"]
        // block.formsList.push(keyValuePairForm)

        const keyValuePairForm1 = block.addKeyValueForm();
        keyValuePairForm1.setKeyFormValue("outfit-set");
        keyValuePairForm1.valueForm.list = fieldTypes["outfit-set"]
        // // block.formsList.push(keyValuePairForm1)

        const block0 = createBlock(new Vector2(lastMousePosition.x - 750, lastMousePosition.y + 500))
        const block1 = createBlock(new Vector2(lastMousePosition.x, lastMousePosition.y + 500))
        const block2 = createBlock(new Vector2(lastMousePosition.x + 750, lastMousePosition.y + 500))

        const arrow0 = new Arrow(workplace, block)
        arrow0.setFrom(block.bottomPoint)
        arrow0.setTo(block0.topPoint, block0)
        arrow0.placeArrow()
        block0.arrowsList.push(arrow0)
        block.arrowsList.push(arrow0)
        arrow0.setFormValue("0")
        arrows.push(arrow0)

        const arrow1 = new Arrow(workplace, block)
        arrow1.setFrom(block.bottomPoint)
        arrow1.setTo(block1.topPoint, block1)
        arrow1.placeArrow()
        block1.arrowsList.push(arrow1)
        block.arrowsList.push(arrow1)
        arrow1.setFormValue("clothes-id1")
        arrows.push(arrow1)

        const arrow2 = new Arrow(workplace, block)
        arrow2.setFrom(block.bottomPoint)
        arrow2.setTo(block2.topPoint, block2)
        arrow2.placeArrow()
        block2.arrowsList.push(arrow2)
        block.arrowsList.push(arrow2)
        arrow2.setFormValue("clothes-id2")
        arrows.push(arrow2)

        return block;
    }

    function choiceByChoiceTemplate() {
        const block = createBlock()

        block.header.input.textContent = "Choice-by-choice"

        const block0 = createBlock(new Vector2(lastMousePosition.x - 750, lastMousePosition.y + 500))
        const block1 = createBlock(new Vector2(lastMousePosition.x, lastMousePosition.y + 500))
        const block2 = createBlock(new Vector2(lastMousePosition.x + 750, lastMousePosition.y + 500))

        const arrow0 = new Arrow(workplace, block)
        arrow0.setFrom(block.bottomPoint)
        arrow0.setTo(block0.topPoint, block0)
        arrow0.placeArrow()
        block0.arrowsList.push(arrow0)
        block.arrowsList.push(arrow0)
        arrow0.setFormValue("rose")
        arrows.push(arrow0)

        const arrow1 = new Arrow(workplace, block)
        arrow1.setFrom(block.bottomPoint)
        arrow1.setTo(block1.topPoint, block1)
        arrow1.placeArrow()
        block1.arrowsList.push(arrow1)
        block.arrowsList.push(arrow1)
        arrow1.setFormValue("key")
        arrows.push(arrow1)

        const arrow2 = new Arrow(workplace, block)
        arrow2.setFrom(block.bottomPoint)
        arrow2.setTo(block2.topPoint, block2)
        arrow2.placeArrow()
        block2.arrowsList.push(arrow2)
        block.arrowsList.push(arrow2)
        arrow2.setFormValue("crown")
        arrows.push(arrow2)

        return block;
    }

    function counterTemplate() {
        const block = createBlock()

        block.header.input.textContent = "Counter"

        const keyValuePairForm = block.addKeyValueForm();
        keyValuePairForm.setKeyFormValue("name");
        keyValuePairForm.valueForm.list = fieldTypes["name"]
        // // block.formsList.push(keyValuePairForm)

        const keyValuePairForm1 = block.addKeyValueForm();
        keyValuePairForm1.setKeyFormValue("count");
        keyValuePairForm1.valueForm.list = fieldTypes["count"]
        // // block.formsList.push(keyValuePairForm1)

        return block;
    }

    function counterComparisonTemplate() {
        const block = createBlock()

        block.header.input.textContent = "Counter-comparison"

        const keyValuePairForm = block.addKeyValueForm();
        keyValuePairForm.setKeyFormValue("type");
        keyValuePairForm.valueForm.list = fieldTypes["type"]
        // block.formsList.push(keyValuePairForm)

        const block0 = createBlock(new Vector2(lastMousePosition.x - 350, lastMousePosition.y + 500))
        const block1 = createBlock(new Vector2(lastMousePosition.x + 350, lastMousePosition.y + 500))

        const arrow0 = new Arrow(workplace, block)
        arrow0.setFrom(block.bottomPoint)
        arrow0.setTo(block0.topPoint, block0)
        arrow0.placeArrow()
        block0.arrowsList.push(arrow0)
        block.arrowsList.push(arrow0)
        arrow0.setFormValue("name1")
        arrows.push(arrow0)

        const arrow1 = new Arrow(workplace, block)
        arrow1.setFrom(block.bottomPoint)
        arrow1.setTo(block1.topPoint, block1)
        arrow1.placeArrow()
        block1.arrowsList.push(arrow1)
        block.arrowsList.push(arrow1)
        arrow1.setFormValue("name2")
        arrows.push(arrow1)

        return block;
    }

    function counterCheckTemplate() {
        const block = createBlock()

        block.header.input.textContent = "Counter-check"

        const keyValuePairForm = block.addKeyValueForm();
        keyValuePairForm.setKeyFormValue("name");
        keyValuePairForm.valueForm.list = fieldTypes["name"]
        // block.formsList.push(keyValuePairForm)

        const keyValuePairForm1 = block.addKeyValueForm();
        keyValuePairForm1.setKeyFormValue("value");
        keyValuePairForm1.valueForm.list = fieldTypes["value"]
        // block.formsList.push(keyValuePairForm1)

        const block0 = createBlock(new Vector2(lastMousePosition.x - 350, lastMousePosition.y + 500))
        const block1 = createBlock(new Vector2(lastMousePosition.x + 350, lastMousePosition.y + 500))

        const arrow0 = new Arrow(workplace, block)
        arrow0.setFrom(block.bottomPoint)
        arrow0.setTo(block0.topPoint, block0)
        arrow0.placeArrow()
        block0.arrowsList.push(arrow0)
        block.arrowsList.push(arrow0)
        arrow0.setFormValue("-1")
        arrows.push(arrow0)

        const arrow1 = new Arrow(workplace, block)
        arrow1.setFrom(block.bottomPoint)
        arrow1.setTo(block1.topPoint, block1)
        arrow1.placeArrow()
        block1.arrowsList.push(arrow1)
        block.arrowsList.push(arrow1)
        arrow1.setFormValue("1")
        arrows.push(arrow1)

        return block;
    }

    function counterValueTemplate() {
        const block = createBlock()

        block.header.input.textContent = "Counter-value";

        const keyValuePairForm = block.addKeyValueForm();;
        keyValuePairForm.setKeyFormValue("name");;
        keyValuePairForm.valueForm.list = fieldTypes["name"];
        // block.formsList.push(keyValuePairForm);

        const block0 = createBlock(new Vector2(lastMousePosition.x - 750, lastMousePosition.y + 500))
        const block1 = createBlock(new Vector2(lastMousePosition.x, lastMousePosition.y + 500))
        const block2 = createBlock(new Vector2(lastMousePosition.x + 750, lastMousePosition.y + 500))

        const arrow0 = new Arrow(workplace, block)
        arrow0.setFrom(block.bottomPoint)
        arrow0.setTo(block0.topPoint, block0)
        arrow0.placeArrow()
        block0.arrowsList.push(arrow0)
        block.arrowsList.push(arrow0)
        arrow0.setFormValue("0")
        arrows.push(arrow0)

        const arrow1 = new Arrow(workplace, block)
        arrow1.setFrom(block.bottomPoint)
        arrow1.setTo(block1.topPoint, block1)
        arrow1.placeArrow()
        block1.arrowsList.push(arrow1)
        block.arrowsList.push(arrow1)
        arrow1.setFormValue("3")
        arrows.push(arrow1)

        const arrow2 = new Arrow(workplace, block)
        arrow2.setFrom(block.bottomPoint)
        arrow2.setTo(block2.topPoint, block2)
        arrow2.placeArrow()
        block2.arrowsList.push(arrow2)
        block.arrowsList.push(arrow2)
        arrow2.setFormValue("7")
        arrows.push(arrow2)

        return block;
    }
})