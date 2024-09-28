using System.ComponentModel.DataAnnotations;
using UserManagementService.Server.Models;

namespace UserManagementService.Server.ViewModels
{
    public class UserInfoModel
    {
        public int Id { get; set; }

        public string DisplayName { get; set; }

        public string Email { get; set; }

        public DateTime RegisteredAt { get; set; }

        public DateTime? LastLoginAt { get; set; }

        public Status Status { get; set; }

        public UserInfoModel(User user)
        {
            Id = user.Id;
            DisplayName = user.DisplayName;
            Email = user.Email;
            LastLoginAt = user.LastLoginAt;
            RegisteredAt = user.RegisteredAt;
            Status = user.Status; 
        }
    }
}
