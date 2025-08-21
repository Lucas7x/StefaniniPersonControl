using System.ComponentModel.DataAnnotations;

namespace StefaniniPC.Application.DTOs
{
    public class CreatePersonDTO : PersonDTO
    {
        [Required]
        public string Password { get; set;}
    }
}
