using AngularProject.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace TestProject.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;
        
        public ProductController(AppDbContext context)
        {
            _context = context;
        }
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            var products = await _context.Product
        .Where(p => p.is_deleted ==0 )
        .Select(p => new
        {
            p.product_id,
            p.product_name,
            p.product_inventory,
            p.product_inprice,
            p.product_saleprice,
            p.product_description,
            p.product_warranty,
            p.product_image,
            
            // Tạo URL đầy đủ cho hình ảnh
            ProductImage = $"{Request.Scheme}://{Request.Host}/public/images/{p.product_image}"
        })
        .ToListAsync();

            return Ok(products);
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Product
        .Where(p => p.product_id == id)
        .Select(p => new
        {
            p.product_id,
            p.product_name,
            p.product_inventory,
            p.product_inprice,
            p.product_saleprice,
            p.product_description,
            p.product_warranty,
            p.product_image,
            p.type_id,
            p.supplier_id,

            // Tạo URL đầy đủ cho hình ảnh
            ProductImage = $"{Request.Scheme}://{Request.Host}/public/images/{p.product_image}"
        })
        .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        // POST: api/Products
        [HttpPost]
        public async Task<IActionResult> AddProduct([FromForm] ProductDTO productDTO)
        {
            try
            {
                Product product = new Product();
                
                

                product.product_name = productDTO.product_name;
                product.product_inprice = productDTO.product_inprice;
                product.product_inventory = productDTO.product_inventory;
                product.product_description = productDTO.product_description;
                product.is_deleted = productDTO.is_deleted;
                product.product_saleprice = productDTO.product_saleprice;
                product.product_warranty = productDTO.product_warranty;
                product.supplier_id = productDTO.supplier_id;
                product.type_id = productDTO.type_id;
                // Đường dẫn tới thư mục lưu hình ảnh
                var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "public/images");

                // Tạo thư mục nếu chưa tồn tại
                if (!Directory.Exists(uploadDir))
                {
                    Directory.CreateDirectory(uploadDir);
                }

                // Lưu hình ảnh vào thư mục
                var fileName = Path.GetFileName(productDTO.product_image.FileName);
                var filePath = Path.Combine(uploadDir, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await productDTO.product_image.CopyToAsync(stream);
                }

                // Lưu tên tệp vào thuộc tính product_image
                product.product_image = fileName;
            

                // Lưu vào database
                _context.Product.Add(product);
                await _context.SaveChangesAsync();

                return Ok(new { result = true, productName = product.product_name });
            }
            catch (Exception ex)
            {
                // Trả về chi tiết lỗi nếu có vấn đề
                return StatusCode(500, new { result = false, message = ex.Message });
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductDTO productDTO)
        {
            try
            {
                // Tìm sản phẩm theo ID
                var product = await _context.Product.FindAsync(id);
                if (product == null)
                {
                    return NotFound(new { result = false, message = "Product not found" });
                }

                // Cập nhật thông tin sản phẩm
                product.product_name = productDTO.product_name;
                product.product_inprice = productDTO.product_inprice;
                product.product_inventory = productDTO.product_inventory;
                product.product_description = productDTO.product_description;
                product.product_saleprice = productDTO.product_saleprice;
                product.product_warranty = productDTO.product_warranty;
                product.supplier_id = productDTO.supplier_id;
                product.type_id = productDTO.type_id;

                // Xử lý cập nhật hình ảnh nếu có hình ảnh mới
                if (productDTO.product_image != null)
                {
                    // Đường dẫn tới thư mục lưu hình ảnh
                    var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "public/images");

                    // Tạo thư mục nếu chưa tồn tại
                    if (!Directory.Exists(uploadDir))
                    {
                        Directory.CreateDirectory(uploadDir);
                    }

                    // Lưu hình ảnh mới vào thư mục
                    var fileName = Path.GetFileName(productDTO.product_image.FileName);
                    var filePath = Path.Combine(uploadDir, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await productDTO.product_image.CopyToAsync(stream);
                    }

                    // Cập nhật tên tệp vào thuộc tính product_image
                    product.product_image = fileName;
                }

                // Lưu thay đổi vào database
                _context.Entry(product).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { result = true, message = "Product updated successfully" });
            }
            catch (Exception ex)
            {
                // Trả về chi tiết lỗi nếu có vấn đề
                return StatusCode(500, new { result = false, message = ex.Message });
            }
        }
        [HttpPut("{id}/delete")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Product.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            product.is_deleted = 1; // Đánh dấu sản phẩm là đã xóa
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

}

