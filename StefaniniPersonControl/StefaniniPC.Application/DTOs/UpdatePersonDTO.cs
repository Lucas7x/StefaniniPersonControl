using System.ComponentModel.DataAnnotations;
using StefaniniPC.Application.Validation;

namespace StefaniniPC.Application.DTOs
{
    public class UpdatePersonDTO
    {
        public string? Name { get; set; }
        public string? Gender { get; set; }

        [EmailAddress(ErrorMessage = "E-mail inválido.")]
        public string? Email { get; set; }

        [BirthDateValidation(18, ErrorMessage = "A Data de Nascimento deve ser maior que 01/01/1900, não pode ser no futuro e é necessário ter pelo menos 18 anos.")]
        public DateTime? BirthDate { get; set; }
        public string? Nationality { get; set; }
        public string? PlaceOfBirth { get; set; }

        [CpfValidation(SkipValidationIfNull = true)]
        public string? Cpf { get; set; }
    }
}
