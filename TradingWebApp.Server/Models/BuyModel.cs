using System.ComponentModel.DataAnnotations;

namespace TradingWebApp.Server.Models
{
    public class BuyModel
    {
        [Required]
        public int UserID { get; set; }

        [Required]
        public string Symbol { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public int NumberOfShares { get; set; }

        [Required]
        public decimal TotalBookCost { get; set; }

        [Required]
        public decimal ShareValue { get; set; }
    }
}
