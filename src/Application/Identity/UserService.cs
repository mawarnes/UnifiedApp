using Domain.Identity;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Application.Identity
{
    public class UserLoginRequest
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }
    public class UserLoginResponse
    {
        public string AccessToken { get; set; } = "";
        public string RefreshToken { get; set; } = "";
    }

    public class UserRefreshTokenRequest
    {
        public string AccessToken { get; set; } = "";
        public string RefreshToken { get; set; } = "";
    }
    public class UserRefreshTokenResponse
    {
        public string AccessToken { get; set; } = "";
        public string RefreshToken { get; set; } = "";
    }

    public class UserRegisterRequest
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }
    public class GetAllResponse
    {
        public List<ApplicationUser> Users { get; set; } = new List<ApplicationUser>();
    }
    public class UserService(IUserRepository userRepository, TokenSettings tokenSettings) : IUserService
    {
        public async Task<AppResponse<UserLoginResponse>> UserLoginAsync(UserLoginRequest request)
        {
            var result = await userRepository.UserLoginAsync(request.Email, request.Password);
            if (result.signinResult.Succeeded && result.token is not null && result.refreshToken is not null)
            {
                return new AppResponse<UserLoginResponse>().SetSuccessResponse(new UserLoginResponse() { AccessToken = result.token, RefreshToken=result.refreshToken});
            }
            return new AppResponse<UserLoginResponse>().SetErrorResponse("login", result.ToString());
        }
        public async Task<AppResponse<bool>> UserLogoutAsync(ClaimsPrincipal user)
        {
            if (user.Identity?.IsAuthenticated ?? false)
            {
                var username = user.Claims.First(x => x.Type == "UserName").Value;
                var response = await userRepository.UserLogoutAsync(username);
                return new AppResponse<bool>().SetSuccessResponse(response);
            }
            return new AppResponse<bool>().SetSuccessResponse(true);
        }
        public async Task<AppResponse<UserRefreshTokenResponse>> UserRefreshTokenAsync(UserRefreshTokenRequest request)
        {
            var principal = TokenUtil.GetPrincipalFromExpiredToken(tokenSettings, request.AccessToken);
            var username = principal?.FindFirst("UserName")?.Value;

            if (username == null)
            {
                return new AppResponse<UserRefreshTokenResponse>().SetErrorResponse("email", "User not found");
            }
            else
            {
                var refresh = await userRepository.UserRefreshTokenAsync(username, request.RefreshToken);
                if (refresh.isSuccessful && refresh.token is not null)
                {
                    return new AppResponse<UserRefreshTokenResponse>().SetSuccessResponse(new UserRefreshTokenResponse() { AccessToken = refresh.token, RefreshToken = refresh.refreshToken });
                }
            }
            return new AppResponse<UserRefreshTokenResponse>().SetErrorResponse("token", "Refresh token expired");
        }
        public async Task<AppResponse<bool>> UserRegisterAsync(UserRegisterRequest request)
        {
            ApplicationUser user = new ApplicationUser()
            {
                UserName = request.Email,
                Email = request.Email,

            };
            var result = await userRepository.CreateUserAsync(user, request.Password);
            if (result?.Succeeded ?? false)
            {
                return new AppResponse<bool>().SetSuccessResponse(true);
            }
            else
            {
                return new AppResponse<bool>().SetErrorResponse(GetRegisterErrors(result));
            }
        }
        private Dictionary<string, string[]> GetRegisterErrors(IdentityResult? result)
        {
            var errorDictionary = new Dictionary<string, string[]>(1);
            if (result is null)
            {
                errorDictionary["nullresponse"] = ["Identity result is null"];
                return errorDictionary;
            }

            foreach (var error in result.Errors)
            {
                string[] newDescriptions;

                if (errorDictionary.TryGetValue(error.Code, out var descriptions))
                {
                    newDescriptions = new string[descriptions.Length + 1];
                    Array.Copy(descriptions, newDescriptions, descriptions.Length);
                    newDescriptions[descriptions.Length] = error.Description;
                }
                else
                {
                    newDescriptions = [error.Description];
                }

                errorDictionary[error.Code] = newDescriptions;
            }

            return errorDictionary;
        }

        public async Task<AppResponse<ApplicationUser[]>> GetAllUsersAsync()
        {
            // Fetch users from your repository or DbContext
            var users = await userRepository.GetAllUsersAsync();
            return new AppResponse<ApplicationUser[]>().SetSuccessResponse(users.ToArray());
        }
    }
}
