document.addEventListener('DOMContentLoaded', function () {
    const backToDashboardBtn = document.getElementById('backToDashboardBtn');
    const dataForm = document.getElementById('dataForm');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const humidityInput = document.getElementById('humidity');
    const aqiInput = document.getElementById('aqi');

    // Create AQI status element dynamically
    const aqiStatus = document.createElement('div');
    aqiStatus.id = 'aqiStatus';
    aqiInput.parentNode.appendChild(aqiStatus);

    // Handle back button navigation
    backToDashboardBtn.addEventListener('click', () => {
        window.location.href = 'admin-panel.html';
    });

    // Input validations
    latitudeInput.addEventListener('input', function () {
        validateInput(this, -90, 90);
    });

    longitudeInput.addEventListener('input', function () {
        validateInput(this, -180, 180);
    });

    humidityInput.addEventListener('input', function () {
        validateInput(this, 0, 100);
    });

    function validateInput(element, min, max) {
        const val = parseFloat(element.value);
        if (isNaN(val) || val < min || val > max) {
            element.classList.add('is-invalid');
        } else {
            element.classList.remove('is-invalid');
        }
    }

    // AQI value classification and dynamic styling
    aqiInput.addEventListener('input', function () {
        const aqiValue = parseInt(this.value);
        if (isNaN(aqiValue)) return;

        let status = '', className = '';

        if (aqiValue <= 50) {
            status = 'Good';
            className = 'aqi-good';
        } else if (aqiValue <= 100) {
            status = 'Moderate';
            className = 'aqi-moderate';
        } else if (aqiValue <= 150) {
            status = 'Unhealthy';
            className = 'aqi-unhealthy';
        } else if (aqiValue <= 200) {
            status = 'Very Unhealthy';
            className = 'aqi-very-unhealthy';
        } else {
            status = 'Hazardous';
            className = 'aqi-hazardous';
        }

        aqiStatus.textContent = status;
        aqiStatus.className = className;
    });

    // Set local current datetime as default
    updateTimestamp();

    function updateTimestamp() {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localTime = new Date(now - offset).toISOString().slice(0, 16);
        document.getElementById('timestamp').value = localTime;
    }

    // Form submission handler
    dataForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        try {
            const timestampInput = document.getElementById('timestamp');
            let timestampValue = timestampInput.value || new Date().toISOString().slice(0, 16);

            const formData = {
                stationName: document.getElementById('stationName').value,
                latitude: parseFloat(latitudeInput.value),
                longitude: parseFloat(longitudeInput.value),
                timestamp: new Date(timestampValue).toISOString(),
                aqi: parseInt(document.getElementById('aqi').value),
                pm25: parseFloat(document.getElementById('pm25').value),
                co: parseFloat(document.getElementById('co').value),
                temperature: parseFloat(document.getElementById('temperature').value),
                humidity: parseFloat(humidityInput.value),
            };

            const response = await fetch('https://localhost:7073/api/StationData/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorInfo = await response.json();
                console.error('Server error:', errorInfo);
                throw new Error(errorInfo.message || errorInfo.error || 'Failed to submit data');
            }

            const result = await response.json();
            alert('Station data submitted successfully!');
            dataForm.reset();
            aqiStatus.textContent = '';
            aqiStatus.className = '';
            updateTimestamp();
        } catch (error) {
            console.error('Full error:', error);
            alert(`Error submitting data: ${error.message}`);
        }
    });
});
