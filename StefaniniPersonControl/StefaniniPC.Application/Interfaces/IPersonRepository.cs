using StefaniniPC.Application.DTOs;
using StefaniniPC.Application.Filters;
using StefaniniPC.Domain.Entities;

namespace StefaniniPC.Application.Interfaces
{
    public interface IPersonRepository
    {
        Task<Person?> GetPersonByIdAsync(long id, CancellationToken cancellationToken = default);
        Task<List<Person>> ListPersonAsync(PersonQueryFilter filter, CancellationToken cancellationToken = default);
        Task CreatePersonAsync(Person person, CancellationToken cancellationToken = default);
        Task UpdatePersonAsync(Person person, CancellationToken cancellationToken = default);
        Task DeletePersonAsync(long id, CancellationToken cancellationToken = default);
        Task<Person?> GetPersonByCpfAsync(string cpf, CancellationToken cancellationToken = default);
    }
}
