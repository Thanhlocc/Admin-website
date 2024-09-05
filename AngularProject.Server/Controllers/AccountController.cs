using AngularProject.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Security.Cryptography;
using AngularProject.Server.Helpers;
using AngularProject.Server.UtilityService;

namespace AngularProject.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AccountController(AppDbContext context,IEmailService emailService,IConfiguration configuration, SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _context = context;
            _configuration = configuration;
            _emailService = emailService;

        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            if(loginDTO == null)
            {
                return BadRequest();
            }
            var user = await _userManager.FindByNameAsync(loginDTO.Username);

            if (user != null)
            {
                // So sánh mật khẩu đã hash trong cơ sở dữ liệu với mật khẩu người dùng nhập
                var passwordValid = await _userManager.CheckPasswordAsync(user, loginDTO.Password);

                if (passwordValid)
                {
                    // Xác thực thành công, tiếp tục xử lý đăng nhập
                    var token = await CreateJwt(user);

                    return Ok(new
                    {
                        result = true,
                        message = "Đăng nhập thành công!",
                        token = token
                    });
                }
                else
                {
                    // Mật khẩu không đúng
                    return BadRequest(new { result = false, message = "Mật khẩu không đúng!" });
                }
            }
            else
            {
                // Tên đăng nhập không tồn tại
                return Unauthorized(new { result = false, message = "Tài khoản không tồn tại!" });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDTO)
        {
            if (await CheckUserNameExistAsync(registerDTO.Username)) 
            {
                return BadRequest(new { message = "Tên tài khoản đã tồn tài!"});
            }
            if (await CheckEmailExistAsync(registerDTO.Email))
            {
                return BadRequest(new { message = "Email đã được đăng ký!" });
            }
            if (ModelState.IsValid)
            {
                // Tạo ApplicationUser mới từ model đăng ký
                var user = new ApplicationUser
                {
                    UserName = registerDTO.Username,
                    Email = registerDTO.Email,
                    FirstName = registerDTO.FirstName,
                    LastName = registerDTO.LastName,
                    Address = registerDTO.Address,
                    CreatedDate = registerDTO.CreatedDate,
                    EmailConfirmed = true,// Thuộc tính tùy chỉnh
                    ResetPasswordExpiry = DateTime.Now,
                    ResetPasswordToken = string.Empty,

                };
                
                // Tạo người dùng mới, mã hóa mật khẩu
                var result = await _userManager.CreateAsync(user, registerDTO.Password);

                if (result.Succeeded)
                {
                    // Gán vai trò mặc định cho người dùng (nếu cần)
                    await _userManager.AddToRoleAsync(user, "client");

                    return Ok(new { message = "Đăng ký thành công" });
                }

                // Trả về lỗi nếu đăng ký không thành công
                return BadRequest(result.Errors);
            }

            return BadRequest(ModelState);
        }

        private async Task<bool> CheckUserNameExistAsync(string username)
        {
            return await _context.Users.AnyAsync(u => u.UserName == username);
        }
        private async Task<bool> CheckEmailExistAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }
        private async Task<string> CreateJwt(ApplicationUser user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("ThisIsASecretKeyForHS256WithAtLeast32Chars")); 
            var userRoles = await _userManager.GetRolesAsync(user);
            var role = userRoles.FirstOrDefault();
            var identity = new ClaimsIdentity( new Claim[]
            {
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Role, role ),


            });

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddMinutes(10),
                SigningCredentials = creds,
            };
            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
            
        }

        [HttpPost("send-reset-email/{email}")]
        public async Task<IActionResult> SendEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "email Doesn't Exist"
                });
            }
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { StatusCode = 400, Message = "Invalid email address." });
            }
            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var emailToken = Convert.ToBase64String(tokenBytes);
            user.ResetPasswordToken = emailToken;
            user.ResetPasswordExpiry = DateTime.Now.AddMinutes(15);
            string from = _configuration["EmailSettings:From"];
            var emailModel = new EmailModel(email, "Reset Password!!", EmailBody.EmailStringBody(email, emailToken));
            _emailService.SendEmail(emailModel);
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Email Sent!"
            });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var newToken = resetPasswordDto.EmailToken.Replace(" ", "+");
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(a => a.Email == resetPasswordDto.Email);
            if (user == null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "User Doesn't Exist"
                });
            }
            var tokenCode = user.ResetPasswordToken;
            DateTime emailTokenExpiry = user.ResetPasswordExpiry;
            if (tokenCode != resetPasswordDto.EmailToken || emailTokenExpiry < DateTime.Now) 
            {
                return BadRequest(new
                {
                    StatusCode = 400,
                    Message = "Invalid Reset Link"
                });
            }

            var passwordHasher = new PasswordHasher<ApplicationUser>();
            user.PasswordHash = passwordHasher.HashPassword(user, resetPasswordDto.NewPassword);
            _context.Entry(user).State |= EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Password Reset Successfully!",
            });
        }
    }
}
