document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;

            if (password !== confirmPassword) {
                event.preventDefault();
                showModal('Error', 'Passwords do not match. Please try again.');
                return;
            }

            event.preventDefault();
            registerUser();
        });
    }
});

function registerUser() {
    const username = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    fetch('http://wd.etsisi.upm.es:10000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: new URLSearchParams({
            'username': username,
            'email': email,
            'password': password
        })
    })
        .then(response => {
            if (response.status === 201) {
                showModal('Success', 'User registered successfully!', () => {
                    loginAfterRegister(username, password);
                });
            } else if (response.status === 400) {
                showModal('Error', 'Missing username, email, or password.');
            } else if (response.status === 409) {
                showModal('Error', 'Username already exists.');
            } else if (response.status === 500) {
                showModal('Error', 'Internal server error. Please try again later.');
            } else {
                return response.json().then(data => {
                    console.error('Unexpected response:', data);
                    showModal('Error', 'An unexpected error occurred.');
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showModal('Error', 'Error registering user. Please try again later.');
        });
}

function loginAfterRegister(username, password) {
    fetch(`http://wd.etsisi.upm.es:10000/users/login?username=${username}&password=${password}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Unexpected error occurred');
            }
        })
        .then(data => {
            if (data.startsWith('Bearer')) {
                localStorage.setItem('authToken', data);
                localStorage.setItem('username', username);
                window.location.href = '../index.html';
            } else {
                showModal('Error', 'Login failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showModal('Error', error.message);
        });
}