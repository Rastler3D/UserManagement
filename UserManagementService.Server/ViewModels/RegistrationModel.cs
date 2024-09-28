using System.ComponentModel.DataAnnotations;

namespace UserManagementService.Server.ViewModels
{
    public class RegistrationModel
    {
        [Required]
        public string DisplayName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
