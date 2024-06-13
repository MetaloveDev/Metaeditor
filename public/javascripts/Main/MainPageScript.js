document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('uid') === null) {
        location.href = '/login';
        return;
    }

    fetch('/load-data', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('saves-container');
            data.forEach(name => {
                const block = document.createElement('div');
                block.classList.add('save');
                const p = document.createElement('p');
                p.textContent = name;
                block.appendChild(p);
                container.appendChild(block);
                block.onclick = () => {
                    localStorage.setItem('save-name', name);
                    location.href = '/editor';
                };
            });
            const createBlock = document.createElement('div');
            createBlock.classList.add('save');
            const p = document.createElement('p');
            p.textContent = "+";
            createBlock.appendChild(p);
            container.appendChild(createBlock);
            createBlock.onclick = () => {
                lastName = prompt("Project Name");
                localStorage.setItem('save-name', lastName);
                fetch('/create-project/' + lastName, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                    body: JSON.stringify({})
                }).then(response => {
                    localStorage.setItem('save-name', lastName);
                    location.href = '/editor';
                });
            };
        })
        .catch((error) => {
            console.error('Помилка:', error);
        });
});