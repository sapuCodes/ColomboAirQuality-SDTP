using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sdt_backend.net.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sdt_backend.net.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManageStationDataController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ManageStationDataController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ManageStationData
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Station>>> GetStations()
        {
            return await _context.AirQualityStations.ToListAsync();
        }

        // GET: api/ManageStationData/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Station>> GetStation(int id)
        {
            var station = await _context.AirQualityStations.FindAsync(id);

            if (station == null)
            {
                return NotFound();
            }

            return station;
        }

        // POST: api/ManageStationData
        [HttpPost]
        public async Task<ActionResult<Station>> PostStation(Station station)
        {
            station.Timestamp = DateTime.UtcNow;
            station.CreatedAt = DateTime.UtcNow;
            station.UpdatedAt = DateTime.UtcNow;

            _context.AirQualityStations.Add(station);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStation", new { id = station.Id }, station);
        }

        // PUT: api/ManageStationData/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStation(int id, Station station)
        {
            if (id != station.Id)
            {
                return BadRequest();
            }

            station.UpdatedAt = DateTime.UtcNow;
            _context.Entry(station).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/ManageStationData/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStation(int id)
        {
            var station = await _context.AirQualityStations.FindAsync(id);
            if (station == null)
            {
                return NotFound();
            }

            _context.AirQualityStations.Remove(station);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StationExists(int id)
        {
            return _context.AirQualityStations.Any(e => e.Id == id);
        }
    }
}