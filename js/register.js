document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;

            if (password !== confirmPassword) {
                event.preventDefault();
                alert('Passwords do not match. Please try again.');
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
                alert('User registered successfully');
                loginUser(username, password);
            } else if (response.status === 400) {
                alert('Error: Missing username, email, or password');
            } else if (response.status === 409) {
                alert('Error: Duplicated username');
            } else if (response.status === 500) {
                alert('Error: Internal server error');
            } else {
                return response.json().then(data => {
                    console.error('Unexpected response:', data);
                    alert('Unexpected error occurred');
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error registering user');
        });
}