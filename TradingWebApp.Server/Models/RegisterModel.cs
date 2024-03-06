using System.ComponentModel.DataAnnotations;

namespace TradingWebApp.Server.Models
{
    public class RegisterModel
    {
        [Required]
        [MinLength(6, ErrorMessage = "Username must be at least 6 characters long.")]
        public string Username { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required]
        [Compare("Password")]
        [DataType(DataType.Password)]
        public string ConfirmPassword { get; set; }
    }
}
