class Block {
    constructor(position, size, container) {
        this.size = size;
        this.position = position;
        this.id = 0;
        this.editorId = Date.now();
        this.formIdCounter = 0;

        this.icons = new Set();

        this.docElement = document.createElement('div');
        this.docElement.id = 'frame';
        this.docElement.classList.add('frame');
        this.docElement.style.width = this.size.x + 'px';
        this.docElement.style.minHeight = this.size.y + 'px';

        let adjustedPosition = new Vector2(
            Math.round(this.position.x / cellSize.x) * cellSize.x,
            Math.round(this.position.y / cellSize.y) * cellSize.y
        );
        this.docElement.style.left = (adjustedPosition.x - this.size.x / 2.0) + 'px';
        this.docElement.style.top = (adjustedPosition.y - this.size.y / 2.0) + 'px';
        container.appendChild(this.docElement);

        this.avatarPlaceholder = document.createElement('img');
        this.avatarPlaceholder.src = 'images/placeholder.png'
        this.avatarPlaceholder.width = "50"
        this.avatarPlaceholder.height = "50"
        this.avatarPlaceholder.style.position = "absolute"
        this.avatarPlaceholder.style.top = "15px"
        this.avatarPlaceholder.style.right = "25px"
        this.avatarPlaceholder.style.cursor = "pointer"
        this.avatarPlaceholder.style.borderRadius = "50%"
        this.avatarPlaceholder.style.display = "none"
        this.avatarPlaceholder.draggable = false;
        this.docElement.appendChild(this.avatarPlaceholder);

        this.iconContainer = document.createElement('div');
        this.iconContainer.classList.add('icon-holder');
        this.docElement.appendChild(this.iconContainer);

        this.addButton = document.createElement('button');
        this.addButton.textContent = '+ Add';
        this.addButton.classList.add('add-button');
        this.topPoint = document.createElement('div');
        this.topPoint.style.position = 'absolute';
        this.topPoint.style.top = '0px';
        this.topPoint.style.left = '50%';
        const point = document.createElement('div');
        point.style.position = 'relative';
        this.bottomPoint = document.createElement('div');
        this.bottomPoint.classList.add('point');

        this.arrowTrigger = document.createElement('div');
        this.arrowTrigger.style.position = 'absolute';
        this.arrowTrigger.style.zIndex = 1000;
        this.arrowTrigger.style.top = 0;
        this.arrowTrigger.style.left = 0;
        this.arrowTrigger.style.right = 0;
        this.arrowTrigger.style.bottom = 0;
        this.arrowTrigger.style.display = 'none';

        this.docElement.appendChild(this.arrowTrigger);
        this.docElement.appendChild(this.topPoint);
        this.docElement.appendChild(this.addButton);
        this.docElement.appendChild(point);
        point.appendChild(this.bottomPoint);
        this.header = new Form(this.docElement, [...frameTypes.keys()], this.addButton, 16, (value, id) => {
            let color = frameTypes.get(value)
            this.changeColor(color ? color : '#fff');
            const loveLink = "images/Icons/love.png";
            const luckyLink = "images/Icons/luck.png";
            const counterLink = "images/Icons/counter.png";

            (value === 'Love') ? this.addIcon(loveLink) : this.removeIcons(loveLink);
            (value === 'Lucky') ? this.addIcon(luckyLink) : this.removeIcons(luckyLink);
            (value === 'Counter') ? this.addIcon(counterLink) : this.removeIcons(counterLink);

            sendAction(ChangesType.BLOCK_TEXT_UPDATE, {
                blockEditorId: this.editorId,
                formEditorId: id,
                text: value
            });

        }, this.formIdCounter++);
        this.header.form.style.marginBottom = '10px';
        this.header.form.style.marginLeft = '10px';
        this.header.form.style.maxWidth = '50%';

        this.formsList = []
        this.arrowsList = []

        this.addButton.addEventListener('click', () => {
            const keyValuePairForm = this.addKeyValueForm();

            addUndoAction(() => {
                keyValuePairForm.setAvatarImage();
                keyValuePairForm.isPremium();
                keyValuePairForm.isComment();
                this.formsList = this.formsList.filter(item => item !== keyValuePairForm)
                keyValuePairForm.form.remove();
                updateEnd(this);
            });
        });

        this.docElement.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });

        this.bottomPoint.addEventListener('contextmenu', (e) => {
            if (e.button === 2) {
                if (e.target === this.bottomPoint && state === State.NONE && blockToConnect == null) {
                    setTimeout(() => state = State.BLOCK_CONNECTION, 500);

                    blockToConnect = this;

                    const panel = document.getElementById("block-connection-info-panel");

                    panel.style.display = 'flex';

                    const height = this.docElement.offsetHeight;

                    let adjustedPosition = new Vector2(
                        Math.round((this.position.x) / cellSize.x) * cellSize.x,
                        Math.round((this.position.y - 20 + height) / cellSize.y) * cellSize.y
                    );

                    panel.style.left = adjustedPosition.x + "px";
                    panel.style.top = adjustedPosition.y + "px";

                    blocks.forEach(b => {
                        b.arrowTrigger.style.display = 'block';
                    });
                }
            }
        });

        this.docElement.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                if (e.target === this.bottomPoint && state === State.NONE) {
                    arrowToMove = new Arrow(workplace, this);
                    arrowToMove.setFrom(this.bottomPoint);
                    state = State.ARROW_MOVING;

                    blocks.forEach(b => {
                        b.arrowTrigger.style.display = 'block';
                    });
                    return;
                }

                if (e.target !== this.docElement) return;

                if (state === State.NONE) {
                    state = State.BLOCKS_MOVING;
                }
                if (e.shiftKey) {
                    if (this.docElement.classList.contains('selected')) {
                        this.docElement.classList.remove('selected');
                    } else {
                        this.docElement.classList.add('selected');
                    }
                } else {
                    if (!this.docElement.classList.contains('selected'))
                        this.select();
                }

                this.changeColor(selectedColor);
            }
        })

        checkEnd(this);

        this.linkButton = document.createElement('div');
        this.linkButton.classList.add('link-button');
        this.linkButton.style.backgroundImage = `url("images/linkwhite.png")`;

        const div = document.createElement('div');
        div.style.display = 'none';
        const text = document.createElement('p');
        text.textContent = "Copied!";
        div.appendChild(text);
        this.linkButton.appendChild(div);

        this.linkButton.onclick = () => {
            div.style.display = 'block';

            navigator.clipboard.writeText(this.editorId)
                .then(() => {
                    console.log('Text copied to clipboard');
                })
                .catch(err => {
                    console.error('Failed to copy text to clipboard:', err);
                });

            setTimeout(() => div.style.display = 'none', 2000);
        };

        this.docElement.appendChild(this.linkButton);

        sendAction(ChangesType.BLOCK_CREATE, {
            blockEditorId: this.editorId,
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

        this.updateArrows();

        sendAction(ChangesType.BLOCK_MOVING, {
            editorId: this.editorId,
            position: this.position
        });

        updateEnd(this);
    }

    placeToNewPosition(newPosition) {
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;

        this.docElement.style.left = (this.position.x - this.size.x / 2.0) + 'px';
        this.docElement.style.top = (this.position.y - this.size.y / 2.0) + 'px';

        this.updateArrows();

        updateEnd(this);
    }

    updateArrows() {
        this.arrowsList.forEach(arrow => {
            if (arrow.docElement == null)
                this.arrowsList = this.arrowsList.filter(item => item !== arrow);

            arrow.placeArrow()
        });
    }

    changeColor(color) {
        if (this.docElement?.classList.contains('selected')) {
            color = selectedColor
        }
        if (this.docElement !== null)
            this.docElement.style.borderColor = color
        this.header.input.style.borderColor = color
        this.header.input.style.color = color
        this.bottomPoint.style.backgroundColor = color
        for (let i = 0; i < this.arrowsList.length; i++) {
            if (this.arrowsList[i].fromBlock == this) {
                this.arrowsList[i].setColor(color)
            }
        }
    }

    addIcon(icon) {
        if (!this.icons.has(icon)) {
            this.icons.add(icon);
            this.recalculateIcons();
        }
    }

    removeIcons(icon) {
        if (this.icons.has(icon)) {
            this.icons.delete(icon);
            this.recalculateIcons();
        }
    }

    recalculateIcons() {
        this.iconContainer.innerHTML = '';
        this.icons.forEach(icon => {
            const img = document.createElement('img');
            img.src = icon;
            img.draggable = false;
            this.iconContainer.appendChild(img);
        });
    }

    remove() {
        this.docElement.remove();
        this.arrowsList.forEach(arrow => {
            arrow.deleteArrow()
        })

        blocks = blocks.filter(item => item !== this);

        this.docElement = null;

        deleteEnd(this);

        sendAction(ChangesType.BLOCK_DELETE, {
            blockEditorId: this.editorId,
        });
    }

    select() {
        blocks.forEach(b => b.docElement.classList.remove('selected'));
        arrows.forEach(a => a.arrowParts.forEach(ap => ap.classList.remove('selected')));
        bookmarks.forEach(b => b.docElement.classList.remove('selected'));

        this.docElement.classList.add('selected');
    }

    setVisible(visibility) {
        switch (visibility) {
            case Visibility.VISIBLE:
                this.docElement.classList.remove('invisible');
                this.avatarPlaceholder.classList.remove('invisible');
                this.addButton.classList.remove('invisible');
                this.formsList.forEach(f => {
                    f.form.classList.remove('invisible');
                });
                this.arrowsList.forEach(a => {
                    a.docElement.classList.remove('invisible');
                    a.form.form.classList.remove('invisible');
                });
                break;
            case Visibility.PARTIALLY_VISIBLE:
                this.docElement.classList.remove('invisible');
                this.avatarPlaceholder.classList.add('invisible');
                this.addButton.classList.add('invisible');
                this.formsList.forEach(f => {
                    f.form.classList.add('invisible');
                });
                break;
            case Visibility.INVISIBLE:
                this.docElement.classList.add('invisible');
                this.avatarPlaceholder.classList.add('invisible');
                this.addButton.classList.add('invisible');
                this.formsList.forEach(f => {
                    f.form.classList.add('invisible');
                });
                break;
            default:
                break;
        }

        this.updateArrows();
    }

    setPointScale(scale) {
        this.bottomPoint.parentNode.style.scale = scale <= 0.3 ? (0.3 / scale) : 1.0;
    }

    addKeyValueForm() {
        const keyValuePairForm = new KeyValuePairForm(this, Object.keys(fieldTypes), this.addButton, this.formIdCounter++)
        this.formsList.push(keyValuePairForm);
        this.updateArrows();
        updateEnd(this);

        sendAction(ChangesType.KEY_VALUE_PAIR_FORM_ADD, {
            blockEditorId: this.editorId
        });

        return keyValuePairForm;
    }

    toJSON() {
        return {
            id: this.id,
            editorId: this.editorId,
            header: this.header,
            position: this.position,
            formsList: this.formsList
        };
    }
}