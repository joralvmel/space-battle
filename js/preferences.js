document.addEventListener('DOMContentLoaded', () => {
    loadPreferences();
    setupModalListeners();
});

function savePreferences() {
    const numUFOs = document.getElementById('numUFOs').value;
    const gameTime = document.getElementById('gameTime').value;
    localStorage.setItem('numUFOs', numUFOs);
    localStorage.setItem('gameTime', gameTime);

    // Show the modal
    $('#preferencesModal').modal('show');
}

function loadPreferences() {
    if (document.getElementById('numUFOs') && document.getElementById('gameTime')) {
        document.getElementById('numUFOs').value = localStorage.getItem('numUFOs') || 5;
        document.getElementById('gameTime').value = localStorage.getItem('gameTime') || 60;
    }
}

function setupModalListeners() {
    document.getElementById('play-game').addEventListener('click', () => {
        window.location.href = 'play.html';
    });

    document.getElementById('close-modal').addEventListener('click', () => {
        $('#preferencesModal').modal('hide');
    });
}
