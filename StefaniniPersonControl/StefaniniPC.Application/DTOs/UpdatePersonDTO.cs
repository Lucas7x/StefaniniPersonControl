using System.ComponentModel.DataAnnotations;

namespace StefaniniPC.Application.DTOs
{
    public class UpdatePersonDTO
    {
        public string? Name { get; set; }
        public string? Gender { get; set; }
        public string? Email { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? Nationality { get; set; }
        public string? PlaceOfBirth { get; set; }
        public string? Cpf { get; set; }
    }
}
