document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-button').onclick = () => {
        const formData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        };

        fetch('/login-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('uid', data.uid);
                }
                location.href = data.href;
            })
            .catch((error) => {
                console.error('Помилка:', error);
            });
    };
});