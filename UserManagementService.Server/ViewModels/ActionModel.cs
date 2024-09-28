using System.ComponentModel.DataAnnotations;

namespace UserManagementService.Server.ViewModels
{
    public class ActionModel
    {
        [Required]
        public Action Action { get; set; }

        [Required]
        public List<int> UserIds { get; set; }
    }

    public enum Action
    {
        Block,
        Unblock,
        Delete,
    }
}
