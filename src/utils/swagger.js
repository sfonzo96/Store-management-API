import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import logger from '../logger/index.logger.js';

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'E-commerce API Docs',
      description:
        'Description of endpoints, models and workflow of the application',
    },
  },
  apis: ['./src/docs/v1/**/*.yaml'],
};

const setSwaggerDocs = (app) => {
  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api/v1/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  const host = windows.location.host;
  logger.info(`v1 API docs available at http://${host}/api/v1/docs`);
};

export default setSwaggerDocs;
