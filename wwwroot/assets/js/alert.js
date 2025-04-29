document.addEventListener('DOMContentLoaded', function () {
    // Access DOM elements
    const alertList = document.getElementById('alerts-list');
    const noAlertsMessage = document.getElementById('no-alerts');

    // Initial page setup
    displayLoadingMessage();
    fetchAirQualityAlerts();

    // Main function to get AQI alerts
    async function fetchAirQualityAlerts() {
        try {
            const response = await fetch('https://localhost:7073/api/dashboard/aqi');

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const responseData = await response.json();

            if (!responseData) {
                throw new Error('Received no data from the server');
            }

            if (responseData.status !== 'ok') {
                throw new Error(responseData.message || 'Server returned an error status');
            }

            handleAqiData(responseData);
        } catch (error) {
            console.error('Error loading AQI data:', error);
            displayErrorState(error.message);
        }
    }

    // Process the AQI data
    function handleAqiData(data) {
        alertList.innerHTML = '';

        if (!data.data || !Array.isArray(data.data)) {
            displayNoDataMessage();
            return;
        }

        // Filter for stations with unhealthy AQI (above 100)
        const unhealthyStations = data.data.filter(station => 
            station.aqi && station.aqi > 100
        );

        if (unhealthyStations.length > 0) {
            displayAlerts(unhealthyStations);
        } else {
            displayNoAlertsMessage();
        }
    }

    // UI State Update Functions
    function displayLoadingMessage() {
        alertList.innerHTML = `
            <div class="status-message loading">
                <i class="fas fa-spinner fa-spin"></i> Fetching air quality data... Please hold on...
            </div>
        `;
        noAlertsMessage.style.display = 'none';
    }

    function displayAlerts(stations) {
        alertList.innerHTML = '';
        noAlertsMessage.style.display = 'none';

        // Sort stations by AQI value (highest first)
        stations.sort((a, b) => b.aqi - a.aqi);

        stations.forEach(station => {
            const alertItem = createAlertElement(station);
            alertList.appendChild(alertItem);
        });
    }

    function displayNoAlertsMessage() {
        alertList.innerHTML = '';
        noAlertsMessage.style.display = 'flex';
    }

    function displayErrorState(errorMsg) {
        alertList.innerHTML = `
            <div class="status-message error">
                <i class="fas fa-exclamation-triangle"></i>
                ${errorMsg || 'Unable to retrieve air quality data'}
                <button onclick="window.location.reload()">Retry</button>
            </div>
        `;
        noAlertsMessage.style.display = 'none';
    }

    function displayNoDataMessage() {
        alertList.innerHTML = `
            <div class="status-message warning">
                <i class="fas fa-info-circle"></i>
                Air quality data not available
            </div>
        `;
        noAlertsMessage.style.display = 'none';
    }

    // Create alert item
    function createAlertElement(station) {
        const element = document.createElement('div');
        element.className = 'alert-item';

        const aqiClass = determineAqiLevelClass(station.aqi);
        const updatedAt = formatDate(station.lastUpdated || station.updated || station.time);

        element.innerHTML = `
            <div class="alert-location">${station.location || 'Unknown'}</div>
            <div class="alert-aqi">${station.aqi || 'N/A'}</div>
            <div class="alert-level ${aqiClass}">${determineAlertLevel(station.aqi)}</div>
            <div class="alert-pollutant">${station.mainPollutant || 'N/A'}</div>
            <div class="alert-time">${updatedAt}</div>
        `;

        return element;
    }

    // Helper functions
    function determineAqiLevelClass(aqi) {
        if (!aqi) return '';
        if (aqi > 200) return 'level-hazardous';
        if (aqi > 150) return 'level-veryunhealthy';
        if (aqi > 100) return 'level-unhealthy';
        return '';
    }

    function determineAlertLevel(aqi) {
        if (!aqi) return 'N/A';
        if (aqi > 200) return 'Hazardous';
        if (aqi > 150) return 'Very Unhealthy';
        if (aqi > 100) return 'Unhealthy';
        return 'Good';
    }

    function formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        
        try {
            const dateObj = new Date(dateStr);
            if (isNaN(dateObj.getTime())) {
                return dateStr;
            }
            return dateObj.toLocaleString();
        } catch (e) {
            return dateStr;
        }
    }
});
