class Bookmark {
    constructor(position, container) {
        this.editorId = Date.now();

        this.size = new Vector2(500, 100);

        this.position = position;

        this.docElement = document.createElement('div');
        this.docElement.classList.add('bookmark');

        const image = document.createElement('img');
        image.src = 'images/Icons/bookmark.png';
        image.draggable = false;
        this.docElement.appendChild(image);

        this.header = new Form(this.docElement, [], null, 18, (value, id) => {
            sendAction(ChangesType.BOOKMARK_TEXT_UPDATE, {
                bookmarkEditorId: this.editorId,
                text: value
            });
        });
        this.header.form.style.margin = '10px 25px';

        let adjustedPosition = new Vector2(
            Math.round(this.position.x / cellSize.x) * cellSize.x,
            Math.round(this.position.y / cellSize.y) * cellSize.y
        );
        this.docElement.style.left = (adjustedPosition.x - this.size.x / 2.0) + 'px';
        this.docElement.style.top = (adjustedPosition.y - this.size.y / 2.0) + 'px';
        this.docElement.style.width = this.size.x + 'px';
        this.docElement.style.minHeight = this.size.y + 'px';

        container.appendChild(this.docElement);

        this.docElement.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });

        document.addEventListener('mousedown', (e) => {
            if (this.docElement.classList.contains('selected') == false) {
                this.docElement.style.borderColor = "#fff";
            }
        });

        this.docElement.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                if (e.target !== this.docElement) return;

                if (state === State.NONE) {
                    state = State.BLOCKS_MOVING;
                }
                if (e.shiftKey) {
                    if (this.docElement.classList.contains('selected')) {
                        this.docElement.classList.remove('selected');
                    } else {
                        this.docElement.classList.add('selected');
                        this.docElement.style.borderColor = selectedColor;
                    }
                } else {
                    if (!this.docElement.classList.contains('selected'))
                        this.select();
                }
            }
        })

        sendAction(ChangesType.BOOKMARK_CREATE, {
            bookmarkEditorId: this.editorId,
            position: this.position
        });
    }

    placeToMousePosition(delta) {
        this.position.x += delta.x
        this.position.y += delta.y

        let adjustedPosition = new Vector2(
            Math.round(this.position.x / cellSize.x) * cellSize.x,
            Math.round(this.position.y / cellSize.y) * cellSize.y
        );

        this.docElement.style.left = (adjustedPosition.x - this.size.x / 2.0) + 'px';
        this.docElement.style.top = (adjustedPosition.y - this.size.y / 2.0) + 'px';

        sendAction(ChangesType.BOOKMARK_MOVING, {
            bookmarkEditorId: this.editorId,
            position: this.position
        });
    }

    placeToNewPosition(newPosition) {
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;

        this.docElement.style.left = (this.position.x - this.size.x / 2.0) + 'px';
        this.docElement.style.top = (this.position.y - this.size.y / 2.0) + 'px';

        this.updateArrows();

        updateEnd(this);
    }

    select() {
        blocks.forEach(b => b.docElement.classList.remove('selected'));
        bookmarks.forEach(b => b.docElement.classList.remove('selected'));
        arrows.forEach(a => a.arrowParts.forEach(ap => ap.classList.remove('selected')));

        this.docElement.classList.add('selected');

        setTimeout(() => this.docElement.style.borderColor = selectedColor, 1);
    }

    remove() {
        this.docElement.remove();

        bookmarks = bookmarks.filter(item => item !== this);

        this.docElement = null;

        sendAction(ChangesType.BOOKMARK_DELETE, {
            bookmarkEditorId: this.editorId
        });
    }

    toJSON() {
        return {
            editorId: this.editorId,
            header: this.header,
            position: this.position
        };
    }
}