document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    loginUser();
});

function loginUser() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch(`http://wd.etsisi.upm.es:10000/users/login?username=${username}&password=${password}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 400) {
                throw new Error('Error: No username or password');
            } else if (response.status === 401) {
                throw new Error('Error: Invalid username/password supplied');
            } else if (response.status === 500) {
                throw new Error('Error: Internal server error');
            } else {
                throw new Error('Unexpected error occurred');
            }
        })
        .then(data => {
            if (data.startsWith('Bearer')) {
                localStorage.setItem('authToken', data);
                localStorage.setItem('username', username);
                showModal('Success', 'Login successful!', () => {
                    window.location.href = '../index.html';
                });
            } else {
                showModal('Error', 'Login failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showModal('Error', error.message);
        });
}

function showModal(title, message, callback) {
    const $loginModal = $('#loginModal');
    document.getElementById('loginModalLabel').innerText = title;
    document.getElementById('loginModalBody').innerText = message;

    $loginModal.modal('show');

    if (callback) {
        $loginModal.on('hidden.bs.modal', function() {
            callback();
            $(this).off('hidden.bs.modal');
        });
    }
}