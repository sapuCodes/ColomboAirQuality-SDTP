using System.ComponentModel.DataAnnotations;

namespace sdt_backend.net.Models
{
    public class LoginRequestDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Password { get; set; }
    }
}