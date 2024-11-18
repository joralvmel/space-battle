document.addEventListener('DOMContentLoaded', () => {
    loadPreferences();
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