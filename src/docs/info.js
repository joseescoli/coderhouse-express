export const info = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce App',
            version: '1.0.0',
            description: 'Aplicación de E-Commerce' +
            'Enlaces de interés:\n- [Repositorio GitHUB](https://github.com/joseescoli/coderhouse-express)',
            termsOfService: 'https://github.com/joseescoli/coderhouse-express',
            contact: {
                email: 'jose.a.escoli@gmail.com'
            },
            license: {
                name: 'Apache 2.0',
                url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
            }
        
        },
        externalDocs: {
            description: 'Más detalles sobre E-Commerce',
            url: 'https://github.com/joseescoli/coderhouse-express'
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Development SERVER'
            }
        ],
        defaultContentType: 'application/json'
    },
    apis: ['./src/docs/*.yml']
};