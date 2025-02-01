using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;
using TradingWebApp.Server.Models;

namespace TradingWebApp.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Stock> Stocks { get; set; }

        // Add other DbSet properties for additional entities if needed

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure entity relationships, constraints, etc. here
            modelBuilder.Entity<Stock>()
                .HasKey(s => s.StockID); // Explicitly set the primary key to StockID

            modelBuilder.Entity<Stock>()
                .Property(s => s.StockID)
                .ValueGeneratedOnAdd(); // Ensure it's auto-generated

            modelBuilder.Entity<Transaction>()
                .Property(t => t.ShareValue)
                .HasColumnType("decimal(18, 2)"); // Adjust precision and scale as needed

            modelBuilder.Entity<Transaction>()
                .Property(t => t.TotalValues)
                .HasColumnType("decimal(18, 2)"); // Adjust precision and scale as needed

            modelBuilder.Entity<User>()
                .Property(u => u.Cash)
                .HasColumnType("decimal(18, 2)"); // Adjust precision and scale as needed
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username).IsUnique();// create unique Username
        }
    }
}
