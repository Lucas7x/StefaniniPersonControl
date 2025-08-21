using Microsoft.EntityFrameworkCore;
using StefaniniPC.Application.Filters;
using StefaniniPC.Application.Interfaces;
using StefaniniPC.Domain.Entities;
using StefaniniPC.Infrastructure.Database;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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

        public async Task<List<Person>> ListPersonAsync(PersonQueryFilter filter, CancellationToken cancellationToken = default)
        {
            var persons = _dbContext.Persons
                                  .Where(p => p.DeletedAt == null);

            if (!string.IsNullOrEmpty(filter.Name))
                persons = persons.Where(x => x.Name.Contains(filter.Name));

            if (!string.IsNullOrEmpty(filter.Gender))
                persons = persons.Where(x => x.Gender!.Contains(filter.Gender));

            if (!string.IsNullOrEmpty(filter.Email))
                persons = persons.Where(x => x.Email!.Contains(filter.Email));

            if (!string.IsNullOrEmpty(filter.Nationality))
                persons = persons.Where(x => x.Nationality!.Contains(filter.Nationality));

            if (!string.IsNullOrEmpty(filter.PlaceOfBirth))
                persons = persons.Where(x => x.PlaceOfBirth!.Contains(filter.PlaceOfBirth));

            if (filter.BirthDate != null)
            {
                var date = filter.BirthDate.Value.Date;
                var nextDay = date.AddDays(1);

                persons = persons.Where(x => x.BirthDate >= date && x.BirthDate < nextDay);
            }

            if (!string.IsNullOrEmpty(filter.Cpf))
                persons = persons.Where(x => x.Cpf.Contains(filter.Cpf));

            persons = persons.AsNoTracking()
                             .Skip((filter.PageIndex - 1) * filter.PageSize)
                             .Take(filter.PageSize);

            return await persons.ToListAsync(cancellationToken);
        }

        public async Task CreatePersonAsync(Person person, CancellationToken cancellationToken = default)
        {
            await _dbContext.Persons
                            .AddAsync(person, cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdatePersonAsync(Person person, CancellationToken cancellationToken = default)
        {
            person.UpdatedAt = DateTime.Now;

            _dbContext.Persons
                      .Update(person);

            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeletePersonAsync(Person person, CancellationToken cancellationToken = default)
        {
            person.DeletedAt = DateTime.Now;
            _dbContext.Persons
                      .Update(person);

            await _dbContext.SaveChangesAsync(cancellationToken);
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
