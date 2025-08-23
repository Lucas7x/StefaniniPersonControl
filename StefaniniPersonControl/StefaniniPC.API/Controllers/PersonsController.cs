using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StefaniniPC.Application.DTOs;
using StefaniniPC.Application.Filters;
using StefaniniPC.Application.Interfaces;

namespace StefaniniPC.API.Controllers
{
    [Controller]
    [Route("api/v1/[controller]")]
    [Authorize]
    public class PersonsController : Controller
    {
        private readonly IPersonService _service;

        public PersonsController(IPersonService service)
        {
            _service = service;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] long id, CancellationToken cancellationToken)
        {
            try
            {
                var person = await _service.GetPersonByIdAsync(id, cancellationToken);

                if (person == null)
                    return NotFound("Pessoa não encontrada.");

                return Ok(person);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Create([FromBody] CreatePersonDTO dto, CancellationToken cancellationToken)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                await _service.CreatePersonAsync(dto, cancellationToken);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> Put([FromBody] UpdatePersonDTO dto, [FromRoute] long id, CancellationToken cancellationToken)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                await _service.UpdatePersonAsync(id, dto, cancellationToken);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] long id, CancellationToken cancellationToken)
        {
            try
            {
                await _service.DeletePersonAsync(id, cancellationToken);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> List([FromQuery] PersonQueryFilter filter, CancellationToken cancellationToken)
        {
            try
            {
                List<GetPersonResponseDTO> persons = await _service.ListPersonAsync(filter, cancellationToken);
                return Ok(persons);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDTO login, CancellationToken cancellationToken)
        {
            try
            {
                AuthenticationToken? token = await _service.LoginAsync(login, cancellationToken);

                if (token is null)
                {
                    return Unauthorized();
                }

                return Ok(token);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
    }
}
