using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TradingWebApp.Server.Data;
using TradingWebApp.Server.Models;

namespace TradingWebApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/User/Register
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the username already exists
            var existingUser = _context.Users.FirstOrDefault(u => u.Username == model.Username);
            if (existingUser != null)
            {
                // Username already exists, return error
                return BadRequest("Username already exists.");
            }

            // Username doesn't exist, proceed with user creation
            var newUser = new User
            {
                Username = model.Username,
                Hash = model.Password, 
                Cash = 10000
            };

            // Add the new user to the context and save changes to the database
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully!");
        }

        // POST: api/User/Login
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            // Check if the username does NOT exist
            var existingUser = _context.Users.FirstOrDefault(u => u.Username == model.Username);
            if (existingUser == null)
            {
                // Username already exists, return error
                return BadRequest("Username does not exist.");
            }
            var user = _context.Users.FirstOrDefault(u => u.Username == model.Username && u.Hash == model.Password);

            if (user == null)
            {
                return BadRequest("Invalid password.");
            }
            // Set a cookie containing the user ID
            var cookieOptions = new CookieOptions
            {
                Expires = DateTime.Now.AddHours(3), // Set expiration time to 3 hours from now
                IsEssential = true // This is required for GDPR compliance.
            };
            Response.Cookies.Append("userID", user.Id.ToString(), cookieOptions);

            return Ok(user);
        }

        // POST: api/User/Logout
        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            // Clear the authentication cookie
            Response.Cookies.Delete("userID");

            return Ok("User logged out successfully!");
        }
        // GET: api/User/Read
        [HttpGet("Read")]
        public IActionResult Read(string userID)
        {
            // Check if userID is null or empty
            if (string.IsNullOrEmpty(userID))
            {
                return BadRequest("UserID cannot be null or empty");
            }

            // Convert userID string to int
            if (!int.TryParse(userID, out int userIdInt))
            {
                return BadRequest("Invalid userID format");
            }

            // Find the user by userID
            var user = _context.Users.FirstOrDefault(u => u.Id == userIdInt);

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Return username, cash, and ID
            return Ok(new { user.Username, user.Cash, user.Id });
        }
    }
}

