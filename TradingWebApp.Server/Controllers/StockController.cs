using Microsoft.AspNetCore.Mvc;
using System.Linq;
using TradingWebApp.Server.Data;
using TradingWebApp.Server.Models;

namespace TradingWebApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StockController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Stock/Read
        [HttpGet("Read")]
        public IActionResult Read(int userId)
        {
            // Find the user by userId
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Retrieve stocks associated with the user
            var userStocks = _context.Stocks.Where(s => s.UserId == userId).ToList();

            return Ok(userStocks);
        }
    }
}
