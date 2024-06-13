let lastAddedBlock;

document.addEventListener('DOMContentLoaded', () => {
    const fileInputToLoad = document.getElementById('fileInputToLoad');
    const workplace = document.getElementById('workplace');
    let isOnWorkplace;

    workplace.addEventListener('mouseover', (e) => {
        isOnWorkplace = e.target === workplace;
    });

    workplace.addEventListener('mouseout', () => {
        isOnWorkplace = false;
    });

    document.addEventListener('keydown', function (event) {
        if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'C' || event.key === 'с' || event.key === 'С')) {
            copy();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'v' || event.key === 'V' || event.key === 'м' || event.key === 'М')) {
            paste();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 's' || event.key === 'S' || event.key === 'ы' || event.key === 'Ы')) {
            event.preventDefault();
            save();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'o' || event.key === 'O' || event.key === 'щ' || event.key === 'Щ')) {
            event.preventDefault();
            load();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'd' || event.key === 'D' || event.key === 'в' || event.key === 'В')) {
            event.preventDefault();
            duplicate();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'e' || event.key === 'E' || event.key === 'у' || event.key === 'У')) {
            event.preventDefault();
            showChapterPopup();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'i' || event.key === 'I' || event.key === 'ш' || event.key === 'Ш')) {
            event.preventDefault();
            statsPopupOpen();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'h' || event.key === 'H' || event.key === 'р' || event.key === 'Р')) {
            event.preventDefault();
            helpPopupOpen();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'u' || event.key === 'U' || event.key === 'г' || event.key === 'Г')) {
            event.preventDefault();
            customizePopupOpen();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'b' || event.key === 'B' || event.key === 'и' || event.key === 'И')) {
            event.preventDefault();
            moveToBegin();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 't' || event.key === 'T' || event.key === 'е' || event.key === 'Е')) {
            event.preventDefault();
            moveToEnd();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'z' || event.key === 'Z' || event.key === 'я' || event.key === 'Я')) {
            event.preventDefault();
            undo();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && (event.key === 'r' || event.key === 'R' || event.key === 'к' || event.key === 'К')) {
            event.preventDefault();
            return;
        }
    });

    document.getElementById("loadButton").addEventListener('click', load)

    document.getElementById("exportButton").addEventListener('click', showChapterPopup)
    document.getElementById("stats-export").addEventListener('click', showChapterPopup)

    document.getElementById("customizeButton").addEventListener('click', customizePopupOpen)

    document.getElementById("link").addEventListener('click', showBlockIdPopup)

    fileInputToLoad.addEventListener('change', (event) => {
        const files = event.target.files;
        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target.result;
            let parsedData = JSON.parse(text);
            fromJSONConvert(parsedData, workplace)
        };

        reader.readAsText(files[0]);
    });

    document.getElementById("saveButton").addEventListener('click', save);

    function copy() {
        copiedBlocks = []
        blocks.forEach(b => {
            if (b.docElement.classList.contains('selected')) {
                copiedBlocks.push(b);
            }
        });
    }

    function paste() {
        if (isOnWorkplace === false) return;

        const dupBlocks = []

        copiedBlocks.forEach(b => {
            const original = b

            const point = new Vector2(original.position.x, original.position.y)

            let adjustedPosition = new Vector2(
                Math.round(point.x / cellSize.x) * cellSize.x,
                Math.round(point.y / cellSize.y) * cellSize.y
            );

            let block = new Block(adjustedPosition, blockSize, workplace, blocks.length)
            block.formsList = []
            block.arrowsList = []

            block.header.input.textContent = original.header.input.textContent;

            original.formsList.forEach(form => {
                const newForm = new KeyValuePairForm(block, fieldTypes, block.addButton, block.formsList.length);
                newForm.keyForm.input.textContent = form.keyForm.input.textContent;
                newForm.valueForm.input.textContent = form.valueForm.input.textContent;
                block.formsList.push(newForm);
            });

            dupBlocks.push(block);
        });

        const delta = mousePosition.subtract(dupBlocks[0].position);

        dupBlocks.forEach(b => {
            b.placeToMousePosition(delta);
            blocks.push(b);
        });
    }

    function duplicate() {
        const dupBlocks = []
        const selectedBlocks = []
        blocks.forEach(b => {
            if (b.docElement.classList.contains('selected')) {
                const original = b

                const point = new Vector2(original.position.x, original.position.y)

                let adjustedPosition = new Vector2(
                    Math.round(point.x / cellSize.x) * cellSize.x,
                    Math.round(point.y / cellSize.y) * cellSize.y
                );

                let block = new Block(adjustedPosition, blockSize, workplace, blocks.length)
                block.formsList = []
                block.arrowsList = []

                block.header.input.textContent = original.header.input.textContent;

                original.formsList.forEach(form => {
                    const newForm = new KeyValuePairForm(block, fieldTypes, block.addButton, block.formsList.length);
                    newForm.keyForm.input.textContent = form.keyForm.input.textContent;
                    newForm.valueForm.input.textContent = form.valueForm.input.textContent;
                    block.formsList.push(newForm);
                });

                dupBlocks.push(block);
                selectedBlocks.push(original);
            }
        })

        blocks.forEach(b => b.docElement.classList.remove('selected'));
        arrows.forEach(a => a.arrowParts.forEach(ap => ap.classList.remove('selected')));

        const delta = mousePosition.subtract(dupBlocks[0].position);

        dupBlocks.forEach(b => {
            b.placeToMousePosition(delta);
            b.docElement.classList.add('selected');
            blocks.push(b);
        });
    }

    function load() {
        fileInputToLoad.click();
    }

    function save() {
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

        let data = {
            blocks: blocks,
            arrows: arrows,
            checkList: checkList,
            bookmarks: bookmarks,
        };

        let jsonString = JSON.stringify(data);
        let blob = new Blob([jsonString], { type: "application/json" });
        let url = URL.createObjectURL(blob);

        let a = document.createElement("a");
        a.href = url;
        a.download = "save " + getCurrentDateTime() + ".cce";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function showChapterPopup() {
        const chapterPopup = document.getElementById('chapter-popup');

        if (chapterPopup.classList.contains("popup-open")) return;

        document.getElementById('chapter-poput-input').value = '';

        chapterPopup.style.display = 'flex';
        chapterPopup.classList.remove('popup-close');
        chapterPopup.classList.add('popup-open');
    }

    document.getElementById('chapter-poput-submit').addEventListener('click', () => {
        const chapterPopup = document.getElementById('chapter-popup');

        if (chapterPopup.classList.contains("popup-close")) return;
        const input = document.getElementById('chapter-poput-input').value;

        let num = Number(input);
        if (num === null || num === undefined || isNaN(num)) num = 0;
        exportToFile(num);

        chapterPopup.classList.remove('popup-open');
        chapterPopup.classList.add('popup-close');

        setTimeout(() => {
            chapterPopup.style.display = 'none';
        }, 450);
    });

    document.getElementById('chapter-poput-cancel').addEventListener('click', () => {
        const chapterPopup = document.getElementById('chapter-popup');

        if (chapterPopup.classList.contains("popup-close")) return;

        chapterPopup.classList.remove('popup-open');
        chapterPopup.classList.add('popup-close');

        setTimeout(() => {
            chapterPopup.style.display = 'none';
        }, 450);
    });

    function exportToFile(chapter) {
        const json = exportToJson(chapter);

        const exportInfoWindow = document.getElementById("export-info-popup");
        const exportInfoText = document.getElementById("export-info-text");
        const exportInfoButton = document.getElementById("export-info-submit");

        if (exportInfoWindow.classList.contains("popup-open")) return;

        exportInfoWindow.style.display = 'flex';
        exportInfoWindow.classList.remove('popup-close');
        exportInfoWindow.classList.add('popup-open');

        exportInfoButton.onclick = () => {
            if (exportInfoWindow.classList.contains("popup-close")) return;

            exportInfoWindow.classList.remove('popup-open');
            exportInfoWindow.classList.add('popup-close');

            setTimeout(() => {
                exportInfoWindow.style.display = 'none';
            }, 450);
        };

        const exportArrayLength = JSON.parse(json).length - 1;
        let blockArrayLength = 0;

        blocks.forEach(block => {
            if (block.header.input.textContent !== "Option") {
                blockArrayLength++;
            }
        });

        exportInfoText.style.whiteSpace = "pre";
        exportInfoText.textContent = "Blocks count: " + blockArrayLength + "\r\nFrames count: " + exportArrayLength;


        let blob = new Blob([json], { type: "application/json" });
        let url = URL.createObjectURL(blob);

        let a = document.createElement("a");
        a.href = url;
        a.download = `chapter${chapter} ${getCurrentDateTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function getCurrentDateTime() {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const date = now.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
        const dateTime = `${time} ${date}`;
        return dateTime;
    }

    document.getElementById("helpButton").addEventListener('click', helpPopupOpen)

    function helpPopupOpen() {
        document.getElementById("help").style.display = "block";
        setTimeout(() => {
            document.getElementById("help-window").classList.remove("window-close");
            document.getElementById("help-window").classList.add("window-open");
        }, 1)
    }

    document.getElementById('help-close').addEventListener('click', helpPopupClose)
    document.getElementById("help").addEventListener('click', (e) => {
        if (e.target.id === "help")
            helpPopupClose();
    })

    document.getElementById("help").onwheel = function (e) {
        e.preventDefault();
    }

    function helpPopupClose() {
        document.getElementById("help-window").classList.add("window-close");
        document.getElementById("help-window").classList.remove("window-open");

        setTimeout(() => {
            document.getElementById("help").style.display = "none";
        }, 300)
    }

    document.getElementById("statButton").addEventListener('click', statsPopupOpen)

    function statsPopupOpen() {
        document.getElementById("stats").style.display = "block";
        setTimeout(() => {
            document.getElementById("stats-window").classList.remove("window-close");
            document.getElementById("stats-window").classList.add("window-open");
        }, 1)
    }

    document.getElementById('stats-close').addEventListener('click', statsPopupClose)
    document.getElementById("stats").addEventListener('click', (e) => {
        if (e.target.id === "stats")
            statsPopupClose();
    })

    document.getElementById("stats").onwheel = function (e) {
        e.preventDefault();
    }

    function statsPopupClose() {
        document.getElementById("stats-window").classList.add("window-close");
        document.getElementById("stats-window").classList.remove("window-open");

        setTimeout(() => {
            document.getElementById("stats").style.display = "none";
        }, 300)
    }

    function customizePopupOpen() {
        document.getElementById("customize").style.display = "block";
        setTimeout(() => {
            document.getElementById("customize-window").classList.remove("window-close");
            document.getElementById("customize-window").classList.add("window-open");
        }, 1)
    }

    document.getElementById('customize-close').addEventListener('click', customizePopupClose)

    document.getElementById("customize").addEventListener('click', (e) => {
        if (e.target.id === "customize")
            customizePopupClose();
    })

    document.getElementById("customize").onwheel = function (e) {
        e.preventDefault();
    }

    function customizePopupClose() {
        document.getElementById("customize-window").classList.add("window-close");
        document.getElementById("customize-window").classList.remove("window-open");

        setTimeout(() => {
            document.getElementById("customize").style.display = "none";
        }, 300)
    }

    function moveToBegin() {
        moveViewportTo(beginBlock.position);
    }

    function moveToEnd() {
        if (lastAddedBlock === null || lastAddedBlock === undefined) return;

        const targetPosition = lastAddedBlock.position;

        moveViewportTo(targetPosition);
    }

    document.getElementById("target").onclick = moveToEnd;
    document.getElementById("up").onclick = moveToBegin;

    function showBlockIdPopup() {
        const idPopup = document.getElementById('block-id-popup');

        if (idPopup.classList.contains("popup-open")) return;

        document.getElementById('block-id-poput-input').value = '';

        idPopup.style.display = 'flex';
        idPopup.classList.remove('popup-close');
        idPopup.classList.add('popup-open');
    }

    document.getElementById('block-id-poput-submit').addEventListener('click', () => {
        const idPopup = document.getElementById('block-id-popup');

        if (idPopup.classList.contains("popup-close")) return;

        const input = document.getElementById('block-id-poput-input').value;
        console.log(input);

        let num = Number(input);
        if (num === null || num === undefined || isNaN(num)) num = 0;

        blocks.forEach(block => {
            if (block.editorId === num) {
                moveViewportTo(block.position);
                return;
            }
        });

        closeBlockIdPoput();
    });

    function closeBlockIdPoput() {
        const idPopup = document.getElementById('block-id-popup');

        if (idPopup.classList.contains("popup-close")) return;

        idPopup.classList.remove('popup-open');
        idPopup.classList.add('popup-close');

        console.log(idPopup.classList);

        setTimeout(() => {
            idPopup.style.display = 'none';
        }, 450);
    }

    document.getElementById('block-id-poput-cancel').addEventListener('click', closeBlockIdPoput);
})