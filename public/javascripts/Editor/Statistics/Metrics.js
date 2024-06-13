function getMetrics(body) {
    const values = [];
    values[0] = blocks.length;
    for (let i = 1; i < metricsList.length; i++) {
        values[i] = 0;
    }

    let blockPosition2 = null;
    let blockPosition11 = null;

    const backgroundsSet = new Set();
    blocks.forEach(block => {
        const frameType = block.header.input.textContent;
        if (frameType === 'Text') {
            const [chain, blockPosition] = getTextFrameChain(block, 1);

            if (chain > values[2]) {
                values[2] = chain;
                if (values[2] > metricsList[2][3] && blockPosition2 === null) {
                    blockPosition2 = blockPosition;
                }
            }
        }

        if (frameType === 'Option') {
            block.formsList.forEach(fl => {
                if (fl.keyForm.input.textContent === 'premium' && fl.valueForm.input.textContent === 'true') {
                    values[3]++;
                }
                if (fl.keyForm.input.textContent === 'luck-check') {
                    values[5]++;
                }
            });
        }

        if (frameType === 'Lucky') values[4]++;
        if (frameType === 'Customize') values[6]++;

        if (frameType === 'Love') {
            block.formsList.forEach(fl => {
                const value = fl.valueForm.input.textContent;
                if (fl.keyForm.input.textContent === 'character') {
                    if (value === 'Favn')
                        values[7]++;
                    else if (value === 'dealer') {
                        values[8]++;
                    }
                }
            });
        }

        block.formsList.forEach(fl => {
            if (fl.keyForm.input.textContent === 'location') {
                const value = fl.valueForm.input.textContent;
                if (value === 'moon_mother') {
                    values[10]++;
                }

                if (frameType !== 'Animation' && value !== undefined && backgroundsSet.has(value) === false) {
                    backgroundsSet.add(value);
                }
            }

            if (fl.keyForm.input.textContent === 'text') {
                const length = fl.valueForm.input.textContent.length;
                if (fl.valueForm.input.textContent !== 'None' && length > values[11]) values[11] = length;

                if ((values[11] > metricsList[11][3] || values[11] < metricsList[11][0]) && blockPosition11 === null) {
                    blockPosition11 = block.position;
                }
            }
        });

        if (frameType === 'Choice') {
            values[1]++;
            const props = [false, false, false];

            block.arrowsList.forEach(arrow => {
                if (arrow.toBlock.header.input.textContent === 'Option') {
                    let nextBlock = arrow.toBlock.arrowsList[1]?.toBlock;
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
                    }
                }
            });

            if (props[0] && props[1] && props[2]) {
                // moveViewportTo(block.position);
                values[9]++;
            }
        }
    });

    values[1] = (values[0] - values[1]) / ((values[1] === 0) ? 1 : values[1]);
    values[1] = Math.round(values[1] * 10) / 10;

    values[12] = backgroundsSet.size;

    let state = StatState.GOOD;

    for (let i = 0; i < values.length; i++) {
        const element = document.createElement('div');
        element.classList.add("stat-field");
        element.classList.add(i % 2 === 0 ? "pair" : "odd");

        const statIcon = document.createElement('img');
        statIcon.src = "images/Icons/error.png";
        let iStat = StatState.ERROR;
        if (values[i] > metricsList[i][1] && values[i] < metricsList[i][2]) {
            statIcon.src = "images/Icons/warning.png";
            iStat = StatState.WARNING;
        }
        else if (values[i] > metricsList[i][3] && values[i] < metricsList[i][4]) {
            statIcon.src = "images/Icons/warning.png";
            iStat = StatState.WARNING;
        }
        else if (values[i] >= metricsList[i][2] && values[i] <= metricsList[i][3]) {
            statIcon.src = "images/Icons/good.png";
            iStat = StatState.GOOD;
        }
        statIcon.draggable = false;

        element.appendChild(statIcon);

        if ((state === StatState.GOOD) || (state === StatState.WARNING && iStat === StatState.ERROR)) {
            state = iStat;
        }

        const name = document.createElement('p');
        name.textContent = metricsList[i][0];
        element.appendChild(name);

        const value = document.createElement('p');
        value.textContent = values[i];
        element.appendChild(value);

        const borders = document.createElement('p');
        borders.textContent = metricsList[i][2] + " - " + (metricsList[i][3] === Number.MAX_VALUE ? "Infinity" : metricsList[i][3]);
        element.appendChild(borders);

        const statArrow = document.createElement('img');
        if (metricsList[i][5] && iStat !== StatState.GOOD) {
            statArrow.src = "images/Icons/link.png";
            statArrow.draggable = false;
            statArrow.addEventListener('click', () => {
                if (i === 2 && blockPosition2 === null) return;
                if (i === 11 && blockPosition11 === null) return;

                moveViewportTo((i === 2) ? blockPosition2 : (i === 11) ? blockPosition11 : new Vector2(0, 0));

                document.getElementById("stats-window").classList.add("window-close");
                document.getElementById("stats-window").classList.remove("window-open");

                setTimeout(() => {
                    document.getElementById("stats").style.display = "none";
                }, 300);
            })
            element.appendChild(statArrow);
        }

        element.addEventListener('mouseover', (e) => {
            if (e.target !== statArrow)
                showTooltip(metricsList[i][6], new Vector2(e.clientX, e.clientY));
        });

        element.addEventListener('mouseout', () => {
            hideTooltip();
        });

        body.appendChild(element);
    }

    return state;
}

function getTextFrameChain(block, count) {
    let blockPosition;
    if (block !== undefined) {
        for (let i = 0; i < block.arrowsList.length; i++) {
            const arrow = block.arrowsList[i];

            blockPosition = arrow.toBlock.position;

            if (arrow.toBlock === block) continue;
            if (arrow.toBlock.header.input.textContent !== "Text") continue;

            [count, position] = getTextFrameChain(arrow.toBlock, ++count);
            blockPosition = position;
        }
    }

    return [count, blockPosition];
}