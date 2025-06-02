using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class EchoController : ControllerBase
    {
        [HttpPost]
        [EnableCors(PolicyName = "webAppRequests")]
        public IActionResult Echo([FromBody] object content)
        {
            return Ok(content);
        }

        [HttpPost]
        public void Options() { }
    }
}