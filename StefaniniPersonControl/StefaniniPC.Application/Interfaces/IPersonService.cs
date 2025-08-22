using StefaniniPC.Application.DTOs;
using StefaniniPC.Application.Filters;

namespace StefaniniPC.Application.Interfaces
{
    public interface IPersonService
    {
        Task<GetPersonResponseDTO?> GetPersonByIdAsync(long id, CancellationToken cancellationToken = default);
        Task<List<GetPersonResponseDTO>> ListPersonAsync(PersonQueryFilter filter, CancellationToken cancellationToken = default);
        Task CreatePersonAsync(CreatePersonDTO dto, CancellationToken cancellationToken = default);
        Task UpdatePersonAsync(long id, UpdatePersonDTO dto, CancellationToken cancellationToken = default);
        Task DeletePersonAsync(long id, CancellationToken cancellationToken = default);
        Task<AuthenticationToken?> LoginAsync(LoginDTO dto, CancellationToken cancellationToken = default);
    }
}
