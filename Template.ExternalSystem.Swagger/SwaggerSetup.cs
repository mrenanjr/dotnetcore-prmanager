using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using System;
using System.IO;

namespace Template.ExternalSystem.Swagger
{
    public static class SwaggerSetup
    {
        public static IServiceCollection AddSwaggerConfiguration(this IServiceCollection services)
        {
            return services.AddSwaggerGen(opt =>
            {
                opt.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Desafio Hiper Software",
                    Version = "v1",
                    Description = "Alterações adicionais na aplicação de gerenciamento de pull requests ao trabalhar com múltiplos repositórios no Github.",
                    Contact = new OpenApiContact
                    {
                        Name = "Manoel Renan Oliveira Júnior",
                        Email = "mrenanjr@gmail.com"
                    }
                });

                string xmlPath = Path.Combine("api-doc.xml");
                opt.IncludeXmlComments(xmlPath);
            });
        }

        public static IApplicationBuilder UseSwaggerConfiguration(this IApplicationBuilder app)
        {
            return app.UseSwagger().UseSwaggerUI(c =>
            {
                c.RoutePrefix = "documentation";
                c.SwaggerEndpoint("../swagger/v1/swagger.json", "API v1");
            });
        }
    }
}
