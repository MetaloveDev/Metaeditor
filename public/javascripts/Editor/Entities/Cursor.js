class Cursor {
    constructor(container) {
        this.docElement = document.createElement('div');
        this.docElement.classList.add('cursor');
        this.text = document.createElement('p');
        this.docElement.appendChild(this.text);
        container.appendChild(this.docElement);
    }

    update(text, x, y) {
        this.docElement.style.left = x + 'px';
        this.docElement.style.top = y + 'px';
        this.text.textContent = text;
    }

    remove() {
        this.text = null;
        this.docElement = null;
    }
}