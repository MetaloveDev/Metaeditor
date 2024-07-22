class EndBlock {
    constructor(block, container) {
        this.state = true;

        this.docElement = document.createElement('div');
        this.docElement.classList.add('chapter-end-block');

        const p = document.createElement('p');
        const img = document.createElement('img');
        this.docElement.appendChild(p);
        this.docElement.appendChild(img);

        this.docElement.onclick = () => {
            changeStatus();
        }

        container.appendChild(this.docElement);

        let changeStatus = () => {
            this.state = !this.state;

            this.docElement.style.backgroundColor = this.state ? "#254E39" : "#461B24";
            this.docElement.style.borderColor = this.state ? "#4AFF67" : "#FF0000";
            p.textContent = this.state ? "End of chapter" : "Dead-end line";
            img.src = this.state ? "images/Icons/good.png" : "images/Icons/error.png";
        }

        this.block = block;

        changeStatus();
        this.updatePosition();
    }

    deleteEndBlock() {
        this.docElement.remove();
        this.docElement = null;
    }

    updatePosition() {
        if (this.block.docElement === undefined || this.block.docElement === null) {
            this.deleteEndBlock();
            return;
        }

        const height = this.block.docElement.offsetHeight;

        let adjustedPosition = new Vector2(
            Math.round((this.block.position.x + 20) / cellSize.x) * cellSize.x,
            Math.round((this.block.position.y + 50 + height) / cellSize.y) * cellSize.y
        );

        this.docElement.style.left = adjustedPosition.x + "px";
        this.docElement.style.top = adjustedPosition.y + "px";
    }
}