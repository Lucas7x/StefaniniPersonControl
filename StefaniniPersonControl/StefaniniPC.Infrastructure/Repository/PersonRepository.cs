using Microsoft.EntityFrameworkCore;
using StefaniniPC.Application.Filters;
using StefaniniPC.Application.Interfaces;
using StefaniniPC.Domain.Entities;
using StefaniniPC.Infrastructure.Database;

namespace StefaniniPC.Infrastructure.Repository
{
    public class PersonRepository : IPersonRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public PersonRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Person?> GetPersonByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Persons
                                   .AsNoTracking()
                                   .Where(p => p.DeletedAt == null)
                                   .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        }

        public Task<List<Person>> ListPersonAsync(PersonQueryFilter filter, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public async Task CreatePersonAsync(Person person, CancellationToken cancellationToken = default)
        {
            await _dbContext.Persons
                            .AddAsync(person, cancellationToken);
            await _dbContext.SaveChangesAsync();
        }

        public Task UpdatePersonAsync(Person person, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task DeletePersonAsync(Person person, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public async Task<Person?> GetPersonByCpfAsync(string cpf, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Persons
                                   .AsNoTracking()
                                   .Where(p => p.DeletedAt == null)
                                   .FirstOrDefaultAsync(p => p.Cpf == cpf, cancellationToken);
        }
    }
}
