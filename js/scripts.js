document.addEventListener('DOMContentLoaded', () => {
	// Inject NavBar into the placeholder div
	$("#navbar-placeholder").load("../utils/navbar.html", function(response, status, xhr) {
		let currentPath = window.location.pathname;
		$('#navbarNav .nav-link').each(function() {
			let href = $(this).attr('href');
			if (currentPath.includes(href)) {
				$(this).addClass('active');
			}
		});
	});

	// Register user
	const registerForm = document.getElementById('registerForm');
	if (registerForm) {
		registerForm.addEventListener('submit', function(event) {
			event.preventDefault();
			registerUser();
		});
	}

	// Login user
	const loginForm = document.getElementById('loginForm');
	if (loginForm) {
		loginForm.addEventListener('submit', function(event) {
			event.preventDefault();
			loginUser();
		});
	}
	loadPreferences();
	if (document.getElementById('records')) {
		fetchTopTenScores();
	}
});

function savePreferences() {
	const numUFOs = document.getElementById('numUFOs').value;
	const gameTime = document.getElementById('gameTime').value;
	localStorage.setItem('numUFOs', numUFOs);
	localStorage.setItem('gameTime', gameTime);
	alert('Preferences saved');
}

function loadPreferences() {
	if (document.getElementById('numUFOs') && document.getElementById('gameTime')) {
		document.getElementById('numUFOs').value = localStorage.getItem('numUFOs') || 5;
		document.getElementById('gameTime').value = localStorage.getItem('gameTime') || 60;
	}
}

function printTopTenScores(data) {
	let htmlContent = '<ul class="records-list">';
	data.forEach((record, index) => {
		htmlContent += `<li class="records-list-item">
            <div>
                <span class="record-number">${index + 1}.</span>
                <span class="record-username">${record.username}</span>
            </div>
            <span class="record-punctuation">${record.punctuation} points</span>
        </li>`;
	});
	htmlContent += '</ul>';
	document.getElementById('records').innerHTML = htmlContent;
}

function fetchTopTenScores() {
	fetch('http://wd.etsisi.upm.es:10000/records')
		.then(response => response.json())
		.then(data => printTopTenScores(data))
		.catch(error => console.error('Error fetching data:', error));
}

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
				console.log('Success:', data);
				alert('Login successful');
				localStorage.setItem('authToken', data);
			} else {
				alert('Login failed');
			}
		})
		.catch(error => {
			console.error('Error:', error);
			alert(error.message);
		});
}