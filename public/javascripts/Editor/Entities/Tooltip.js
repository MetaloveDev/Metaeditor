const tooltip = document.getElementById('tooltip');


function showTooltip(message, position) {
    if (message === undefined || message === null) return;
    if (position === undefined || position === null) return;

    tooltip.textContent = message;
    tooltip.style.display = 'block';

    tooltip.style.left = `${position.x}px`;
    tooltip.style.top = `${position.y}px`;
}

function hideTooltip() {
    tooltip.style.display = 'none';
}