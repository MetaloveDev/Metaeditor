class KeyValuePairForm {
    constructor(block, listKey, insertBeforeItem, id) {
        let opened = false;
        this.form = document.createElement('div');
        this.form.classList.add('key-value-pair-form');

        this.inputEvent = (value, id) => {
            const inputText = this.keyForm.input.textContent;

            let list = [];
            if (fieldTypes.hasOwnProperty(inputText)) {
                list = fieldTypes[inputText];
            }

            this.valueForm.list = list;

            this.setAvatarImage();
            this.isPremium();
            this.isComment();

            block.updateArrows();

            this.updateText(value, id);
        }

        this.updateText = (value, id) => {
            sendAction(ChangesType.BLOCK_TEXT_UPDATE, {
                blockEditorId: block.editorId,
                formEditorId: id,
                text: value
            });
        }

        block.docElement.insertBefore(this.form, insertBeforeItem);

        this.keyForm = new Form(this.form, listKey, null, 14, this.updateText, id + '_0')
        this.keyForm.form.style.marginRight = "50px"
        this.valueForm = new Form(this.form, [], null, 14, this.inputEvent, id + '_1')

        const background = document.createElement('div');
        background.classList.add('options')
        this.form.appendChild(background)

        const resize = document.createElement('img')
        resize.src = 'images/resize.png'
        resize.classList.add('resize')
        resize.draggable = false
        background.appendChild(resize)

        const textarea = document.createElement('textarea')
        block.docElement.appendChild(textarea)
        textarea.classList.add('textarea-display-none')

        this.keyForm.form.addEventListener('input', () => {
            this.inputEvent()
        });

        resize.addEventListener('click', (e) => {
            textarea.value = this.valueForm.input.textContent;
            textarea.classList.remove('textarea-display-none')

            textarea.classList.add('textarea-grow-up')
            textarea.classList.remove('textarea-grow-down')
            opened = true;
        })

        document.addEventListener('click', (e) => {
            if (e.target !== textarea && e.target !== resize) {

                if (opened) {
                    this.valueForm.input.textContent = textarea.value;
                }

                textarea.classList.remove('textarea-grow-up')
                textarea.classList.add('textarea-grow-down')
                opened = false;
            }
        })

        const remove = document.createElement('img')
        remove.src = 'images/cross.png'
        remove.classList.add('cross')
        remove.draggable = false

        background.appendChild(remove);

        remove.addEventListener('click', () => {
            block.formsList = block.formsList.filter(item => item !== this)
            this.setAvatarImage();
            this.isPremium();
            this.isComment();
            this.form.remove();

            updateEnd(block);

            sendAction(ChangesType.KEY_VALUE_PAIR_FORM_DELETE, {
                blockEditorId: block.editorId,
                formEditorId: id + '_0'
            });

            addUndoAction(() => {
                const keyValuePairForm = new KeyValuePairForm(block, Object.keys(fieldTypes), block.addButton, block.formsList.length);
                keyValuePairForm.keyForm.input.textContent = this.keyForm.input.textContent;
                keyValuePairForm.valueForm.input.textContent = this.valueForm.input.textContent;
                block.formsList.push();
                block.updateArrows();
                updateEnd(block);
            });
        })

        this.block = block;
    }

    setAvatarImage() {
        this.block.avatarPlaceholder.style.display = "none";
        this.block.formsList.forEach(f => {
            if (f.keyForm.input.textContent === 'character') {
                if (characterImages.hasOwnProperty(f.valueForm.input.textContent)) {
                    if (characterImages[f.valueForm.input.textContent] !== "") {
                        this.block.avatarPlaceholder.style.display = "block";
                        this.block.avatarPlaceholder.src = characterImages[f.valueForm.input.textContent];
                    }
                }
            }
        });
    }

    isPremium() {
        let isPremium = false;
        const link = "images/Icons/premium.png";

        this.block.formsList.forEach(f => {
            if (f.keyForm.input.textContent === 'premium') {
                if (f.valueForm.input.textContent === 'true') {
                    isPremium = true;
                }
            }
        });

        isPremium ? this.block.addIcon(link) : this.block.removeIcons(link);
    };

    isComment() {
        let isComment = false;
        const link = "images/Icons/chat.png";

        this.block.formsList.forEach(f => {
            if (f.keyForm.input.textContent === 'comment') {
                isComment = true;
            }
        });

        isComment ? this.block.addIcon(link) : this.block.removeIcons(link);
    };

    setKeyFormValue(value) {
        this.keyForm.input.textContent = value
    }

    toJSON() {
        return {
            key: this.keyForm,
            value: this.valueForm
        };
    }
}