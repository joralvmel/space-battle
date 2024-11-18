document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('records')) {
        fetchTopTenScores();
    }
});

function fetchTopTenScores() {
    fetch('http://wd.etsisi.upm.es:10000/records')
        .then(response => response.json())
        .then(data => printTopTenScores(data))
        .catch(error => console.error('Error fetching data:', error));
}

function printTopTenScores(data) {
    const recordsElement = document.getElementById('records');
    if (recordsElement) {
        let htmlContent = '<ul class="records-list">';
        data.forEach((record, index) => {
            htmlContent += `<li class="records-list-item">
                <div>
                    <span class="record-number">${index + 1}.</span>
                    <span class="record-username">${record.username}</span>
                </div>
                <span class="record-punctuation">${record.punctuation} points</span>
            </li>`;
        });
        htmlContent += '</ul>';
        recordsElement.innerHTML = htmlContent;
    } else {
        console.error('Error: Element with ID "records" not found.');
    }
}