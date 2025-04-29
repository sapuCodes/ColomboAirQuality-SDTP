const apiBaseUrl = "https://localhost:7073/api/airquality";
let currentData = [];
let historicalCurrentData = [];

// Fetch and display real-time air quality data
function fetchAirQualityData() {
    const loadingSpinner = document.getElementById("loadingSpinner");
    const dataTable = document.getElementById("dataTable");

    loadingSpinner.style.display = "block";
    dataTable.style.opacity = "0.5";

    fetch(apiBaseUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(apiResponse => {
            console.log("Received API Response:", apiResponse);

            if (apiResponse.status !== "ok") {
                throw new Error("Invalid API response status");
            }

            currentData = [];
            dataTable.innerHTML = "";

            apiResponse.stations.forEach(station => {
                const stationDetails = station.data;
                const airMetrics = stationDetails.data;
                const iaqi = airMetrics.iaqi || {};
                const timestampInfo = airMetrics.time || {};

                const record = {
                    location: station.location,
                    co2: iaqi.co?.v ?? "N/A",
                    pm25: iaqi.pm25?.v ?? "N/A",
                    temperature: iaqi.t?.v ?? "N/A",
                    humidity: iaqi.h?.v ?? "N/A",
                    lastUpdated: timestampInfo.s ? new Date(timestampInfo.s).toLocaleString() : "N/A"
                };

                currentData.push(record);

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${record.location}</td>
                    <td>${record.co2}</td>
                    <td>${record.pm25}</td>
                    <td>${record.temperature}</td>
                    <td>${record.humidity}</td>
                    <td>${record.lastUpdated}</td>
                `;
                dataTable.appendChild(tr);
            });
        })
        .catch(err => {
            console.error("Error during real-time fetch:", err);
        })
        .finally(() => {
            loadingSpinner.style.display = "none";
            dataTable.style.opacity = "1";
        });
}

// Fetch and render historical station data
async function loadHistoricalData() {
    const tableBody = document.getElementById('historicalDataTable');
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center">Fetching records...</td></tr>`;

    try {
        const response = await fetch('https://localhost:7073/api/stationdata/historical');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const historicalData = await response.json();
        historicalCurrentData = historicalData || [];

        if (historicalCurrentData.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center">No records found</td></tr>`;
            return;
        }

        tableBody.innerHTML = "";

        historicalCurrentData.forEach(record => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${record.stationName}</td>
                <td>${new Date(record.timestamp).toLocaleString()}</td>
                <td>${record.aqi}</td>
                <td>${getPm25Value(record)}</td>
                <td>${record.co}</td>
                <td>${record.temperature}</td>
                <td>${record.humidity}</td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Failed to fetch historical data:', error);
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Failed to load data: ${error.message}</td></tr>`;
    }
}

// Helper to extract PM2.5 value safely
function getPm25Value(station) {
    return station.pm25 || station.PM25 || station.pM25 || station.Pm25 || "N/A";
}

// Export real-time data as PDF
function downloadAsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Real-time Air Quality Data", 10, 10);

    const headers = [["Location", "CO2", "PM2.5", "Temperature", "Humidity", "Last Updated"]];
    const dataRows = currentData.map(item => [
        item.location,
        item.co2,
        item.pm25,
        item.temperature,
        item.humidity,
        item.lastUpdated
    ]);

    doc.autoTable({
        head: headers,
        body: dataRows,
        startY: 20
    });

    doc.save('real-time-air-quality.pdf');
}

// Export historical data as PDF
function downloadHistoricalAsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Historical Air Quality Data", 10, 10);

    const headers = [["Station", "Timestamp", "AQI", "PM2.5", "CO", "Temperature", "Humidity"]];
    const dataRows = historicalCurrentData.map(entry => [
        entry.stationName,
        new Date(entry.timestamp).toLocaleString(),
        entry.aqi,
        getPm25Value(entry),
        entry.co,
        entry.temperature,
        entry.humidity
    ]);

    doc.autoTable({
        head: headers,
        body: dataRows,
        startY: 20
    });

    doc.save('historical-air-quality.pdf');
}

// Initialize dashboard after page load
document.addEventListener('DOMContentLoaded', () => {
    fetchAirQualityData();
    loadHistoricalData();

    setInterval(fetchAirQualityData, 30000);

    document.getElementById('downloadPdf')?.addEventListener('click', downloadAsPDF);
    document.getElementById('downloadHistoricalPdf')?.addEventListener('click', downloadHistoricalAsPDF);
});
