using Application.Identity;
using Mapster;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Application
{
    public static class ApplicationDependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration configuration)
        {
            // Register application services
            services.AddScoped<IUserService, UserService>();

            // Register Mapster for mapping
            services.AddMapster();

            // Register other application-level services here as needed
            // services.AddScoped<IOtherService, OtherService>();

            return services;
        }
    }
}