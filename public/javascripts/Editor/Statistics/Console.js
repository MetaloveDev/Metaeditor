function getConsoleErrors(body) {
    const errors = [];

    bookmarks.forEach(b => {
        console.log("+");
        errors.push({ message: errorsList[15][0] + b.header.input.textContent, tip: errorsList[15][2], state: errorsList[15][1], position: b.position });
    });

    blocks.forEach(block => {
        const frameType = block.header.input.textContent;

        if (frameType === 'Counter') {
            block.formsList.forEach(fl => {
                const property = fl.keyForm.input.textContent;
                if (property === "name") {
                    errors.push({ message: errorsList[13][0] + fl.valueForm.input.textContent, tip: errorsList[13][2], state: errorsList[13][1], position: block.position })
                }
            })
        }

        if (frameTypes.get(frameType) === undefined) {
            errors.push({ message: errorsList[3][0] + " (" + frameType + ")", tip: errorsList[3][2], state: errorsList[3][1], position: block.position })
        }

        if (frameType === 'Text') {
            const [chain, blockPosition] = getTextFrameChain(block, 1);

            if (chain > metricsList[2][3]) {
                errors.push({ message: errorsList[1][0], tip: errorsList[1][2], state: errorsList[1][1], position: blockPosition })
            }
        }

        const fields = new Set();

        block.formsList.forEach(fl => {
            const property = fl.keyForm.input.textContent;
            if (property === 'text') {
                const length = fl.valueForm.input.textContent.length;
                if (length > metricsList[11][3] || length < metricsList[11][0]) {
                    errors.push({ message: errorsList[2][0], tip: errorsList[2][2], state: errorsList[2][1], position: block.position })
                }
            }

            if (fieldTypes[property] === undefined) {
                errors.push({ message: errorsList[4][0] + " (" + property + ")", tip: errorsList[4][2], state: errorsList[4][1], position: block.position })
            }

            if (fields.has(property) == false) {
                fields.add(property)
            }
            else {
                errors.push({ message: errorsList[10][0] + " (" + property + ")", tip: errorsList[10][2], state: errorsList[10][1], position: block.position })
            }

            if (property === 'comment') {
                errors.push({ message: errorsList[12][0] + fl.valueForm.input.textContent, tip: errorsList[12][2], state: errorsList[12][1], position: block.position })
            }
        });

        const props = [false, false, false];
        let forkLength = 0;
        if (frameType === 'Choice') {
            block.arrowsList.forEach(arrow => {
                if (arrow.toBlock.header.input.textContent === 'Option') {
                    forkLength++;
                    let nextBlock = undefined;
                    arrow.toBlock.arrowsList.forEach(al => {
                        if (al.toBlock.header.input.textContent !== 'Option')
                            nextBlock = al.toBlock;
                    });
                    if (nextBlock !== undefined) {
                        if (nextBlock.header.input.textContent === 'Item') {
                            nextBlock.formsList.forEach(fl => {
                                if (fl.keyForm.input.textContent === 'item-name') {
                                    switch (fl.valueForm.input.textContent) {
                                        case 'rose':
                                            props[0] = true;
                                            break;
                                        case 'key':
                                            props[1] = true;
                                            break;
                                        case 'crown':
                                            props[2] = true;
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            });
                        }
                    } else {
                        errors.push({ message: errorsList[6][0], tip: errorsList[6][2], state: errorsList[6][1], position: arrow.toBlock.position })
                    }
                }
                else if (arrow.toBlock.header.input.textContent !== 'Choice') {
                    errors.push({ message: errorsList[7][0], tip: errorsList[7][2], state: errorsList[7][1], position: block.position })
                }
            });

            const trueCount = props.filter(Boolean).length;
            if (trueCount !== 0) {
                if (forkLength !== 3) {
                    errors.push({ message: errorsList[5][0], tip: errorsList[5][2], state: errorsList[5][1], position: block.position })
                }
                if (trueCount === 1 || trueCount === 2) {
                    errors.push({ message: errorsList[0][0], tip: errorsList[0][2], state: errorsList[0][1], position: block.position })
                }
            }
        }

        let fromArrowsCount = 0;
        let toArrowsCount = 0;
        block.arrowsList.forEach(arrow => {
            (arrow.toBlock !== block) ? fromArrowsCount++ : toArrowsCount++;
        });

        if (block.arrowsList.length === 0) {
            errors.push({ message: errorsList[9][0] + " (" + frameType + ")", tip: errorsList[9][2], state: errorsList[9][1], position: block.position });
        }

        if (toArrowsCount === 0 && block !== beginBlock) {
            errors.push({ message: errorsList[14][0] + " (" + frameType + ")", tip: errorsList[14][2], state: errorsList[14][1], position: block.position });
        }

        const linearFrames = ["Text", "Dialog", "Option", "Item", "Customize", "Love", "Lucky", "Bubble", "Animation"];

        if ((linearFrames.includes(frameType) && fromArrowsCount > 1) || (!linearFrames.includes(frameType) && fromArrowsCount < 2)) {
            errors.push({ message: errorsList[8][0] + " (" + frameType + ")", tip: errorsList[8][2], state: errorsList[8][1], position: block.position });
        }
    });

    for (const [block, end] of ends) {
        if (end.state === false) {
            errors.push({ message: errorsList[11][0], tip: errorsList[11][2], state: errorsList[11][1], position: block.position });
        }
    }

    let i = 0;
    errors.forEach(error => {
        const element = document.createElement('div');
        element.classList.add("stat-field");
        element.classList.add(i++ % 2 === 0 ? "pair" : "odd");

        const statIcon = document.createElement('img');
        switch (error.state) {
            case StatState.WARNING:
                statIcon.src = "images/Icons/warning.png";
                break;
            case StatState.ERROR:
                statIcon.src = "images/Icons/error.png";
                break;
            case StatState.COMMENT:
                statIcon.src = "images/Icons/chat.png";
                break;
            case StatState.COUNTER:
                statIcon.src = "images/Icons/counter.png";
                break;
            case StatState.BOOKMARK:
                statIcon.src = "images/Icons/bookmark.png";
                break;
            default:
                break;
        }
        statIcon.draggable = false;
        element.appendChild(statIcon);

        const name = document.createElement('p');
        name.textContent = error.message;
        name.style.maxWidth = "300px";
        name.style.width = "300px";

        element.appendChild(name);

        const statArrow = document.createElement('img');
        statArrow.src = "images/Icons/link.png";
        statArrow.draggable = false;
        statArrow.addEventListener('click', () => {
            moveViewportTo(error.position);

            document.getElementById("stats-window").classList.add("window-close");
            document.getElementById("stats-window").classList.remove("window-open");

            setTimeout(() => {
                document.getElementById("stats").style.display = "none";
            }, 300);
        })

        if (error.tip !== "") {
            element.addEventListener('mouseover', (e) => {
                if (e.target !== statArrow)
                    showTooltip(error.tip, new Vector2(e.clientX, e.clientY));
            });

            element.addEventListener('mouseout', () => {
                hideTooltip();
            });
        }

        element.appendChild(statArrow);

        body.appendChild(element);
    });

    if (errors.length > 0) {
        for (let i = 0; i < errors.length; i++) {
            if (errors[i].state === StatState.ERROR) {
                return StatState.ERROR;
            }
        }
        return StatState.WARNING;
    }
    return StatState.GOOD;
}