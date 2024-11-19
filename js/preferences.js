document.addEventListener('DOMContentLoaded', () => {
    loadPreferences();
});

function savePreferences() {
    const numUFOs = document.getElementById('numUFOs').value;
    const gameTime = document.getElementById('gameTime').value;
    localStorage.setItem('numUFOs', numUFOs);
    localStorage.setItem('gameTime', gameTime);

    const playButton = document.getElementById('primaryButton');
    if (playButton) {
        playButton.innerText = 'Play';
        playButton.style.display = 'inline-block';
        playButton.addEventListener('click', () => {
            window.location.href = 'play.html';
        }, { once: true });
    }

    showModal('Preferences Saved', 'Your preferences have been saved successfully.');
}


function loadPreferences() {
    if (document.getElementById('numUFOs') && document.getElementById('gameTime')) {
        document.getElementById('numUFOs').value = localStorage.getItem('numUFOs') || 5;
        document.getElementById('gameTime').value = localStorage.getItem('gameTime') || 60;
    }
}