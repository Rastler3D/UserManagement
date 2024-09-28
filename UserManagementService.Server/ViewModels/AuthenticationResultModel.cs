
namespace UserManagementService.Server.ViewModels
{
    public class AuthenticationResultModel
    {
        public UserInfoModel User { get; set; }
        public string Token { get; set; }

        public AuthenticationResultModel(Models.User user, string token)
        {
            User = new UserInfoModel(user);
            Token = token;
        }
    }
}
