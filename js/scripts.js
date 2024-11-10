// Inject NavBar into the placeholder div
$(document).ready(function() {
	$("#navbar-placeholder").load("../utils/navbar.html", function(response, status, xhr) {
		let currentPath = window.location.pathname;
		$('#navbarNav .nav-link').each(function() {
			let href = $(this).attr('href');
			if (currentPath.includes(href)) {
				$(this).addClass('active');
			}
		});
	});
});

// Save preferences to localStorage
function savePreferences() {
	const numUFOs = document.getElementById('numUFOs').value;
	const gameTime = document.getElementById('gameTime').value;
	localStorage.setItem('numUFOs', numUFOs);
	localStorage.setItem('gameTime', gameTime);
	alert('Preferences saved');
}

// Load preferences when on the preferences page
function loadPreferences() {
	if (document.getElementById('numUFOs') && document.getElementById('gameTime')) {
		document.getElementById('numUFOs').value = localStorage.getItem('numUFOs') || 5;
		document.getElementById('gameTime').value = localStorage.getItem('gameTime') || 60;
	}
}

// Run loadPreferences if on the preferences page
document.addEventListener('DOMContentLoaded', () => {
	loadPreferences();
});
