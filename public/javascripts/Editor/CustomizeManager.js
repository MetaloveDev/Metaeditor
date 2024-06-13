document.addEventListener('DOMContentLoaded', () => {
    const schemeToLoad = document.getElementById('schemeToLoad');
    const body = document.getElementById('customize-body-content');
    const templateMenu = document.getElementById('colors-template-menu');

    const resetFrameTypes = new Map();

    let chosenFrame;
    let chosenDiv;
    let chosenCircle;

    frameTypes.forEach((value, key) => {
        resetFrameTypes.set(key, value);
    })

    repaint = () => {
        body.innerHTML = '';
        frameTypes.forEach((value, key) => {
            const div = document.createElement('div');
            div.style.borderColor = value;

            div.classList.add('customize-element');

            const image = document.createElement('div');
            image.style.backgroundColor = value;
            div.appendChild(image);

            const text = document.createElement('p');
            text.textContent = key;
            div.appendChild(text);

            body.appendChild(div);

            div.onclick = () => {
                chosenFrame = key;
                chosenDiv = div;
                chosenCircle = image;

                const divRect = div.getBoundingClientRect();
                const bodyRect = body.getBoundingClientRect();

                templateMenu.style.top = divRect.y - bodyRect.y + 160 + 'px';
                templateMenu.style.left = divRect.x - bodyRect.x + 'px';

                templateMenu.style.display = 'flex';
            }
        });
    };

    colors.forEach(color => {
        const div = document.createElement('div');
        div.style.backgroundColor = color;

        div.onclick = () => {
            frameTypes.set(chosenFrame, div.style.backgroundColor);
            chosenDiv.style.borderColor = div.style.backgroundColor;
            chosenCircle.style.backgroundColor = div.style.backgroundColor;
            templateMenu.style.display = 'none';
        };

        templateMenu.appendChild(div);
    });

    document.addEventListener('click', function (event) {
        if (!event.target.matches('.customize-element')) {
            templateMenu.style.display = 'none';
        }
    });

    document.getElementById('save-scheme').onclick = () => {
        const mapArray = Array.from(frameTypes);
        let jsonString = JSON.stringify(mapArray);
        let blob = new Blob([jsonString], { type: "application/json" });
        let url = URL.createObjectURL(blob);

        let a = document.createElement("a");
        a.href = url;
        a.download = "customize.scheme";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    document.getElementById('load-scheme').onclick = () => {
        schemeToLoad.click();
    };

    schemeToLoad.addEventListener('change', (event) => {
        const files = event.target.files;
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const jsonArray = JSON.parse(text);
            frameTypes = new Map(jsonArray);
            repaint();
        };

        reader.readAsText(files[0]);
    });

    document.getElementById('reset-scheme').onclick = () => {
        resetFrameTypes.forEach((value, key) => {
            frameTypes.set(key, value);
        })

        repaint();
    };

    templateMenu.style.display = 'none';

    repaint();
})