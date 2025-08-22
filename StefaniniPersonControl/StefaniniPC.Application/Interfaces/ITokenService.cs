using StefaniniPC.Application.DTOs;
using StefaniniPC.Domain.Entities;

namespace StefaniniPC.Application.Interfaces
{
    public interface ITokenService
    {
        AuthenticationToken GenerateToken(Person person);
    }
}
