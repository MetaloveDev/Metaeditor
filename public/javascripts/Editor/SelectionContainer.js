document.addEventListener('DOMContentLoaded', () => {
    const workplace = document.getElementById('workplace');
    const selectionContainer = document.getElementById('selection-container');
    let isSelection = false;
    let startSelection;

    selectionContainer.style.display = 'none';

    workplace.onmousedown = function (e) {
        if (e.button !== 0) return;

        if (state !== State.NONE) return;

        if (workplace !== e.target) return;

        blocks.forEach(b => b.docElement.classList.remove('selected'));
        bookmarks.forEach(b => b.docElement.classList.remove('selected'));
        arrows.forEach(a => a.arrowParts.forEach(ap => ap.classList.remove('selected')));

        isSelection = true;
        startSelection = new Vector2(mousePosition.x, mousePosition.y);

        selectionContainer.style.display = 'block';
        selectionContainer.style.left = startSelection.x + "px";
        selectionContainer.style.top = startSelection.y + "px";

        state = State.SELECTING;
    }

    workplace.onmousemove = function (e) {
        if (isSelection === false) return;

        const size = mousePosition.subtract(startSelection);
        let left;
        let top;

        if (size.x < 0) {
            left = startSelection.x + size.x;
            selectionContainer.style.left = left + "px";
        }
        if (size.y < 0) {
            top = startSelection.y + size.y;
            selectionContainer.style.top = top + "px";
        }
        if (size.x >= 0 && size.y >= 0) {
            left = startSelection.x;
            top = startSelection.y;
            selectionContainer.style.left = left + "px";
            selectionContainer.style.top = top + "px";
        }

        selectionContainer.style.width = Math.abs(size.x) + "px";
        selectionContainer.style.height = Math.abs(size.y) + "px";

        blocks.forEach(b => b.docElement.classList.remove('selected'));
        arrows.forEach(a => a.arrowParts.forEach(ap => ap.classList.remove('selected')));

        let lowerY = startSelection.y;
        let upperY = mousePosition.y;

        let lowerX = startSelection.x;
        let upperX = mousePosition.x;

        let temp;
        if (lowerX > upperX) {
            temp = lowerX;
            lowerX = upperX;
            upperX = temp;
        }
        if (lowerY > upperY) {
            temp = lowerY;
            lowerY = upperY;
            upperY = temp;
        }

        blocks.forEach(b => {
            const rect = b.docElement.getBoundingClientRect();
            const position = new Vector2(b.position.x, b.position.y + (rect.height - b.size.y) / 2);

            if (
                position.x >= lowerX &&
                position.y >= lowerY &&
                position.x <= upperX &&
                position.y <= upperY
            ) {
                b.docElement.classList.add('selected');
            }
        });

        bookmarks.forEach(b => {
            if (
                b.position.x >= lowerX &&
                b.position.y >= lowerY &&
                b.position.x <= upperX &&
                b.position.y <= upperY
            ) {
                b.docElement.classList.add('selected');
                b.docElement.style.borderColor = selectedColor;
            }
        });
    }

    workplace.onmouseup = function (e) {
        if (state !== State.SELECTING) return;

        state = State.NONE;
        isSelection = false;
        selectionContainer.style.display = 'none';
        selectionContainer.style.width = "0px";
        selectionContainer.style.height = "0px";
    }
})