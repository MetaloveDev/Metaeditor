let checkList = [{ state: StatState.ERROR, message: "" }]

function getCheckList(body) {
    return;

    let i = 0;

    checkList.forEach(action => {
        const element = document.createElement('div');
        element.classList.add("stat-field");
        element.classList.add(i++ % 2 === 0 ? "pair" : "odd");

        const statIcon = document.createElement('img');
        statIcon.classList.add("checklist-icon");
        switch (action.state) {
            case StatState.GOOD:
                statIcon.src = "images/Icons/good.png";
                break;
            case StatState.WARNING:
                statIcon.src = "images/Icons/warning.png";
                break;
            case StatState.ERROR:
                statIcon.src = "images/Icons/error.png";
                break;
            default:
                break;
        }
        statIcon.draggable = false;
        statIcon.addEventListener('click', () => {
            switch (action.state) {
                case StatState.GOOD:
                    action.state = StatState.WARNING;
                    statIcon.src = "images/Icons/warning.png";
                    break;
                case StatState.WARNING:
                    action.state = StatState.ERROR;
                    statIcon.src = "images/Icons/error.png";
                    break;
                case StatState.ERROR:
                    action.state = StatState.GOOD;
                    statIcon.src = "images/Icons/good.png";
                    break;
                default:
                    break;
            }
        })
        element.appendChild(statIcon);

        const message = document.createElement("span");
        message.className = "textarea";
        message.setAttribute("role", "textbox");
        message.setAttribute("contenteditable", "");

        message.addEventListener('focus', function () {
            if (this.textContent === "Some action to do...") {
                this.textContent = "";
                this.style.opacity = 1;
            }
        });

        message.addEventListener('blur', function () {
            if (this.textContent.trim() === "") {
                this.textContent = "Some action to do...";
                this.style.opacity = 0.5;
            }
        });

        message.textContent = action.message;

        if (action.message.trim().length === 0) {
            message.textContent = "Some action to do...";
            message.style.opacity = 0.5;
        }

        const index = i - 1;
        message.addEventListener('input', () => checkList[index].message = message.textContent);
        element.appendChild(message);

        const deleteImg = document.createElement('img');
        deleteImg.src = "images/cross.png";
        deleteImg.draggable = false;
        deleteImg.classList.add("checklist-delete");
        deleteImg.addEventListener('click', () => {
            if (checkList.length === 1) return;

            checkList = [
                ...checkList.slice(0, index),
                ...checkList.slice(index + 1)
            ]
            body.innerHTML = '';
            getCheckList(body);
        });
        element.appendChild(deleteImg);

        const addImg = document.createElement('img');
        addImg.classList.add("checklist-add");
        addImg.src = "images/Buttons/plus.png";
        addImg.draggable = false;
        addImg.addEventListener('click', () => {
            checkList = [
                ...checkList.slice(0, index + 1),
                { state: StatState.ERROR, message: "" },
                ...checkList.slice(index + 1)
            ]
            body.innerHTML = '';
            getCheckList(body);
        })
        element.appendChild(addImg);

        body.appendChild(element);
    });
}