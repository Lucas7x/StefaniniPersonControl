using System.ComponentModel.DataAnnotations;

namespace StefaniniPC.Application.DTOs
{
    public class LoginDTO
    {
        [Required]
        public string Cpf { get; set;}
        [Required]
        public string Password { get; set;}
    }
}
