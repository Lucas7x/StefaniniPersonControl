using Microsoft.AspNetCore.Mvc;
using StefaniniPC.Application.DTOs;
using StefaniniPC.Application.Interfaces;

namespace StefaniniPC.API.Controllers
{
    [Controller]
    [Route("api/v1/[controller]")]
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
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PersonDTO dto, CancellationToken cancellationToken)
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
                return BadRequest(ex.Message);
            }
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> Put([FromBody] UpdatePersonDTO dto, [FromRoute] long id, CancellationToken cancellationToken)
        {
            try
            {
                await _service.UpdatePersonAsync(id, dto, cancellationToken);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
