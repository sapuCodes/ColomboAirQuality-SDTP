document.addEventListener('DOMContentLoaded', () => {
    // Select elements
    const backToDashboardBtn = document.getElementById('backToDashboardBtn');
    const addStationBtn = document.getElementById('addStationBtn');
    const stationsTableBody = document.getElementById('stationsTableBody');
    const stationModal = new bootstrap.Modal(document.getElementById('stationModal'));
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    const saveStationBtn = document.getElementById('saveStationBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const stationForm = document.getElementById('stationForm');

    // Application state
    let stations = [];
    let currentStationId = null;

    // Utility to fetch PM2.5 value safely
    const getPm25Value = (station) => {
        return station.pm25 || station.PM25 || station.pM25 || station.Pm25 || "N/A";
    };

    // Run initial setup
    initialize();

    function initialize() {
        fetchStations();
        bindEventListeners();
    }

    function bindEventListeners() {
        backToDashboardBtn.addEventListener('click', () => {
            window.location.href = 'admin-panel.html';
        });

        addStationBtn.addEventListener('click', () => {
            openAddStationModal();
        });

        saveStationBtn.addEventListener('click', () => {
            submitStationForm();
        });

        confirmDeleteBtn.addEventListener('click', () => {
            executeDeleteStation();
        });
    }

    async function fetchStations() {
        try {
            const res = await fetch('https://localhost:7073/api/ManageStationData');
            if (!res.ok) throw new Error('Could not retrieve stations');
            stations = await res.json();
            populateStationsTable();
        } catch (err) {
            console.error('Fetching stations failed:', err);
            alert('Unable to load stations. Please refresh.');
        }
    }

    function populateStationsTable() {
        stationsTableBody.innerHTML = '';

        stations.forEach(station => {
            const row = document.createElement('tr');
            const timestamp = new Date(station.timestamp).toLocaleString();

            row.innerHTML = `
                <td>${station.id}</td>
                <td>${station.stationName}</td>
                <td>${station.latitude}</td>
                <td>${station.longitude}</td>
                <td>${station.aqi}</td>
                <td>${getPm25Value(station)}</td>
                <td>${station.co}</td>
                <td>${station.temperature}</td>
                <td>${station.humidity}%</td>
                <td>${timestamp}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-btn" data-id="${station.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${station.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;

            stationsTableBody.appendChild(row);
        });

        attachTableActionListeners();
    }

    function attachTableActionListeners() {
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const stationId = Number(event.currentTarget.dataset.id);
                openEditStationModal(stationId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const stationId = Number(event.currentTarget.dataset.id);
                promptDeleteConfirmation(stationId);
            });
        });
    }

    function openAddStationModal() {
        currentStationId = null;
        document.getElementById('modalTitle').textContent = 'Add New Station';
        stationForm.reset();
        stationModal.show();
    }

    function openEditStationModal(stationId) {
        const station = stations.find(s => s.id === stationId);
        if (!station) return;

        currentStationId = stationId;
        document.getElementById('modalTitle').textContent = 'Edit Station';
        document.getElementById('stationId').value = station.id;
        document.getElementById('stationName').value = station.stationName;
        document.getElementById('latitude').value = station.latitude;
        document.getElementById('longitude').value = station.longitude;
        document.getElementById('aqi').value = station.aqi;
        document.getElementById('pm25').value = getPm25Value(station);
        document.getElementById('co').value = station.co;
        document.getElementById('temperature').value = station.temperature;
        document.getElementById('humidity').value = station.humidity;

        stationModal.show();
    }

    function promptDeleteConfirmation(stationId) {
        currentStationId = stationId;
        confirmModal.show();
    }

    async function submitStationForm() {
        if (!stationForm.checkValidity()) {
            stationForm.reportValidity();
            return;
        }

        const stationData = {
            id: currentStationId || 0,
            stationName: document.getElementById('stationName').value,
            latitude: parseFloat(document.getElementById('latitude').value),
            longitude: parseFloat(document.getElementById('longitude').value),
            aqi: parseInt(document.getElementById('aqi').value),
            pm25: parseFloat(document.getElementById('pm25').value),
            co: parseFloat(document.getElementById('co').value),
            temperature: parseFloat(document.getElementById('temperature').value),
            humidity: parseFloat(document.getElementById('humidity').value),
            timestamp: new Date().toISOString()
        };

        try {
            const endpoint = currentStationId
                ? `https://localhost:7073/api/ManageStationData/${currentStationId}`
                : 'https://localhost:7073/api/ManageStationData';
            const method = currentStationId ? 'PUT' : 'POST';

            const res = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(stationData)
            });

            if (!res.ok) throw new Error('Saving station failed');

            stationModal.hide();
            fetchStations();
        } catch (err) {
            console.error('Station saving error:', err);
            alert('Could not save station. Please retry.');
        }
    }

    async function executeDeleteStation() {
        if (!currentStationId) return;

        try {
            const res = await fetch(`https://localhost:7073/api/ManageStationData/${currentStationId}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Deleting station failed');

            confirmModal.hide();
            fetchStations();
        } catch (err) {
            console.error('Station deletion error:', err);
            alert('Unable to delete station. Try again.');
        }
    }
});
