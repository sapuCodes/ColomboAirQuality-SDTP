using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sdt_backend.net.Models
{
    [Table("air_quality_stations")]
    public class Station
    {
        public Station()
        {
            // Ensure timestamps are UTC by default
            Timestamp = DateTime.UtcNow;
        }

        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("station_name")]
        [StringLength(100)]
        public string StationName { get; set; }

        [Required]
        [Column("latitude")]
        [Range(-90, 90)]
        public decimal Latitude { get; set; }

        [Required]
        [Column("longitude")]
        [Range(-180, 180)]
        public decimal Longitude { get; set; }

        [Required]
        [Column("timestamp")]
        public DateTime Timestamp { get; set; }

        [Required]
        [Column("aqi")]
        [Range(0, int.MaxValue)]
        public int AQI { get; set; }

        [Required]
        [Column("pm25")]
        [Range(0, double.MaxValue)]
        public double PM25 { get; set; }

        [Required]
        [Column("co")]
        [Range(0, double.MaxValue)]
        public double CO { get; set; }

        [Required]
        [Column("temperature")]
        public double Temperature { get; set; }

        [Required]
        [Column("humidity")]
        [Range(0, 100)]
        public double Humidity { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}