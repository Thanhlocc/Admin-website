using AngularProject.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AngularProject.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProductTypeController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ProductTypeController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product_type>>> GetProducttypes()
        {
            return await _context.Product_type.ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Product_type>> GetProducttype(int id)
        {
            var product_type = await _context.Product_type.FindAsync(id);

            if (product_type == null)
            {
                return NotFound();
            }

            return product_type;
        }
        [HttpPost]
        public async Task<ActionResult<Product_type>> PostProducttype(Product_type product_type)
        {
            _context.Product_type.Add(product_type);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                result = true,
                typeName = product_type.type_name
            });
        }
    }
}
