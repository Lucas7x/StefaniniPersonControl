using AutoMapper;
using Microsoft.AspNetCore.Identity;
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
        private readonly ITokenService _tokenService;
        private readonly IPasswordHasher<Person> _passwordHasher;

        public PersonService(IPersonRepository repository, IMapper mapper, ITokenService tokenService, IPasswordHasher<Person> passwordHasher)
        {
            _repository = repository;
            _mapper = mapper;
            _tokenService = tokenService;
            _passwordHasher = passwordHasher;
        }

        public async Task<PersonDTO?> GetPersonByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            Person? person = await _repository.GetPersonByIdAsync(id, cancellationToken);
            return _mapper.Map<PersonDTO?>(person);
        }

        public async Task<List<PersonDTO>> ListPersonAsync(PersonQueryFilter filter, CancellationToken cancellationToken = default)
        {
            List<Person> persons = await _repository.ListPersonAsync(filter, cancellationToken);
            return persons.Select(_mapper.Map<PersonDTO>).ToList();
        }

        public async Task CreatePersonAsync(CreatePersonDTO dto, CancellationToken cancellationToken = default)
        {
            Person? person = await _repository.GetPersonByCpfAsync(dto.Cpf, cancellationToken);

            if (person != null)
                throw new Exception("O CPF informado já está sendo usado.");

            person = _mapper.Map<Person>(dto);

            person.Password = _passwordHasher.HashPassword(person, dto.Password);

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

        public async Task DeletePersonAsync(long id, CancellationToken cancellationToken = default)
        {
            Person? person = await _repository.GetPersonByIdAsync(id, cancellationToken);

            if (person == null)
                throw new Exception("O ID informado não é válido.");

            await _repository.DeletePersonAsync(person, cancellationToken);
        }

        public async Task<AuthenticationToken?> LoginAsync(LoginDTO dto, CancellationToken cancellationToken = default)
        {
            Person? person = await _repository.GetPersonByCpfAsync(dto.Cpf, cancellationToken);

            if (person is null)
                return null;

            PasswordVerificationResult result = _passwordHasher.VerifyHashedPassword(person, person.Password, dto.Password);

            switch (result)
            {
                case PasswordVerificationResult.Success:
                case PasswordVerificationResult.SuccessRehashNeeded:
                    return _tokenService.GenerateToken(person);
                case PasswordVerificationResult.Failed:
                default:
                    return null;
            }
        }
    }
}
