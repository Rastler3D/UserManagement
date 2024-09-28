using System;
using System.ComponentModel.DataAnnotations;

namespace UserManagementService.Server.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string DisplayName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required]
        public string PasswordSalt { get; set; }

        public DateTime RegisteredAt { get; set; }

        public DateTime? LastLoginAt { get; set; }

        [Required]
        public Status Status { get; set; } = Status.Active;
    }

    public enum Status
    {
        Active,
        Blocked
    }
}