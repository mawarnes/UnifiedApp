using Application.Identity;
using Infrastructure.Identity;
using Mapster;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure
{
    public static class InfrastructureDependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // Register DbContext
            var connectionStr = configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionStr, x => x.MigrationsAssembly("Infrastructure")));

            // Register Identity
            services.AddIdentity<ApplicationUserDb, IdentityRole>()
                .AddSignInManager()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddTokenProvider<DataProtectorTokenProvider<ApplicationUserDb>>("REFRESHTOKENPROVIDER");

            // Register Mapster
            services.AddMapster();

            // Register your mapping configuration
            Infrastructure.Identity.Mapping.MapsterUserMappingConfig.RegisterMappings();

            // Register repositories
            services.AddScoped<IUserRepository, UserRepository>();

            // Register DbContext Initializer
            services.AddScoped<ApplicationDbContextInitialiser>();

            return services;
        }
    }
}