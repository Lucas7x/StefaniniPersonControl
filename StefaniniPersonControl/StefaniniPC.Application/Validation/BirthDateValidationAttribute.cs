using System.ComponentModel.DataAnnotations;

namespace StefaniniPC.Application.Validation
{
    public class BirthDateValidationAttribute : ValidationAttribute
    {
        public int? MinimumAge { get; set; }

        public BirthDateValidationAttribute() { }

        public BirthDateValidationAttribute(int minimumAge)
        {
            MinimumAge = minimumAge;
        }

        public bool SkipValidationIfNull { get; set; } = false;

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null)
            {
                if (SkipValidationIfNull)
                    return ValidationResult.Success!;

                return new ValidationResult("A Data de Nascimento é obrigatória.");
            }

            if (value is not DateTime birthDate)
                return new ValidationResult("Data de Nascimento inválida.");

            if (birthDate > DateTime.Today)
                return new ValidationResult("A Data de Nascimento não pode ser no futuro.");

            if (birthDate.Year < 1900)
                return new ValidationResult("A Data de Nascimento deve ser posterior a 01/01/1900.");

            if (MinimumAge.HasValue)
            {
                var today = DateTime.Today;
                var age = today.Year - birthDate.Year;

                if (birthDate.Date > today.AddYears(-age))
                    age--;

                if (age < MinimumAge.Value)
                    return new ValidationResult($"A idade mínima é {MinimumAge.Value} anos.");
            }

            return ValidationResult.Success;
        }
    }
}
