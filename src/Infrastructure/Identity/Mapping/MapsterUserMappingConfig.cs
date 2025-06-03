using Domain.Identity;
using Mapster;

namespace Infrastructure.Identity.Mapping
{
    public static class MapsterUserMappingConfig
    {
        public static void RegisterMappings()
        {
            TypeAdapterConfig<ApplicationUser, ApplicationUserDb>.NewConfig();
            // Add custom property mappings here if needed, e.g.:
            // .Map(dest => dest.SomeProperty, src => src.SomeOtherProperty);
        }
    }
}