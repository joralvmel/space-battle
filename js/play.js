$(document).ready(function() {
	let score = 0;
	let time = 60;
	let timerInterval;
	let laserActive = false;
	const gameArea = $('#game-area');
	const battleship = $('#battleship');
	const laser = $('#laser');

	let playSong;

	// Initialize game
	function initGame() {
		playSong = document.getElementById('play-song').cloneNode();
		playSong.play();

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

			// Check for collisions with other UFOs
			$('.ufo').each(function() {
				const otherUfo = $(this);
				if (otherUfo[0] !== ufo[0]) {
					const ufoPos = ufo.position();
					const otherUfoPos = otherUfo.position();
					if (ufoPos.left < otherUfoPos.left + otherUfo.width() &&
						ufoPos.left + ufo.width() > otherUfoPos.left &&
						ufoPos.top < otherUfoPos.top + otherUfo.height() &&
						ufoPos.top + ufo.height() > otherUfoPos.top) {
						speed = -speed;
					}
				}
			});
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
		playSong.pause();
		
		const gameOverSound = document.getElementById('game-over-sound').cloneNode();
		gameOverSound.play();

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
		$(".close").remove();
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

	// Fire laser on left-click within the game area
	gameArea.click(function() {
		if (!laserActive) {
			fireLaser();
		}
	});

	// Move battleship with mouse
	gameArea.mousemove(function(e) {
		if (!laserActive) {
			const gameAreaOffset = $(this).offset();
			const mouseX = e.pageX - gameAreaOffset.left;
			battleship.css('left', mouseX - battleship.width() / 2 + 'px').show();
		}
	});

	// Move battleship with keyboard arrows
	$(document).keydown(function(e) {
		if (!laserActive) {
			const currentLeft = parseInt(battleship.css('left'));
			switch (e.key) {
				case 'ArrowLeft':
					battleship.css('left', Math.max(currentLeft - 20, 0) + 'px').show();
					break;
				case 'ArrowRight':
					battleship.css('left', Math.min(currentLeft + 20, gameArea.width() - battleship.width()) + 'px').show();
					break;
				case ' ':
					fireLaser();
					break;
			}
		}
	});

	function fireLaser() {
		const newLaser = laser.clone();
		const battleshipLeft = parseInt(battleship.css('left'));
		const battleshipWidth = battleship.width();
		const laserWidth = newLaser.width();
		const laserLeft = battleshipLeft + (battleshipWidth / 2) - (laserWidth / 2);

		newLaser.css({
			bottom: '60px',
			left: laserLeft + 'px',
			display: 'block'
		});

		gameArea.append(newLaser);

		// Play laser sound
		const laserSound = document.getElementById('laser-sound').cloneNode();
		laserSound.play();

		let laserInterval = setInterval(function() {
			let currentBottom = parseInt(newLaser.css('bottom'));
			currentBottom += 10;
			newLaser.css('bottom', currentBottom + 'px');

			// Check collision with UFOs
			let hit = false;
			$('.ufo').each(function() {
				const ufo = $(this);
				const ufoPos = ufo.position();
				const laserPos = newLaser.position();

				if (laserPos.left > ufoPos.left && laserPos.left < ufoPos.left + ufo.width() &&
					laserPos.top < ufoPos.top + ufo.height() && laserPos.top + newLaser.height() > ufoPos.top) {
					// Collision detected
					hit = true;
					score += 100;
					$('#score').text(`Score: ${score}`);
					newLaser.remove();
					clearInterval(laserInterval);

					// Show explosion
					const explosion = $('<img src="../public/img/explosion.gif" class="explosion" alt="explode">');
					explosion.css({
						position: 'absolute',
						top: ufoPos.top + 'px',
						left: ufoPos.left + 'px',
						width: ufo.width() + 'px',
						height: ufo.height() + 'px'
					});
					gameArea.append(explosion);

					// Play explosion sound
					const hitSound = document.getElementById('hit-sound').cloneNode();
					hitSound.play();

					setTimeout(function() {
						explosion.remove();
					}, 500);

					ufo.remove();

					// Check if no UFOs are left
					if ($('.ufo').length === 0) {
						endGame();
					}
					return false;
				}
			});

			// If laser goes out of bounds
			if (currentBottom > gameArea.height()) {
				if (!hit) {
					// Play miss sound
					const missSound = document.getElementById('miss-sound').cloneNode();
					missSound.play();
				}
				score -= 25;
				$('#score').text(`Score: ${score}`);
				newLaser.remove();
				clearInterval(laserInterval);
			}
		}, 30);
	}
	// Start the game
	initGame();
});