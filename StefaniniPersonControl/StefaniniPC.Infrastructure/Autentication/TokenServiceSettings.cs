namespace StefaniniPC.Infrastructure.Autentication
{
    public class TokenServiceSettings
    {
        public required string Issuer { get; init; }
        public required string Audience { get; init; }
        public required string IssuerSigningKey { get; init; }
    }
}
