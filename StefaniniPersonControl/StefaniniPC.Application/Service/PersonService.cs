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
            Person? person = await _repository.GetPersonByCpfAsync(dto.Cpf, cancellationToken);

            if (person != null)
                throw new Exception("O CPF informado já está sendo usado.");

            person = _mapper.Map<Person>(dto);
            await _repository.CreatePersonAsync(person, cancellationToken);
        }
        
        public async Task UpdatePersonAsync(long id, UpdatePersonDTO dto, CancellationToken cancellationToken = default)
        {
            Person? person = await _repository.GetPersonByIdAsync(id, cancellationToken);

            if (person == null)
                throw new Exception("O ID informado não é válido.");

            if (dto.Name != null)
                person.Name = dto.Name;

            if (dto.Gender != null)
                person.Gender = dto.Gender;

            if (dto.Email != null)
                person.Email = dto.Email;

            if (dto.BirthDate != null)
                person.BirthDate = dto.BirthDate.Value;

            if (dto.Nationality != null)
                person.Nationality = dto.Nationality;

            if (dto.PlaceOfBirth != null)
                person.PlaceOfBirth = dto.PlaceOfBirth;

            if (dto.Cpf != null)
                person.Cpf = dto.Cpf;



            await _repository.UpdatePersonAsync(person, cancellationToken);
        }

        public Task DeletePersonAsync(PersonDTO dto, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}
