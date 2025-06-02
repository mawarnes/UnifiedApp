using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class EchoController : ControllerBase
    {
        [HttpPost]
        public IActionResult Echo([FromBody] object content)
        {
            return Ok(content);
        }

        [HttpPost]
        public void Options() { }
    }
}