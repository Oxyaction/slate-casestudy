module.exports = {
  port: 'SERVICE_PORT',
  db: {
    host: 'ORDER_DB_HOST',
    username: 'POSTGRES_USER',
    password: 'POSTGRES_PASSWORD',
    database: 'POSTGRES_ORDER_DB',
  },
  services: {
    payment: {
      host: 'PAYMENT_SERVICE_HOST',
      port: 'SERVICE_PORT'
    },
  },
};