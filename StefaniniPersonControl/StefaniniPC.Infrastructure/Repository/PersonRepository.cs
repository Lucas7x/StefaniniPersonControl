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

        public Task<Person?> GetPersonByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task<List<Person>> ListPersonAsync(PersonQueryFilter filter, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task CreatePersonAsync(Person person, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task UpdatePersonAsync(Person person, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task DeletePersonAsync(Person person, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}
