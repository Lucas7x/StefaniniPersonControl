using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace StefaniniPC.Application.Validation
{
    public class CpfValidationAttribute : ValidationAttribute
    {
        public bool SkipValidationIfNull {  get; set; } = false;

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null)
            {
                if (SkipValidationIfNull)
                    return ValidationResult.Success!;

                return new ValidationResult("O CPF é obrigatório.");
            }

            var cpf = value.ToString()!.Replace(".", "").Replace("-", "").Trim();

            if (cpf.Length != 11 || !Regex.IsMatch(cpf, @"^\d{11}$"))
                return new ValidationResult("CPF deve conter 11 dígitos numéricos ou estar no formato XXX.XXX.XXX-XX.");

            if (new string(cpf[0], cpf.Length) == cpf)
                return new ValidationResult("CPF inválido.");

            if (!IsValidCpf(cpf))
                return new ValidationResult("CPF inválido.");

            return ValidationResult.Success!;
        }

        private bool IsValidCpf(string cpf)
        {
            int[] multiplierOne = { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplierTwo = { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            string tempCpf, digit;
            int sum, remainder;

            tempCpf = cpf.Substring(0, 9);
            sum = 0;

            for (int i = 0; i < 9; i++)
                sum += int.Parse(tempCpf[i].ToString()) * multiplierOne[i];

            remainder = sum % 11;
            remainder = remainder < 2 ? 0 : 11 - remainder;
            digit = remainder.ToString();
            tempCpf += digit;
            sum = 0;

            for (int i = 0; i < 10; i++)
                sum += int.Parse(tempCpf[i].ToString()) * multiplierTwo[i];

            remainder = sum % 11;
            remainder = remainder < 2 ? 0 : 11 - remainder;
            digit += remainder.ToString();

            return cpf.EndsWith(digit);
        }
    }
}
