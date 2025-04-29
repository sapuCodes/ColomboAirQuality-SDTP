using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sdt_backend.net.Models;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace sdt_backend.net.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public AdminController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAdmin([FromBody] AdminRegisterDto adminDto)
        {
            try
            {
                // Check if the username already exists
                bool usernameExists = await _dbContext.Admins
                    .AnyAsync(admin => admin.Username.ToLower() == adminDto.Username.ToLower());

                if (usernameExists)
                {
                    return BadRequest(new { message = "Username already taken." });
                }

                // Create new admin entity
                var newAdmin = new Admin
                {
                    Username = adminDto.Username,
                    PasswordHash = GeneratePasswordHash(adminDto.Password)
                };

                _dbContext.Admins.Add(newAdmin);
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Admin registered successfully." });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine($"Database Error: {dbEx.Message}");
                return StatusCode(500, new { message = "A database error occurred. Please try again later." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unhandled Error: {ex.Message}");
                return StatusCode(500, new { message = "An unexpected error occurred. Please try again later." });
            }
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllAdmins()
        {
            try
            {
                var adminList = await _dbContext.Admins
                    .Select(admin => new { admin.Id, admin.Username })
                    .ToListAsync();

                return Ok(adminList);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unhandled Error: {ex.Message}");
                return StatusCode(500, new { message = "An unexpected error occurred. Please try again later." });
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteAdmin(int id)
        {
            try
            {
                var admin = await _dbContext.Admins.FindAsync(id);

                if (admin == null)
                {
                    return NotFound(new { message = "Admin not found." });
                }

                _dbContext.Admins.Remove(admin);
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Admin successfully deleted." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unhandled Error: {ex.Message}");
                return StatusCode(500, new { message = "Failed to delete admin. Please try again." });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> AuthenticateAdmin([FromBody] AdminLoginDto loginDto)
        {
            try
            {
                var admin = await _dbContext.Admins
                    .FirstOrDefaultAsync(a => a.Username.ToLower() == loginDto.Username.ToLower());

                if (admin == null || admin.PasswordHash != GeneratePasswordHash(loginDto.Password))
                {
                    return Unauthorized(new { message = "Invalid username or password." });
                }

                return Ok(new { message = "Login successful." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unhandled Error: {ex.Message}");
                return StatusCode(500, new { message = "An unexpected error occurred. Please try again later." });
            }
        }

        private string GeneratePasswordHash(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }
    }

    // DTO classes

    public class AdminRegisterDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class AdminLoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
