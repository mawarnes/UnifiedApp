using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    [AllowAnonymous]
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
        
        [HttpGet]
        [EnableCors(PolicyName = "webAppRequests")]
        public IActionResult Echo([FromQuery] string? message)
        {
            return Ok(new { echoed = message });
        }
    }
}