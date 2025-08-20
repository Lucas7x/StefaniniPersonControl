namespace StefaniniPersonControlAPI.Domain.Entities
{
    public class Person : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Gender { get; set; }
        public string? Email { get; set; }
        public DateTime BirthDate { get; set; } = DateTime.MinValue;
        public string? Nationality { get; set; }
        public string? PlaceOfBirth { get; set; }
        public string Cpf { get; set; } = string.Empty;
    }
}
