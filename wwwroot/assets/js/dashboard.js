document.addEventListener("DOMContentLoaded", function () {
    const { jsPDF } = window.jspdf;
    const apiBaseUrl = "https://localhost:7073/api/dashboard/aqi";
    
    // Initialize map centered on Colombo
    var map = L.map('map').setView([6.9271, 79.8612], 12);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Debug: Add a test marker to verify map works
    L.marker([6.9271, 79.8612])
        .addTo(map)
        .bindPopup("Test marker - Colombo center")
        .openPopup();

    // Fetch AQI data from our backend
    fetch(apiBaseUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("API Response:", data); // Debug log
            
            if (data.status === "ok") {
                data.data.forEach(station => {
                    if (station.aqi >= 0) { // Only show stations with valid data
                        // Store the current AQI reading
                        storeAqiReading(station.location, station.aqi);
                        
                        const popupContent = createPopupContent(station);
                        
                        const marker = L.marker(station.coordinates, {
                            icon: L.divIcon({
                                className: 'aqi-marker',
                                html: `<div class="pulsing-circle" style="background-color: ${getAqiColor(station.aqi)}; 
                                      width: 28px; height: 28px; border-radius: 50%; 
                                      border: 3px solid #fff;"></div>`,
                                iconSize: [28, 28]
                            })
                        }).addTo(map).bindPopup(popupContent);
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error loading AQI data:', error);
            // Show error on map
            L.marker([6.9271, 79.8612])
                .addTo(map)
                .bindPopup(`Error: ${error.message}`)
                .openPopup();
        });

    // Store AQI reading in localStorage
    function storeAqiReading(location, aqi) {
        const now = new Date();
        const key = `aqi_${location.replace(/\s+/g, '_')}`;
        
        // Get existing data or initialize
        const storedData = JSON.parse(localStorage.getItem(key)) || { readings: [] };
        
        // Add new reading
        storedData.readings.push({
            timestamp: now.getTime(),
            aqi: aqi
        });
        
        // Keep only the last 24 hours of data
        const twentyFourHoursAgo = now.getTime() - (24 * 60 * 60 * 1000);
        storedData.readings = storedData.readings.filter(reading => reading.timestamp >= twentyFourHoursAgo);
        
        // Save back to localStorage
        localStorage.setItem(key, JSON.stringify(storedData));
    }

    // Get stored AQI readings for a location
    function getAqiHistory(location) {
        const key = `aqi_${location.replace(/\s+/g, '_')}`;
        const storedData = JSON.parse(localStorage.getItem(key)) || { readings: [] };
        
        // Sort readings by timestamp (oldest first)
        storedData.readings.sort((a, b) => a.timestamp - b.timestamp);
        
        return storedData.readings;
    }

    // Create chart for AQI history
    function createAqiChart(location, canvasId) {
        const readings = getAqiHistory(location);
        
        if (readings.length === 0) {
            return '<p>No historical data available</p>';
        }
        
        const timestamps = readings.map(r => new Date(r.timestamp).toLocaleTimeString());
        const aqiValues = readings.map(r => r.aqi);
        
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [{
                    label: 'AQI',
                    data: aqiValues,
                    borderColor: '#FF6F61',
                    backgroundColor: 'rgba(255, 111, 97, 0.2)',
                    borderWidth: 2,
                    tension: 0.1,
                    pointRadius: 4,
                    pointBackgroundColor: function(context) {
                        const value = context.dataset.data[context.dataIndex];
                        return getAqiColor(value);
                    }
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '- Last 24 Hours AQI -'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `AQI: ${context.raw} (${getAqiLevel(context.raw)})`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: ' Value'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    }
                }
            }
        });
    }

    // AQI color scale function
    function getAqiColor(aqi) {
        if (aqi < 0) return "#CCCCCC";     // Gray for invalid data
        if (aqi <= 50) return "#00FF00";  // Light Green
        if (aqi <= 100) return "#FFD700"; // Gold
        if (aqi <= 150) return "#FF6347"; // Tomato
        if (aqi <= 200) return "#FF0000"; // Red
        if (aqi <= 300) return "#8A2BE2"; // BlueViolet
        return "#8B0000";                 // Dark Red
    }

    // Create popup content with table, chart and download button
    function createPopupContent(station) {
        const timestamp = new Date(station.lastUpdated).toLocaleString();
        const chartId = `chart-${Math.random().toString(36).substr(2, 9)}`;
        
        // Create table rows for all available data
        let tableRows = '';
        
        // Always include these fields
        tableRows += `
            <tr>
                <th>AQI</th>
                <td>${station.aqi} (${getAqiLevel(station.aqi)})</td>
            </tr>
        `;
        
        // Include other fields if they exist
        if (station.pm25 !== undefined) {
            tableRows += `
                <tr>
                    <th>PM2.5</th>
                    <td>${station.pm25} µg/m³</td>
                </tr>
            `;
        }
        
        if (station.co !== undefined) {
            tableRows += `
                <tr>
                    <th>CO</th>
                    <td>${station.co} ppm</td>
                </tr>
            `;
        }
        
        if (station.temperature !== undefined) {
            tableRows += `
                <tr>
                    <th>Temperature</th>
                    <td>${station.temperature}°C</td>
                </tr>
            `;
        }
        
        if (station.humidity !== undefined) {
            tableRows += `
                <tr>
                    <th>Humidity</th>
                    <td>${station.humidity}%</td>
                </tr>
            `;
        }
        
        // Create download button with onclick handler
        const downloadButton = `
            <button class="download-pdf-btn" 
                    onclick="window.downloadAsPdf('${station.location}', ${station.aqi}, ${station.pm25 || 'null'}, 
                    ${station.co || 'null'}, ${station.temperature || 'null'}, ${station.humidity || 'null'}, 
                    '${timestamp}')">
                Download PDF
            </button>
        `;
        
        // Combine all elements
        return `
            <div class="popup-content">
                <h3 class="popup-title">${station.location}</h3>
                <p class="popup-timestamp">Updated: ${timestamp}</p>
                <table class="aqi-popup-table">
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                
                <div class="aqi-chart-container">
                    <canvas id="${chartId}" width="300" height="200"></canvas>
                </div>
                
                ${downloadButton}
            </div>
        `;
    }

    // Get AQI level description
    function getAqiLevel(aqi) {
        if (aqi < 0) return "Invalid";
        if (aqi <= 50) return "Good";
        if (aqi <= 100) return "Moderate";
        if (aqi <= 150) return "Unhealthy";
        if (aqi <= 200) return "Very Unhealthy";
        if (aqi <= 300) return "Hazardous";
        return "Hazardous";
    }

    // Make download function available globally
    window.downloadAsPdf = function(location, aqi, pm25, co, temperature, humidity, timestamp) {
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(18);
        doc.text(`Air Quality Report - ${location}`, 105, 15, { align: 'center' });
        
        // Timestamp
        doc.setFontSize(10);
        doc.text(`Report generated on: ${new Date().toLocaleString()}`, 105, 22, { align: 'center' });
        doc.text(`Data timestamp: ${timestamp}`, 105, 27, { align: 'center' });
        
        // Table data
        const data = [
            ["Parameter", "Value"],
            ["AQI", `${aqi} (${getAqiLevel(aqi)})`]
        ];
        
        if (pm25 !== null) data.push(["PM2.5", `${pm25} µg/m³`]);
        if (co !== null) data.push(["CO", `${co} ppm`]);
        if (temperature !== null) data.push(["Temperature", `${temperature}°C`]);
        if (humidity !== null) data.push(["Humidity", `${humidity}%`]);
        
        // Add table
        doc.autoTable({
            startY: 35,
            head: [data[0]],
            body: data.slice(1),
            theme: 'grid',
            headStyles: {
                fillColor: [255, 111, 97],
                textColor: [255, 255, 255]
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            },
            margin: { top: 35 }
        });
        
        // AQI scale info
        doc.setFontSize(10);
        doc.text("AQI Scale:", 14, doc.autoTable.previous.finalY + 15);
        
        const aqiScale = [
            ["0-50", "Good", "#00FF00"],
            ["51-100", "Moderate", "#FFD700"],
            ["101-150", "Unhealthy", "#FF6347"],
            ["151-200", "Very Unhealthy", "#FF0000"],
            ["201-300", "Hazardous", "#8A2BE2"],
            ["301+", "Hazardous", "#8B0000"]
        ];
        
        doc.autoTable({
            startY: doc.autoTable.previous.finalY + 20,
            body: aqiScale.map(row => [row[0], row[1]]),
            theme: 'grid',
            didDrawCell: (data) => {
                if (data.section === 'body' && data.column.index === 2) {
                    const color = aqiScale[data.row.index][2];
                    doc.setFillColor(color);
                    doc.rect(data.cell.x + 2, data.cell.y + 2, 10, 10, 'F');
                }
            },
            columnStyles: {
                2: { cellWidth: 15 }
            },
            margin: { left: 14 }
        });
        
        // Save the PDF
        doc.save(`AQI_Report_${location.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`);
    };

    // Initialize charts when popup opens
    map.on('popupopen', function(e) {
        const popup = e.popup;
        const content = popup.getContent();
        const locationMatch = content.match(/<h3 class="popup-title">([^<]+)<\/h3>/);
        
        if (locationMatch && locationMatch[1]) {
            const location = locationMatch[1];
            const chartIdMatch = content.match(/<canvas id="([^"]+)"/);
            
            if (chartIdMatch && chartIdMatch[1]) {
                const chartId = chartIdMatch[1];
                setTimeout(() => {
                    createAqiChart(location, chartId);
                }, 100); // Small delay to ensure canvas is rendered
            }
        }
    });
});

// Add CSS for pulsing circle
const style = document.createElement('style');
style.innerHTML = `
    .pulsing-circle {
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 0.7;
        }
        50% {
            transform: scale(1.2);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 0.7;
        }
    }
`;
document.head.appendChild(style);
