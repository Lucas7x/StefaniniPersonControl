using System.ComponentModel.DataAnnotations;
using StefaniniPC.Application.Validation;

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
        [BirthDateValidation(18, ErrorMessage = "A Data de Nascimento deve ser maior que 01/01/1900, não pode ser no futuro e é necessário ter pelo menos 18 anos.")]
        public DateTime BirthDate { get; set; }
        
        public string? Nationality { get; set; }
        
        public string? PlaceOfBirth { get; set; }
        [Required(ErrorMessage = "O CPF é obrigatório.")]
        [CpfValidation(SkipValidationIfNull = false)]
        public string Cpf { get; set; } = string.Empty;
    }
}
