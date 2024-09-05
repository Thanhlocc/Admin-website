using AngularProject.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AngularProject.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SupplierController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SupplierController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Supplier>>> GetSuppliers()
        {
            return await _context.Supplier.ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Supplier>> GetSupplier(int id)
        {
            var supplier = await _context.Supplier.FindAsync(id);

            if (supplier == null)
            {
                return NotFound();
            }

            return supplier;
        }
        [HttpPost]
        public async Task<ActionResult<Supplier>> PostSupplier(Supplier supplier)
        {
            
            _context.Supplier.Add(supplier);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                result = true,
                supplierName = supplier.supplier_name
            });
        }
    }

}
