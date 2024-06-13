document.addEventListener('DOMContentLoaded', () => {
    let iconState = StatState.GOOD;
    const Window = {
        METRICS: 'METRICS',
        CONSOLE: 'CONSOLE',
        LIST: 'LIST'
    }

    let lastWindow = Window.METRICS;

    const metrics = document.getElementById('stat-metrics');
    const statConsole = document.getElementById('stat-console');
    const list = document.getElementById('stat-list');
    const icon = document.getElementById('stat-icon');
    const body = document.getElementById('stats-main-body');

    const content = document.createElement('div');
    content.classList.add('content');
    body.appendChild(content);

    let contentDelta = 0;
    body.onwheel = function (e) {
        contentDelta = Math.max(Math.min(contentDelta - e.deltaY, 0), -content.clientHeight);
        content.style.transform = "translateY(" + contentDelta + "px)";
    }

    document.getElementById('statButton').addEventListener('click', () => setWindow(lastWindow))

    document.getElementById('stat-metrics').addEventListener('click', () => setWindow(Window.METRICS))
    document.getElementById('stat-console').addEventListener('click', () => setWindow(Window.CONSOLE))
    document.getElementById('stat-list').addEventListener('click', () => setWindow(Window.LIST))

    function setWindow(window) {
        content.innerHTML = '';

        metrics.classList.remove("active");
        statConsole.classList.remove("active");
        list.classList.remove("active");

        metrics.classList.remove("unactive");
        statConsole.classList.remove("unactive");
        list.classList.remove("unactive");

        // let newState1 = getMetrics(body, showTooltip, hideTooltip);
        // let newState2 = getConsoleErrors(body, showTooltip, hideTooltip);

        // const ranks = {
        //     GOOD: 1,
        //     WARNING: 2,
        //     ERROR: 3
        // };

        // if (ranks[newState1] > ranks[newState2]) {
        //     iconState = newState1;
        // } else if (ranks[newState1] < ranks[newState2]) {
        //     iconState = newState2;
        // } else {
        //     iconState = newState2;
        // }

        contentDelta = 0;
        content.style.transform = "translateY(0px)";
        switch (window) {
            case Window.METRICS:
                metrics.classList.add("active");
                statConsole.classList.add("unactive");
                list.classList.add("unactive");
                iconState = getMetrics(content);
                break;
            case Window.CONSOLE:
                metrics.classList.add("unactive");
                statConsole.classList.add("active");
                list.classList.add("unactive");
                iconState = getConsoleErrors(content);
                break;
            case Window.LIST:
                metrics.classList.add("unactive");
                statConsole.classList.add("unactive");
                list.classList.add("active");
                getCheckList(content);
                break;
            default:
                break;
        }

        switch (iconState) {
            case StatState.GOOD:
                icon.src = "images/Icons/good.png";
                break;
            case StatState.WARNING:
                icon.src = "images/Icons/warning.png";
                break;
            case StatState.ERROR:
                icon.src = "images/Icons/error.png";
                break;
            default:
                break;
        }

        lastWindow = window;
    }


})
