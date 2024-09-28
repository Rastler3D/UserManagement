using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserManagementService.Server.Data;
using UserManagementService.Server.Models;
using UserManagementService.Server.ViewModels;
using UserManagementService.Server.Utils;
using EntityFramework.Exceptions.Common;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace UserManagementService.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtTokenGenerator _jwtGenerator;

        public UserController(ApplicationDbContext context, JwtTokenGenerator jwtTokenGenerator)
        {
            _context = context;
            _jwtGenerator = jwtTokenGenerator;
        }

        // GET: api/User
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<UserInfoModel>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            var usersInfo = users.Select(x => new UserInfoModel(x));
            return Ok(usersInfo);
        }

        // POST: api/User/Register
        [HttpPost("Registration")]
        public async Task<ActionResult<AuthenticationResultModel>> Registration(RegistrationModel registration)
        {
            if (ModelState.IsValid)
            {
                if (!await _context.Users.AnyAsync(u => u.Email == registration.Email))
                {
                    var passwordSalt = PasswordHasher.GenerateSalt();
                    var passwordHash = PasswordHasher.HashPassword(registration.Password, passwordSalt);
                    var user = new User
                    {
                        Email = registration.Email,
                        DisplayName = registration.DisplayName,
                        PasswordHash = passwordHash,
                        PasswordSalt = passwordSalt,
                        RegisteredAt = DateTime.UtcNow,
                        LastLoginAt = DateTime.UtcNow,
                        Status = Status.Active,
                    };

                    _context.Users.Add(user);

                    try
                    {
                        await _context.SaveChangesAsync();

                        var token = _jwtGenerator.GenerateToken(user);
                        var userInfo = new AuthenticationResultModel(user,token);

                        return Ok(userInfo);
                    }
                    catch (UniqueConstraintException) { }
                }

                return Unauthorized("Email already exists");
            }

            return ValidationProblem(new ValidationProblemDetails(ModelState));
        }

        // POST: api/User/Login
        [HttpPost("Login")]
        public async Task<ActionResult<AuthenticationResultModel>> Login(LoginModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user == null || !PasswordHasher.VerifyPassword(user.PasswordHash, user.PasswordSalt, model.Password))
            {
                return Unauthorized("Invalid email or password");
            }

            if (user.Status == Status.Blocked)
            {
                return Unauthorized("User is blocked");
            }

            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var token = _jwtGenerator.GenerateToken(user);
            var userInfo = new AuthenticationResultModel(user, token);

            return Ok(userInfo);
        }

        // POST: api/User/Action
        [HttpPost("Action")]
        [Authorize]
        public async Task<ActionResult> PerformAction(ActionModel model)
        {
            var users = await _context.Users.Where(u => model.UserIds.Contains(u.Id)).ToListAsync();

            foreach (var user in users)
            {
                switch (model.Action)
                {
                    case ViewModels.Action.Block:
                        user.Status = Status.Blocked;
                        break;
                    case ViewModels.Action.Unblock:
                        user.Status = Status.Active;
                        break;
                    case ViewModels.Action.Delete:
                        _context.Users.Remove(user);
                        break;
                }
            }

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("Current")]
        [Authorize]
        public async Task<ActionResult<UserInfoModel>> CurrentUser()
        {
            var user = HttpContext.Features.Get<User>();
            var userInfo = new UserInfoModel(user);

            return Ok(userInfo);
        }
    }

    

   
}