using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace TradingWebApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuoteController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public QuoteController()
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0"); // Prevent blocking
        }

        private async Task<string> GetCompanyName(string symbol)
        {
            Console.WriteLine($"Testing Get Company Name11");
            try
            {
                string url = $"https://query2.finance.yahoo.com/v1/finance/search?q={symbol}";
                HttpResponseMessage response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                string jsonResponse = await response.Content.ReadAsStringAsync();
                JObject json = JObject.Parse(jsonResponse);

                string companyName = json["quotes"]?[0]?["shortname"]?.ToString();
                Console.WriteLine($"Testing Get Company Name: {companyName}");
                return !string.IsNullOrEmpty(companyName) ? companyName : "Unknown Company";
            }
            catch
            {
                return "Unknown Company";
            }
        }

        private async Task<double?> GetStockPrice(string symbol)
        {
            Console.WriteLine($"Testing Get Stock Price");
            string apiKey = "cuemgvpr01qkqnpfilcgcuemgvpr01qkqnpfild0";
            string url = $"https://finnhub.io/api/v1/quote?symbol={symbol}&token={apiKey}";

            HttpResponseMessage response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode)
                return null;

            string jsonResponse = await response.Content.ReadAsStringAsync();
            JObject json = JObject.Parse(jsonResponse);

            double? price = json["c"]?.ToObject<double>();
            return price;



        }

        [HttpPost("Lookup")]
        public async Task<IActionResult> LookupStock([FromBody] string symbol)
        {
            if (string.IsNullOrWhiteSpace(symbol))
            {
                return BadRequest("Symbol cannot be empty");
            }

            Console.WriteLine($"Looking up stock: {symbol}");

            string companyName = await GetCompanyName(symbol);
            double? price = await GetStockPrice(symbol);

            if (price == null)
            {
                return NotFound($"No price information found for symbol: {symbol}");
            }

            var stockInfo = new Dictionary<string, object>()
            {
                {"name", companyName},
                {"price", price},
                {"symbol", symbol.ToUpper()}
            };

            Console.WriteLine($"Stock Information: {stockInfo}");
            return Ok(stockInfo);
        }
    }
}
