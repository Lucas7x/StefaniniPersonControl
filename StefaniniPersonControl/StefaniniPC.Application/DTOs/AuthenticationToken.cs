namespace StefaniniPC.Application.DTOs
{
    public class AuthenticationToken
    {
        public string AccessToken { get; set; }
        public DateTimeOffset ExpiresAt { get; set; }
        public PersonDTO Person { get; set; }
    }
}
