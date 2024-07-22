function exportToJson(chapter) {
    generateId();

    let data = {
        blocks: blocks,
        arrows: arrows,
    };

    const jsonString = JSON.stringify(data);
    const parsedData = JSON.parse(jsonString);

    console.log(parsedData);

    parsedData.arrows.sort((a, b) => {
        if (a.from < b.from) {
            return -1;
        }
        if (a.from > b.from) {
            return 1;
        }
        return 0;
    });

    let visited = [];

    function getSortedArrowsIndexes(arrow, neededIndex = null) {
        let part = [];

        if (arrow === undefined) {
            if (neededIndex !== null) {
                part.push(neededIndex);
                visited.push(neededIndex);
            }
            return part;
        }

        if (visited.includes(arrow.from)) return part;

        part.push(arrow.from);
        visited.push(arrow.from);

        let list = getDuplicateSourceToSource(parsedData.arrows, [arrow.from, arrow.to]);

        if (list.length === 0) return part;

        let sorted = [];
        for (let i = list.length - 1; i >= 0; i--) {
            sorted.push(getSortedArrowsIndexes(
                parsedData.arrows.find(item => item.from === list[i].to), list[i].to));
        }

        let duplicateJoin = [];
        for (let i = 0; i < sorted.length; i++) {
            for (let j = sorted[i].length - 1; j >= 0; j--) {
                if (!duplicateJoin.includes(sorted[i][j])) {
                    duplicateJoin.push(sorted[i][j]);
                }
            }
        }

        duplicateJoin.reverse();
        part = part.concat(duplicateJoin);

        return part;
    }

    const indexes = getSortedArrowsIndexes(parsedData.arrows[0]);

    const sortedArrows = [];
    for (let i = 0; i < indexes.length; i++) {
        let arrow = parsedData.arrows.find(item => item.from === indexes[i]);

        if (!arrow) continue;

        let duplicates = getDuplicateSourceToSource(parsedData.arrows, [arrow.from, arrow.to]);

        duplicates.forEach(item => {
            if (!sortedArrows.includes(item)) {
                sortedArrows.push(item);
            }
        });
    }

    const jsonGenerator = new JSONGenerator(chapter, parsedData.blocks, sortedArrows, indexes)
    const json = jsonGenerator.generate();

    return json;
}

const Type = {
    Source: 'Source',
    Destination: 'Destination'
};

function getDuplicateSourceToSource(arrowsList, arrow) {
    return getDuplicate(arrowsList, arrow, Type.Source, Type.Source);
}

function getDuplicateDestinationToSource(arrowsList, arrow) {
    return getDuplicate(arrowsList, arrow, Type.Destination, Type.Source);
}

function getDuplicateSourceToDestination(arrowsList, arrow) {
    return getDuplicate(arrowsList, arrow, Type.Source, Type.Destination);
}

function getDuplicate(arrowsList, arrow, type1, type2) {
    let duplicateArrows = [];

    arrowsList.forEach(v => {
        let value1 = type1 === Type.Source ? v.from : v.to;
        let value2 = type2 === Type.Source ? arrow[0] : arrow[1];
        if (value1 === value2) {
            duplicateArrows.push(v);
        }
    });

    return duplicateArrows;
}

function generateId() {
    blocks.sort((a, b) => {
        const scaleRate = 3;
        const ax = Math.round(a.position.x * cellSize.x * scaleRate) / (cellSize.x * scaleRate);
        const ay = Math.round(a.position.y * cellSize.x * scaleRate) / (cellSize.x * scaleRate);

        const bx = Math.round(b.position.x * cellSize.x * scaleRate) / (cellSize.x * scaleRate);
        const by = Math.round(b.position.y * cellSize.x * scaleRate) / (cellSize.x * scaleRate);

        if (ay === by) {
            return ax - bx;
        }
        return ay - by;
    });

    blocks.forEach((block, index) => {
        block.id = index + 1;
    });
}
