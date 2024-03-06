using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TradingWebApp.Server.Models;

namespace TradingWebApp.Server.Models
{
    public class Transaction
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public string Symbol { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public int Shares { get; set; }

        [Required]
        [DataType(DataType.Currency)]
        public decimal ShareValue { get; set; }

        [Required]
        [DataType(DataType.Currency)]
        public decimal TotalValues { get; set; }

        [Required]
        public string Type { get; set; }

        [Required]
        public DateTime TransTime { get; set; }

    }
}
