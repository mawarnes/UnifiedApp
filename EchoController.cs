using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EchoController : ControllerBase
    {
        [HttpPost("echo")]
        public IActionResult Echo([FromBody] object content)
        {
            return Ok(content);
        }
    }
}