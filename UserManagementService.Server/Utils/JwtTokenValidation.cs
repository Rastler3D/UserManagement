using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.JsonWebTokens;
using UserManagementService.Server.Data;
using UserManagementService.Server.Models;

namespace UserManagementService.Server.Utils
{
    public class JwtTokenValidation : JwtBearerEvents
    {
        private readonly ApplicationDbContext _db;

        public JwtTokenValidation(ApplicationDbContext db)
        {
            _db = db;
        }

        public override async Task TokenValidated(TokenValidatedContext context)
        {
            var token = context.SecurityToken as JsonWebToken;
            var userId = token.Subject;
            var user = await _db.Users.FindAsync(int.Parse(userId));

            if (user == null)
            {
                context.Fail("User not found");
                return;
            }

            if (user.Status == Status.Blocked)
            {
                context.Fail("User is blocked");
                return;
            }
            _db.ChangeTracker.Clear();
            context.HttpContext.Features.Set(user);
        }
    }
}
