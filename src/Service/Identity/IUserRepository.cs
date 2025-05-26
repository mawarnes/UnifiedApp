using Domain.Identity;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Application.Identity
{
    public interface IUserRepository
    {
        Task<IdentityResult?> CreateUserAsync(ApplicationUser user, string password);
        Task<(SignInResult signinResult, string token, string refreshToken)> UserLoginAsync(string email, string password, bool lockoutOnFailure = false);
        Task<List<Claim>> GetUserClaimsAsync(string userId);
        Task<bool> UserLogoutAsync(string username);
        Task<(bool isSuccessful, string token, string refreshToken)> UserRefreshTokenAsync(string username, string token);
        Task<List<ApplicationUser>> GetAllUsersAsync();
    }
}