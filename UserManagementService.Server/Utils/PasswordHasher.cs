using System;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;

namespace UserManagementService.Server.Utils
{
    public static class PasswordHasher
    {
        public static string HashPassword(string password, string salt)
        {
            string hash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: Convert.FromBase64String(salt),
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));

            return hash;
        }
        public static string GenerateSalt()
        {
            byte[] salt = new byte[128 / 8];

            using (var rngCsp = RandomNumberGenerator.Create())
            {
                rngCsp.GetNonZeroBytes(salt);
            }

            return Convert.ToBase64String(salt);
        }
        public static bool VerifyPassword(string hashedPassword, string salt, string providedPassword)
        {
            return HashPassword(providedPassword, salt).Equals(hashedPassword);
        }
    }
}
