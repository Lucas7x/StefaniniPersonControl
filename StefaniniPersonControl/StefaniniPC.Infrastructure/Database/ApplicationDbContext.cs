using Microsoft.EntityFrameworkCore;
using StefaniniPC.Domain.Entities;

namespace StefaniniPC.Infrastructure.Database
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
    {
        public DbSet<Person> Persons { get; private set; }
    }
}
