using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using StefaniniPC.API.Middlewares;
using StefaniniPC.Infrastructure.Autentication;

namespace StefaniniPC.API.Extensions
{
    public static class AuthExtensions
    {
        public static IServiceCollection AddJwtAutentication(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IAuthorizationMiddlewareResultHandler, JwtTokenValidationMiddleware>();

            services.Configure<TokenServiceSettings>(configuration.GetSection("Jwt"));

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options => options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidAudience = configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:IssuerSigningKey"]!))
            });

            return services;
        }
    }
}
