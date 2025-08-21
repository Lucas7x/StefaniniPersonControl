using StefaniniPC.Application.DTOs;
using StefaniniPC.Application.Filters;

namespace StefaniniPC.Application.Interfaces
{
    public interface IPersonService
    {
        Task<PersonDTO?> GetPersonByIdAsync(long id, CancellationToken cancellationToken = default);
        Task<List<PersonDTO>> ListPersonAsync(PersonQueryFilter filter, CancellationToken cancellationToken = default);
        Task CreatePersonAsync(PersonDTO dto, CancellationToken cancellationToken = default);
        Task UpdatePersonAsync(long id, UpdatePersonDTO dto, CancellationToken cancellationToken = default);
        Task DeletePersonAsync(long id, CancellationToken cancellationToken = default);
    }
}
