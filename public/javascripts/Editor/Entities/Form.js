class Form {
    constructor(container, list, insertBeforeItem, fontSize, method = null, id) {
        this.editorId = id;

        this.form = document.createElement('div');
        this.form.classList.add('autocomplete');

        this.input = document.createElement("span");
        this.input.className = "textarea";
        this.input.setAttribute("role", "textbox");
        this.input.setAttribute("contenteditable", "");
        // this.input.id = 'formInput' + id;
        this.input.classList.add('formInput')
        this.input.style.fontSize = fontSize + "px"
        this.input.style.minHeight = (fontSize + 1) + "px"
        this.input.style.lineHeight = (fontSize + 1) + "px"
        this.input.textContent = "None";

        this.image = document.createElement('img');
        this.image.src = 'images/tip.png';
        this.image.style.width = "15px"
        this.image.style.height = "15px"
        this.image.style.marginRight = "10px"
        this.image.style.transition = "transform ease-in-out 0.3s"
        this.image.style.transform = "rotate(180deg)"
        this.image.draggable = false

        this.autocompleteList = document.createElement('div');
        this.autocompleteList.classList.add('autocomplete-items');
        this.autocompleteList.id = 'autocomplete-list';

        this.list = list;

        if (insertBeforeItem)
            container.insertBefore(this.form, insertBeforeItem);
        else
            container.appendChild(this.form)

        this.form.appendChild(this.image);
        this.form.appendChild(this.input);
        this.form.appendChild(this.autocompleteList);

        this.input.addEventListener('input', () => {
            this.typeEvent(this.input)
        });

        this.input.addEventListener('click', () => {
            this.typeEvent(this.input)
        });

        document.addEventListener('click', e => {
            if (e.target.id != 'formInput' + id) {
                this.input.style.borderBottom = ""
                this.autocompleteList.innerHTML = '';
                this.image.style.transform = "rotate(180deg)"
                if (method) method(this.input.textContent, this.editorId);
            }
        });

        this.method = method;

        this.autocompleteList.addEventListener('wheel', function (e) {
            if ((this.scrollHeight - this.scrollTop <= this.clientHeight && e.deltaY > 0) || (this.scrollTop === 0 && e.deltaY < 0)) {
                e.preventDefault();
            }
        }, { passive: false });

        this.lastInputValue = "";

        this.input.addEventListener('focus', function () {
            this.lastInputValue = this.textContent;

            if (this.textContent === "None") {
                this.textContent = "";
            }

            this.style.opacity = 1;
        });

        let trySetPlaceholder = () => {
            if (this.input.textContent.trim() === "" || this.input.textContent === "None") {
                this.input.textContent = "None";
                this.input.style.opacity = 0.5;
            } else {
                this.input.style.opacity = 1;
            }
        }

        this.input.addEventListener('blur', function () {
            trySetPlaceholder();
            if (this.lastInputValue !== this.textContent) {
                const lastInput = this.lastInputValue;
                addUndoAction(() => this.textContent = lastInput);
            }
        });

        setTimeout(() => trySetPlaceholder(), 10);
    }

    typeEvent(input) {
        input.style.borderBottom = "2px solid"
        const inputText = input.textContent;
        this.autocompleteList.innerHTML = '';
        this.image.style.transform = "rotate(0deg)"

        this.list.forEach(item => {
            if (inputText === '' || item.substr(0, inputText.length).toUpperCase() === inputText.toUpperCase()) {
                let divElement = document.createElement('div');
                scrollable.push(divElement)
                divElement.innerHTML = inputText !== '' ? `<b>${item.substr(0, inputText.length)}</b>${item.substr(inputText.length)}` : item;
                divElement.addEventListener('click', () => {
                    this.lastInputValue = input.textContent;
                    input.textContent = item;
                    input.style.opacity = 1;

                    this.autocompleteList.innerHTML = '';
                    if (this.method !== null) {
                        this.method(item, this.editorId)
                    }

                    addUndoAction(() => input.textContent = this.lastInputValue);
                });
                this.autocompleteList.appendChild(divElement);
            }
        });
        if (this.method !== null) {
            this.method(inputText, this.editorId)
        }
    }

    toJSON() {
        return {
            input: this.input.textContent
        };
    }
}