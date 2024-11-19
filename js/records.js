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
        let htmlContent = `
            <table class="records-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Points</th>
                        <th>UFOs</th>
                        <th>Time (seconds)</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
        `;
        data.forEach((record, index) => {
            const recordDate = new Date(record.recordDate).toLocaleDateString();
            htmlContent += `<tr>
                <td>${index + 1}</td>
                <td>${record.username}</td>
                <td>${record.punctuation} points</td>
                <td>${record.ufos}</td>
                <td>${record.disposedTime}</td>
                <td>${recordDate}</td>
            </tr>`;
        });
        htmlContent += '</tbody></table>';
        recordsElement.innerHTML = htmlContent;
    } else {
        console.error('Error: Element with ID "records" not found.');
    }
}