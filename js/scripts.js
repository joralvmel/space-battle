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
		const registerNavItem = document.getElementById('registerNavItem');

		if (authToken) {
			if (loginNavItem) {
				loginNavItem.innerHTML = '<a class="nav-link" href="#" id="logoutLink">Logout</a>';
				document.getElementById('logoutLink').addEventListener('click', function(event) {
					event.preventDefault();
					logoutUser();
				});
			}
			if (registerNavItem) {
				registerNavItem.style.display = 'none';
			}
		}
	});

	$("#modal-placeholder").load("../utils/modal.html");

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
			userGreeting.innerHTML = `Hello, <span class="username">${username}</span>`;
		}
	}
});

function showModal(title, message, callback) {
	const modalTitle = document.querySelector('.modal-title');
	const modalBody = document.querySelector('.modal-body');
	const $modal = $('.modal');

	if (modalTitle && modalBody) {
		modalTitle.innerText = title;
		modalBody.innerText = message;

		$modal.modal('show');

		if (callback) {
			$modal.on('hidden.bs.modal', function() {
				callback();
				$(this).off('hidden.bs.modal');
			});
		}
	} else {
		console.error('Modal elements not found. Ensure the modal structure is included in the HTML.');
	}
}