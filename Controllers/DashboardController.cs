using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

[Route("api/dashboard")]
[ApiController]
public class DashboardController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<DashboardController> _logger;
    private readonly IConfiguration _configuration;

    public DashboardController(HttpClient httpClient, ILogger<DashboardController> logger, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _logger = logger;
        _configuration = configuration;
    }

    [HttpGet("aqi")]
    public async Task<IActionResult> FetchAqiData()
    {
        try
        {
            string apiKey = _configuration["WAQI:ApiKey"];

            // List of Colombo monitoring stations with their details
            var colomboStations = new List<StationInfo>
            {
                new StationInfo { Name = "Colombo US Embassy", StationId = "@1456", Lat = 6.9271, Lng = 79.8612 },
                new StationInfo { Name = "Colombo Fort", StationId = "@1457", Lat = 6.9344, Lng = 79.8428 },
                new StationInfo { Name = "Kollupitiya", StationId = "@1458", Lat = 6.9106, Lng = 79.8553 },
                new StationInfo { Name = "Dehiwala", StationId = "@1459", Lat = 6.8409, Lng = 79.8756 }
            };

            var aqiResultList = new List<object>();

            foreach (var station in colomboStations)
            {
                try
                {
                    string apiEndpoint = $"https://api.waqi.info/feed/{station.StationId}/?token={apiKey}";
                    var apiResponse = await _httpClient.GetAsync(apiEndpoint);
                    apiResponse.EnsureSuccessStatusCode();

                    var responseContent = await apiResponse.Content.ReadAsStringAsync();
                    var parsedJson = JsonDocument.Parse(responseContent);

                    if (parsedJson.RootElement.TryGetProperty("data", out var data) && data.ValueKind != JsonValueKind.Null)
                    {
                        var aqi = data.TryGetProperty("aqi", out var aqiElement) ? aqiElement.GetInt32() : -1;
                        var lastUpdated = data.TryGetProperty("time", out var timeElement) ? 
                                          timeElement.GetProperty("s").GetString() : DateTime.UtcNow.ToString("o");

                        var iaqi = data.TryGetProperty("iaqi", out var iaqiElement) ? iaqiElement : default;

                        aqiResultList.Add(new
                        {
                            location = station.Name,
                            coordinates = new[] { station.Lat, station.Lng },
                            aqi = aqi,
                            pm25 = GetIaqiValue(iaqi, "pm25"),
                            co = GetIaqiValue(iaqi, "co"),
                            temperature = GetIaqiValue(iaqi, "t"),
                            humidity = GetIaqiValue(iaqi, "h"),
                            lastUpdated = lastUpdated
                        });
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error processing station {station.Name}");
                    // Fallback with default values in case of error
                    aqiResultList.Add(new
                    {
                        location = station.Name,
                        coordinates = new[] { station.Lat, station.Lng },
                        aqi = -1,
                        pm25 = (double?)null,
                        co = (double?)null,
                        temperature = (double?)null,
                        humidity = (double?)null,
                        lastUpdated = DateTime.UtcNow.ToString("o")
                    });
                }
            }

            return Ok(new
            {
                status = "ok",
                data = aqiResultList,
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching AQI data");
            return StatusCode(500, new
            {
                status = "error",
                message = ex.Message
            });
        }
    }

    private double? GetIaqiValue(JsonElement iaqi, string property)
    {
        if (iaqi.ValueKind == JsonValueKind.Undefined || !iaqi.TryGetProperty(property, out var prop))
            return null;

        return prop.TryGetProperty("v", out var value) ? value.GetDouble() : (double?)null;
    }

    private class StationInfo
    {
        public string Name { get; set; }
        public string StationId { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
    }
}
