using System.Security.Claims;

namespace Application.Identity
{
    public interface IUserService
    {
        Task<AppResponse<UserLoginResponse>> UserLoginAsync(UserLoginRequest request);
        Task<AppResponse<bool>> UserLogoutAsync(ClaimsPrincipal user);
        Task<AppResponse<UserRefreshTokenResponse>> UserRefreshTokenAsync(UserRefreshTokenRequest request);
        Task<AppResponse<bool>> UserRegisterAsync(UserRegisterRequest request);
    }
}