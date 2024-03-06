using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace TradingWebApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuoteController : ControllerBase
    {
        // GetCompanyName method moved here
        private string GetCompanyName(string ticker)
        {
            string url = $"https://finance.google.com/finance?q={ticker}";
            WebClient client = new WebClient();
            string content = client.DownloadString(url);
            int startLocation = content.IndexOf("<title>") + "<title>".Length;
            int endLocation = content.IndexOf("</title>");
            string title = content.Substring(startLocation, endLocation - startLocation);
            string companyName = title.Split(':')[0];
            int positionRemove = companyName.IndexOf('(');
            companyName = companyName.Substring(0, positionRemove);
            return companyName.Trim();
        }

        //api/Quote/Lookup
        [HttpPost("Lookup")]
        public async Task<IActionResult> LookupStock([FromBody] string symbol)
        {
            if (string.IsNullOrWhiteSpace(symbol))
            {
                return BadRequest("Symbol cannot be empty");
            }

            Console.WriteLine($"Symbol: {symbol}");

            symbol = symbol.ToUpper();
            DateTime end = DateTime.Now;
            DateTime start = end.AddDays(-5);

            string url = $"https://query1.finance.yahoo.com/v7/finance/download/{Uri.EscapeDataString(symbol)}" +
                         $"?period1={(Int32)(start.Subtract(new DateTime(1970, 1, 1))).TotalSeconds}" +
                         $"&period2={(Int32)(end.Subtract(new DateTime(1970, 1, 1))).TotalSeconds}" +
                         $"&interval=1d&events=history&includeAdjustedClose=true";

            try
            {
                WebClient client = new WebClient();
                client.Headers["User-Agent"] = "C# WebClient";
                string response = client.DownloadString(url);
                string[] lines = response.Split('\n');
                Array.Reverse(lines);
                string[] headers = lines[0].Split(',');
                string[] data = lines[1].Split(',');
                double price = Math.Round(Double.Parse(data[4]), 2); // Getting current price instead of adjusted close
                string name = GetCompanyName(symbol);

                var stockInfo = new Dictionary<string, dynamic>()
                {
                    {"name", name},
                    {"price", price},
                    {"symbol", symbol}
                };

                Console.WriteLine($"Stock Information: {stockInfo}");
                return Ok(stockInfo);
            }
            catch (WebException)
            {
                Console.WriteLine($"No information found for symbol: {symbol}");
                return NotFound($"No information found for symbol: {symbol}");
            }
        }
    }
}
