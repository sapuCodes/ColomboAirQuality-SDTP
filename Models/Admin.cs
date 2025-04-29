using System.ComponentModel.DataAnnotations;

namespace sdt_backend.net.Models
{
    public class Admin
    {
        [Key]
        public int Id { get; set; } // Primary key

        [Required]
        [MaxLength(50)] // Matches the database schema
        public string Username { get; set; }

        [Required]
        public string PasswordHash { get; set; }
    }
}