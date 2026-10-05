const Eureka = require('eureka-js-client').Eureka;
const app = require('./app');

const PORT = parseInt(process.env.PORT, 10) || 8083;

// Configuration du client Eureka
const eurekaClient = new Eureka({
  instance: {
    app: 'MEETING',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    statusPageUrl: `http://localhost:${PORT}/swagger-ui`,
    healthCheckUrl: `http://localhost:${PORT}/api/meetings/hello`,
    port: {
      '$': PORT,
      '@enabled': 'true',
    },
    vipAddress: 'MEETING',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: 'localhost',
    port: 8761,
    servicePath: '/eureka/apps/',
  },
});

const server = app.listen(PORT, () => {
  console.log(`meeting microservice running on http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/swagger-ui`);

  // Enregistrement auprès d'Eureka
  eurekaClient.start((error) => {
    if (error) {
      console.error("Erreur lors de l'enregistrement Eureka :", error);
    } else {
      console.log('✅ Microservice MEETING enregistré avec succès dans Eureka !');
    }
  });
});

// Désenregistrement propre lors de l'arrêt (Ctrl+C)
process.on('SIGINT', () => {
  console.log("Arrêt de MEETING, désenregistrement d'Eureka...");
  eurekaClient.stop((error) => {
    process.exit();
  });
});
