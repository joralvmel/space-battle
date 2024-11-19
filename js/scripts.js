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

		// Check if user is logged in and update the nav bar
		const authToken = localStorage.getItem('authToken');
		const loginNavItem = document.getElementById('loginNavItem');

		if (authToken && loginNavItem) {
			loginNavItem.innerHTML = '<a class="nav-link" href="#" id="logoutLink">Logout</a>';
			document.getElementById('logoutLink').addEventListener('click', function(event) {
				event.preventDefault();
				logoutUser();
			});
		}
	});

	function logoutUser() {
		localStorage.removeItem('authToken');
		localStorage.removeItem('username');
		window.location.href = '/space-battle/pages/login.html';
	}

	// Display welcome message on index.html
	const username = localStorage.getItem('username');
	if (username) {
		const userGreeting = document.getElementById('userGreeting');
		if (userGreeting) {
			userGreeting.innerHTML = `Welcome back, <strong>${username}</strong>!`;
		}
	}
});