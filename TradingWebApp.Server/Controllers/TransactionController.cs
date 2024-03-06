using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using TradingWebApp.Server.Data;
using TradingWebApp.Server.Models;

namespace TradingWebApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransactionController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Transaction/Buy
        [HttpPost("Buy")]
        public async Task<IActionResult> BuyStock([FromBody] BuyModel model)
        {
            // Validate the model
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Retrieve user data
            var userId = model.UserID; // Assuming this is included in the model
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Check if user has sufficient funds
            if (user.Cash < model.TotalBookCost)
            {
                return BadRequest("Insufficient funds");
            }

            // Update user cash
            user.Cash -= model.TotalBookCost;
            _context.Users.Update(user);

            // Create or update stock record
            var stock = _context.Stocks.FirstOrDefault(s => s.UserId == userId && s.Symbol == model.Symbol);
            if (stock != null)
            {
                stock.Shares += model.NumberOfShares;
            }
            else
            {
                stock = new Stock
                {
                    UserId = userId,
                    Symbol = model.Symbol,
                    Name = model.Name,
                    Shares = model.NumberOfShares
                };
                _context.Stocks.Add(stock);
            }

            // Create transaction record
            var transaction = new Transaction
            {
                UserId = userId,
                Symbol = model.Symbol,
                Name = model.Name,
                Shares = model.NumberOfShares,
                ShareValue = model.ShareValue,
                TotalValues = model.TotalBookCost,
                Type = "Buy", 
                TransTime = DateTime.Now
            };
            _context.Transactions.Add(transaction);

            // Save changes to the database
            await _context.SaveChangesAsync();

            // Return success message or any other necessary response
            return Ok("Stock bought successfully");
        }


        // POST: api/Transaction/Sell
        [HttpPost("Sell")]
        public async Task<IActionResult> SellStock([FromBody] BuyModel model)
        {
            // Validate the model
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Retrieve user data
            var userId = model.UserID; // Assuming this is included in the model
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Retrieve stock data
            var stock = await _context.Stocks.FirstOrDefaultAsync(s => s.UserId == userId && s.Symbol == model.Symbol);

            if (stock == null || stock.Shares < model.NumberOfShares)
            {
                return BadRequest("Insufficient shares");
            }

            // Update user cash
            var sellValue = model.NumberOfShares * model.ShareValue;
            user.Cash += sellValue;
            _context.Users.Update(user);

            // Update stock shares
            stock.Shares -= model.NumberOfShares;
            if (stock.Shares == 0)
            {
                _context.Stocks.Remove(stock); // Remove the record if shares become 0
            }
            else
            {
                _context.Stocks.Update(stock);
            }

            // Create transaction record
            var transaction = new Transaction
            {
                UserId = userId,
                Symbol = model.Symbol,
                Name = model.Name,
                Shares = model.NumberOfShares,
                ShareValue = model.ShareValue,
                TotalValues = sellValue,
                Type = "Sell",
                TransTime = DateTime.Now
            };
            _context.Transactions.Add(transaction);

            // Save changes to the database
            await _context.SaveChangesAsync();

            // Return success message or any other necessary response
            return Ok("Stock sold successfully");
        }

        // GET: api/Transaction/GetTransactions/{userId}
        [HttpGet("GetTransactions/{userId}")]
        public IActionResult GetTransactions(int userId)
        {
            // Retrieve transactions for the specified user and order them by TransactionTime descending
            var transactions = _context.Transactions
                                        .Where(t => t.UserId == userId)
                                        .OrderByDescending(t => t.TransTime)
                                        .ToList();

            return Ok(transactions);
        }
    }
}
