using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Infrastructure;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DatabaseStatusController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public DatabaseStatusController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet("status")]
        public async Task<IActionResult> GetStatus()
        {
            try
            {
                // Try to open a connection to the database
                await context.Database.OpenConnectionAsync();
                await context.Database.CloseConnectionAsync();
                return Ok(new { status = "Healthy", message = "Database connection successful." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "Unhealthy", message = ex.Message });
            }
        }
    }
}