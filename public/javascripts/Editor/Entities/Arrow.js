class Arrow {
    constructor(container, startBlock) {
        this.editorId = Date.now();

        const arrowPartsLenght = 3;

        this.arrowParts = []

        this.docElement = document.createElement('div')
        this.docElement.style.position = 'absolute'
        this.docElement.style.width = 'auto'
        this.docElement.style.height = 'auto'
        container.appendChild(this.docElement)

        for (let i = 0; i < arrowPartsLenght; i++) {
            let element = document.createElement('div')
            this.arrowParts.push(element)
            this.docElement.appendChild(element)
            element.classList.add('arrow');

            const clickZone = document.createElement('div');
            clickZone.style.position = 'absolute';
            clickZone.style.top = '-5px';
            clickZone.style.left = '-5px';
            clickZone.style.bottom = '-5px';
            clickZone.style.right = '-5px';
            clickZone.style.cursor = 'pointer';

            clickZone.addEventListener('click', (e) => {
                if (e.target === clickZone)
                    this.select();
            });

            element.appendChild(clickZone);

        }

        this.docElement.addEventListener('mousedown', (e) => {
            if (e.button == 2) {
                this.docElement.remove()
                this.form.form.remove()
            }
        })

        this.width = 2
        this.container = container
        this.from = null
        this.to = null

        this.form = new Form(container, arrowTypes, null, 16, (value, id) => {
            sendAction(ChangesType.ARROW_TEXT_UPDATE, {
                arrowEditorId: this.editorId,
                text: value
            });
        })
        this.form.form.classList.add('arrow-form')

        this.fromId = null
        this.toId = null

        this.fromBlock = startBlock
        this.toBlock = null

        checkEnd(this.fromBlock);
    }

    setFrom(from) {
        this.from = from
    }

    setTo(to, toBlock) {
        this.to = to
        this.toBlock = toBlock

        checkEnd(this.toBlock);
        checkEnd(this.fromBlock);

        trySetBegin(this.fromBlock);

        sendAction(ChangesType.ARROW_CREATE, {
            arrowEditorId: this.editorId,
            fromEditorId: this.fromBlock.editorId,
            toEditorId: this.toBlock.editorId
        });
    }

    placeArrow(mouse) {
        if (this.from == null && this.to == null) return

        var rect = this.container.getBoundingClientRect();
        var rect0;
        var rect1;
        var from;
        var to;

        if (this.from == null) {
            from = new Vector2(mouse.x - rect.left, mouse.y - rect.top)
        }
        else {
            if (this.fromBlock.docElement.classList.contains("invisible")) {
                const pos = new Vector2(this.fromBlock.position.x, this.fromBlock.position.y);
                this.fromBlock.position = pos;
                from = this.fromBlock.position.multiply(scale);
            } else {
                rect0 = this.from.getBoundingClientRect();
                from = new Vector2(rect0.left - rect.left + rect0.width / 2, rect0.top - rect.top + rect0.height / 2)
            }
        }

        if (this.to == null) {
            to = new Vector2(mouse.x - rect.left, mouse.y - rect.top)
        }
        else {
            if (this.toBlock.docElement.classList.contains("invisible")) {
                const pos = new Vector2(this.toBlock.position.x, this.toBlock.position.y);
                this.toBlock.position = pos;
                to = this.toBlock.position.multiply(scale);
            } else {
                rect1 = this.to.getBoundingClientRect();
                to = new Vector2(rect1.left - rect.left + rect1.width / 2, rect1.top - rect.top + rect1.height / 2)
            }
        }

        this.placeArrowParts(from.divide(scale), to.divide(scale))
    }

    placeArrowParts(from, to) {
        let distance = to.subtract(from)

        if (Math.abs(distance.y) > Math.abs(distance.x)) {
            let semiDistance = distance.y / 2

            if (distance.y < 0)
                this.arrowParts[0].style.top = `${from.y + semiDistance}px`;
            else
                this.arrowParts[0].style.top = `${from.y}px`;
            this.arrowParts[0].style.left = `${from.x}px`;
            this.arrowParts[0].style.height = `${Math.abs(semiDistance)}px`;
            this.arrowParts[0].style.width = `${this.width}px`;

            this.arrowParts[1].style.top = `${from.y + semiDistance}px`;
            if (distance.x > 0) {
                this.arrowParts[1].style.left = `${from.x}px`;
                this.form.form.style.left = `${from.x + (Math.abs(distance.x) / 2) - 50}px`;
            }
            else {
                this.arrowParts[1].style.left = `${from.x + distance.x}px`;
                this.form.form.style.left = `${from.x + distance.x + (Math.abs(distance.x) / 2) - 50}px`;
            }
            this.form.form.style.top = `${from.y + semiDistance - 10}px`

            this.arrowParts[1].style.width = `${Math.abs(distance.x)}px`;
            this.arrowParts[1].style.height = `${this.width}px`;

            if (distance.y < 0)
                this.arrowParts[2].style.top = `${to.y}px`;
            else
                this.arrowParts[2].style.top = `${from.y + semiDistance}px`;
            this.arrowParts[2].style.left = `${to.x}px`;
            this.arrowParts[2].style.height = `${Math.abs(semiDistance)}px`;
            this.arrowParts[2].style.width = `${this.width}px`;
        } else {
            let semiDistance = distance.x / 2

            if (distance.x < 0)
                this.arrowParts[0].style.left = `${from.x + semiDistance}px`;
            else
                this.arrowParts[0].style.left = `${from.x}px`;
            this.arrowParts[0].style.top = `${from.y}px`;
            this.arrowParts[0].style.height = `${this.width}px`;
            this.arrowParts[0].style.width = `${Math.abs(semiDistance)}px`;

            if (distance.y < 0) {
                this.arrowParts[1].style.top = `${from.y + distance.y}px`;
                this.form.form.style.top = `${from.y + distance.y + Math.abs(distance.y) / 2 - 10}px`;
            }
            else {
                this.arrowParts[1].style.top = `${from.y}px`;
                this.form.form.style.top = `${from.y + Math.abs(distance.y) / 2 - 10}px`;
            }
            this.arrowParts[1].style.left = `${from.x + semiDistance}px`;
            this.form.form.style.left = `${from.x + semiDistance - 50}px`;
            this.arrowParts[1].style.width = `${this.width}px`;
            this.arrowParts[1].style.height = `${Math.abs(distance.y)}px`;

            if (distance.x < 0)
                this.arrowParts[2].style.left = `${to.x}px`;
            else
                this.arrowParts[2].style.left = `${to.x - semiDistance}px`;
            this.arrowParts[2].style.top = `${to.y}px`;
            this.arrowParts[2].style.height = `${this.width}px`;
            this.arrowParts[2].style.width = `${Math.abs(semiDistance)}px`;
        }
    }

    deleteArrow() {
        arrows = arrows.filter(item => item !== this);
        blocks.forEach(b => b.arrowsList = b.arrowsList.filter(item => item !== this));

        checkEnd(this.fromBlock);
        checkEnd(this.toBlock);

        trySetBegin(this.toBlock);

        this.docElement.remove();
        this.form.form.remove();

        sendAction(ChangesType.ARROW_DELETE, {
            arrowEditorId: this.editorId
        });
    }

    setColor(color) {
        for (let i = 0; i < this.arrowParts.length; i++) {
            this.arrowParts[i].style.backgroundColor = color;
        }
    }

    select() {
        blocks.forEach(b => b.docElement.classList.remove('selected'));
        arrows.forEach(a => a.arrowParts.forEach(ap => ap.classList.remove('selected')));
        bookmarks.forEach(b => b.docElement.classList.remove('selected'));

        this.arrowParts.forEach(ap => ap.classList.add('selected'));

        setTimeout(() => this.setColor(selectedColor), 1);
    }

    setFormValue(value) {
        this.form.input.textContent = value
    }

    toJSON() {
        return {
            editorId: this.editorId,
            from: this.fromBlock.id,
            to: this.toBlock.id,
            value: this.form,
        };
    }
}