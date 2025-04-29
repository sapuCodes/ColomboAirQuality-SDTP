using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

[Route("api/airquality")]
[ApiController]
public class AirQualityController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<AirQualityController> _logger;
    private readonly IConfiguration _configuration;

    public AirQualityController(HttpClient httpClient, ILogger<AirQualityController> logger, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _logger = logger;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> GetAirQualityData()
    {
        try
        {
            var apiKey = _configuration["WAQI:ApiKey"];

            var colomboStations = InitializeColomboStations();
            var stationDataList = new List<object>();

            foreach (var station in colomboStations)
            {
                var stationName = station.Key;
                var stationCode = station.Value;
                var apiUrl = BuildApiUrl(stationCode, apiKey);

                try
                {
                    _logger.LogInformation($"Retrieving air quality information for {stationName} via {apiUrl}");

                    var response = await _httpClient.GetAsync(apiUrl);
                    response.EnsureSuccessStatusCode();

                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var jsonDoc = JsonDocument.Parse(jsonResponse);

                    if (jsonDoc.RootElement.TryGetProperty("data", out var data))
                    {
                        stationDataList.Add(new
                        {
                            location = stationName,
                            data = JsonSerializer.Deserialize<object>(jsonResponse)
                        });
                    }
                    else
                    {
                        _logger.LogWarning($"No data found for station: {stationName}");
                    }
                }
                catch (HttpRequestException ex)
                {
                    _logger.LogError(ex, $"HTTP error while fetching data for station: {stationName}");
                    continue; // Skip to the next station if error occurs
                }
            }

            return Ok(new
            {
                status = "ok",
                stations = stationDataList,
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled error occurred while retrieving air quality data.");
            return StatusCode(500, new
            {
                status = "error",
                message = "An internal server error occurred.",
                details = ex.Message
            });
        }
    }

    [HttpGet("{stationId}")]
    public async Task<IActionResult> GetStationData(string stationId)
    {
        try
        {
            var apiKey = _configuration["WAQI:ApiKey"];
            var apiUrl = BuildApiUrl(stationId, apiKey);

            _logger.LogInformation($"Fetching data for station ID: {stationId}");

            var responseJson = await _httpClient.GetStringAsync(apiUrl);
            var stationData = JsonSerializer.Deserialize<object>(responseJson);

            return Ok(stationData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error fetching data for station ID: {stationId}");
            return StatusCode(500, new
            {
                status = "error",
                message = $"Failed to retrieve station data: {ex.Message}"
            });
        }
    }

    // Helper to build API URL
    private string BuildApiUrl(string stationCode, string apiKey)
    {
        return $"https://api.waqi.info/feed/{stationCode}/?token={apiKey}";
    }

    // Helper to define station mappings
    private Dictionary<string, string> InitializeColomboStations()
    {
        return new Dictionary<string, string>
        {
            { "Colombo US Embassy", "@1456" },
            { "Colombo Fort", "@1457" },
            { "Kollupitiya", "@1458" },
            { "Dehiwala", "@1459" },
            { "Mount Lavinia", "@1460" },
            { "Pettah", "@1461" },
            { "Nugegoda", "@1462" },
            { "Battaramulla", "@1463" }
        };
    }
}
