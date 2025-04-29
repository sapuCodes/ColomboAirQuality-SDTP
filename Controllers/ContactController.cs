using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Cors;
using sdt_backend.net.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace sdt_backend.net.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAll")]
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ContactController> _logger;

        public ContactController(AppDbContext context, ILogger<ContactController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> PostContact([FromBody] Contact contact)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Received invalid contact submission.");
                return BadRequest(new { message = "Submitted contact data is invalid." });
            }

            try
            {
                contact.SubmittedAt = DateTime.UtcNow;

                await _context.Contacts.AddAsync(contact);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Contact form successfully submitted by {Email}", contact.Email);
                return Ok(new { message = "Your message has been received. Thank you!" });
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database exception occurred while saving contact.");
                return StatusCode(500, new { message = "A database error occurred while processing your request." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while processing contact form.");
                return StatusCode(500, new { message = "An unexpected server error occurred." });
            }
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllContacts()
        {
            try
            {
                var contactList = await _context.Contacts
                    .OrderByDescending(c => c.SubmittedAt)
                    .ToListAsync();

                return Ok(contactList);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to retrieve contacts from database.");
                return StatusCode(500, new { message = "Failed to load contact records." });
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            try
            {
                var contact = await _context.Contacts.FindAsync(id);

                if (contact == null)
                {
                    _logger.LogWarning("Attempt to delete non-existent contact with ID: {Id}", id);
                    return NotFound(new { message = "No contact found with the provided ID." });
                }

                _context.Contacts.Remove(contact);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Successfully deleted contact with ID: {Id}", id);
                return Ok(new { message = "Contact was deleted successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception occurred while trying to delete contact.");
                return StatusCode(500, new { message = "Error occurred while deleting contact." });
            }
        }
    }
}
