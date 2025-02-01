using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TradingWebApp.Server.Models;

namespace TradingWebApp.Server.Models
{
    public class Stock
    {
        [Key] // Explicitly define the primary key
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Ensure auto-increment
        public int StockID { get; set; }
        [Required]
        [Column(TypeName = "nvarchar(10)")]
        public string Symbol { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public int Shares { get; set; }


    }
}
