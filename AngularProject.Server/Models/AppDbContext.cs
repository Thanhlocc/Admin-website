using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AngularProject.Server.Models
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Product> Product { get; set; }
        public DbSet<Supplier> Supplier { get; set; }
        public DbSet<Product_type> Product_type { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            var admin = new IdentityRole("admin");
            admin.NormalizedName = "admin";
            var client = new IdentityRole("client");
            client.NormalizedName = "client";
            var seller = new IdentityRole("seller");
            seller.NormalizedName = "seller";
            builder.Entity<IdentityRole>().HasData(admin, client, seller);
        }
    }
}
