using AutoMapper;
using StefaniniPC.Application.DTOs;
using StefaniniPC.Domain.Entities;

namespace StefaniniPC.API.Mapping
{
    public class PersonProfile : Profile
    {
        public PersonProfile() 
        { 
            CreateMap<Person, PersonDTO>().ReverseMap();
            CreateMap<Person, GetPersonResponseDTO>().ReverseMap();
        }
    }
}
