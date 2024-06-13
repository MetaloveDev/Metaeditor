const uid = localStorage.getItem('uid').toString();

document.addEventListener('DOMContentLoaded', (event) => {
    const workplace = document.getElementById('workplace');
    let cursors = [];

    if (localStorage.getItem('uid') === null) {
        location.href = '/login';
        return;
    }

    writeActions = false;

    fetch('/load-project/' + localStorage.getItem('save-name').toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: uid
        })
    })
        .then(response => response.json())
        .then(data => {
            const bufferArray = new Uint8Array(data.data);
            const bufferString = new TextDecoder('utf-8').decode(bufferArray);
            const dataObject = JSON.parse(bufferString);
            fromJSONConvert(dataObject, workplace);
            socket.emit('joinRoom', localStorage.getItem('save-name').toString());
        })

    let autosave = () => {
        setTimeout(() => {
            save();
            autosave();
        }, autosaveDelay * 60000);
    };

    // autosave();

    let cursorUpdate = () => {
        setTimeout(() => {
            fetch('/cursor-positions-update/' + localStorage.getItem('save-name'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: localStorage.getItem('uid'),
                    x: mousePosition.x,
                    y: mousePosition.y,
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data == undefined) return;

                    data = data.filter(item => item.id !== localStorage.getItem('uid'));

                    while (data.length > cursors) {
                        cursors.push(new Cursor(workplace));
                    }
                    while (data.length < cursors) {
                        const cursor = cursors.pop();
                        cursor.remove();
                    }
                    for (let i = 0; i < data.length; i++) {
                        cursors[i].update(data[i].id, data[i].position.x, data[i].position.y);
                    }

                    cursorUpdate();
                })
        }, 100);
    }

    cursorUpdate();
});

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

    fetch('/save-project/' + localStorage.getItem('save-name').toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
}

window.addEventListener('beforeunload', function (event) {
    event.preventDefault();
    event.returnValue = '';

    save();

    fetch('/editor-exit/' + localStorage.getItem('save-name') + '/' + uid, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
            id: uid
        })
    })
});