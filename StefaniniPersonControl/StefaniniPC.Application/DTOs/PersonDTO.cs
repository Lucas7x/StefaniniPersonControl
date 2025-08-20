using System.ComponentModel.DataAnnotations;

namespace StefaniniPC.Application.DTOs
{
    public class PersonDTO
    {
        [Required(ErrorMessage = "O Nome é obrigatório.")]
        public string Name { get; set; } = string.Empty;
        public string? Gender { get; set; }
        [EmailAddress(ErrorMessage = "E-mail inválido.")]
        public string? Email { get; set; }
        [Required(ErrorMessage = "A Data de Nascimento é obrigatória")]
        public DateTime BirthDate { get; set; } = DateTime.MinValue;
        public string? Nationality { get; set; }
        public string? PlaceOfBirth { get; set; }
        [Required(ErrorMessage = "O CPF é obrigatório.")]
        public string Cpf { get; set; } = string.Empty;
    }
}
