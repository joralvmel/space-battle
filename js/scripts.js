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

	// Display welcome message on index.html
	const username = localStorage.getItem('username');
	if (username) {
		const userGreeting = document.getElementById('userGreeting');
		if (userGreeting) {
			userGreeting.innerHTML = `Welcome back, <strong>${username}</strong>!`;
		}
	}
});
