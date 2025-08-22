using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using StefaniniPC.Application.DTOs;
using StefaniniPC.Application.Interfaces;
using StefaniniPC.Domain.Entities;

namespace StefaniniPC.Infrastructure.Autentication
{
    public class TokenService(IOptions<TokenServiceSettings> options) : ITokenService
    {
        private readonly TokenServiceSettings _settings = options.Value;
        public AuthenticationToken GenerateToken(Person person)
        {
            var issuer = _settings.Issuer;
            var audience = _settings.Audience;
            var key = _settings.IssuerSigningKey;

            if (string.IsNullOrEmpty(issuer) || string.IsNullOrEmpty(audience) || string.IsNullOrEmpty(key))
            {
                throw new InvalidOperationException("Configuração JWT está faltando ou é inválida.");
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, person.Id.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.Name, person.Name),
            new(ClaimTypes.NameIdentifier, person.Id.ToString()),
        };

            var expiresAt = DateTime.UtcNow.AddHours(1);

            var token = new JwtSecurityToken(issuer: issuer,
                                             audience: audience,
                                             claims: claims,
                                             expires: expiresAt,
                                             signingCredentials: credentials);

            var handler = new JwtSecurityTokenHandler();
            string jwtToken = handler.WriteToken(token);

            return new AuthenticationToken
            {
                AccessToken = jwtToken,
                ExpiresAt = expiresAt,
                Person = new()
                {
                    BirthDate = person.BirthDate,
                    Cpf = person.Cpf,
                    Email = person.Email,
                    Gender = person.Gender,
                    Name = person.Name,
                    Nationality = person.Nationality,
                    PlaceOfBirth = person.PlaceOfBirth,
                },
            };
        }
    }
}
