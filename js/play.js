$(document).ready(function() {
	let score = 0;
	let time = 60;
	let timerInterval;
	let missileActive = false;
	const gameArea = $('#game-area');
	const missile = $('#missile');

	// Initialize game
	function initGame() {
		const numUFOs = localStorage.getItem('numUFOs') || 5;
		const gameTime = localStorage.getItem('gameTime') || 60;
		time = parseInt(gameTime);
		$('#timer').text(`Time: ${time}`);

		for (let i = 0; i < numUFOs; i++) {
			createUFO();
		}

		timerInterval = setInterval(updateTimer, 1000);
	}

	// Create a UFO element
	function createUFO() {
		const ufo = $('<div class="ufo"></div>');
		const x = Math.random() * (gameArea.width() - 50);
		const y = Math.random() * (gameArea.height() / 2);
		ufo.css({ top: y + 'px', left: x + 'px' });

		const direction = Math.random() < 0.5 ? -1 : 1;

		gameArea.append(ufo);

		let speed = 2 + Math.random() * 3;
		setInterval(function() {
			let currentLeft = parseFloat(ufo.css('left'));
			currentLeft += speed * direction;
			if (currentLeft <= 0 || currentLeft >= (gameArea.width() - 50)) {
				speed = -speed;
			}
			ufo.css('left', currentLeft + 'px');
		}, 30);
	}

	// Update Timer
	function updateTimer() {
		time--;
		$('#timer').text(`Time: ${time}`);
		if (time <= 0) {
			endGame();
		}
	}

	// End Game
	function endGame() {
		clearInterval(timerInterval);
		const gameTime = parseInt(localStorage.getItem('gameTime')) || 60;
		const numUFOs = parseInt(localStorage.getItem('numUFOs')) || 5;
		let finalScore = score / (gameTime / 60);
		finalScore -= (numUFOs - 1) * 50;
		finalScore = Math.max(finalScore, 0);

		const recordsButton = document.getElementById('secondaryButton');
		if (recordsButton) {
			recordsButton.innerText = 'Records';
			recordsButton.addEventListener('click', () => {
				window.location.href = 'records.html';
			}, { once: true });
		}

		const playAgainButton = document.getElementById('primaryButton');
		if (playAgainButton) {
			playAgainButton.innerText = 'Play Again';
			playAgainButton.style.display = 'inline-block';
			playAgainButton.addEventListener('click', () => {
				resetGame();
			}, { once: true });
		}

		showModal('Game Over', 'Your final score is ' + finalScore);
	}

	// Function to reset the game
	function resetGame() {
		score = 0;
		$('#score').text(`Score: ${score}`);
		$('#game-area .ufo').remove();
		clearInterval(timerInterval);
		initGame();
		$('.modal').modal('hide');
	}

	// Fire missile on left-click within the game area
	gameArea.click(function() {
		if (!missileActive) {
			fireMissile();
		}
	});

	// Move missile with mouse
	gameArea.mousemove(function(e) {
		if (!missileActive) {
			const gameAreaOffset = $(this).offset();
			const mouseX = e.pageX - gameAreaOffset.left;
			missile.css('left', mouseX - missile.width() / 2 + 'px').show();
		}
	});

	// Move missile with keyboard arrows
	$(document).keydown(function(e) {
		if (!missileActive) {
			const currentLeft = parseInt(missile.css('left'));
			switch (e.key) {
				case 'ArrowLeft':
					missile.css('left', Math.max(currentLeft - 10, 0) + 'px').show();
					break;
				case 'ArrowRight':
					missile.css('left', Math.min(currentLeft + 10, gameArea.width() - missile.width()) + 'px').show();
					break;
				case ' ':
					fireMissile();
					break;
			}
		}
	});

	function fireMissile() {
		missileActive = true;
		missile.css('bottom', '0px').show();

		let missileInterval = setInterval(function() {
			let currentBottom = parseInt(missile.css('bottom'));
			currentBottom += 5;
			missile.css('bottom', currentBottom + 'px');

			// Check collision with UFOs
			$('.ufo').each(function() {
				const ufo = $(this);
				const ufoPos = ufo.position();
				const missilePos = missile.position();

				if (missilePos.left > ufoPos.left && missilePos.left < ufoPos.left + ufo.width() &&
					missilePos.top < ufoPos.top + ufo.height() && missilePos.top + missile.height() > ufoPos.top) {
					// Collision detected
					score += 100;
					$('#score').text(`Score: ${score}`);
					missile.hide();
					missileActive = false;
					clearInterval(missileInterval);
					ufo.remove();
					missile.css('bottom', '0px');
					return false;
				}
			});

			// If missile goes out of bounds
			if (currentBottom > gameArea.height()) {
				score -= 25;
				$('#score').text(`Score: ${score}`);
				missile.hide();
				missileActive = false;
				clearInterval(missileInterval);
				missile.css('bottom', '0px');
			}
		}, 30);
	}

	// Start the game
	initGame();
});