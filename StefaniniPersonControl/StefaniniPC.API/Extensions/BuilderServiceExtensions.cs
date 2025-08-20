using Microsoft.EntityFrameworkCore;
using StefaniniPC.Infrastructure.Database;

namespace StefaniniPC.API.Extensions
{
    public static class BuilderServiceExtensions
    {
        public static IServiceCollection ConfigureDatabaseContext(this IServiceCollection services, IConfiguration configuration)
        {
            string? defaultConnection = configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<ApplicationDbContext>(
                options => options.UseSqlite(defaultConnection)
            );

            return services;
        }

        public static IServiceCollection ConfigureAutomapper(this IServiceCollection services)
        {
            services.AddAutoMapper(x => x.AddMaps(typeof(Program).Assembly));
            return services;
        }
    }
}
