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

// Fetch and print top 10 scores
function printTopTenScores(data) {
	let htmlContent = '<ul class="records-list">';
	data.forEach((record, index) => {
		htmlContent += `<li class="records-list-item">
			<div
			  <span class="record-number"> ${index + 1}.</span>
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

window.onload = function() {
	fetchTopTenScores();
};