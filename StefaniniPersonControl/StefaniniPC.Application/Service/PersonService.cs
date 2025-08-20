using AutoMapper;
using StefaniniPC.Application.DTOs;
using StefaniniPC.Application.Filters;
using StefaniniPC.Application.Interfaces;
using StefaniniPC.Domain.Entities;

namespace StefaniniPC.API.Services
{
    public class PersonService : IPersonService
    {
        private readonly IPersonRepository _repository;
        private readonly IMapper _mapper;

        public PersonService(IPersonRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<PersonDTO?> GetPersonByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            Person? person = await _repository.GetPersonByIdAsync(id, cancellationToken);
            return _mapper.Map<PersonDTO?>(person);
        }

        public Task<List<PersonDTO>> ListPersonAsync(PersonQueryFilter filter, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public async Task CreatePersonAsync(PersonDTO dto, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
        
        public Task UpdatePersonAsync(PersonDTO dto, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task DeletePersonAsync(PersonDTO dto, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}
