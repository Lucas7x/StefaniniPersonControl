using Microsoft.AspNetCore.Mvc;
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

        [HttpGet]
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


    }
}
