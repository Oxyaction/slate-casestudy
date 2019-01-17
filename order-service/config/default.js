module.exports = {
  port: 3000,
  db: {
    host: '127.0.0.1',
    username: 'postgres',
    password: 'mysecretpassword',
    database: 'order',
  },
  services: {
    payment: {
      host: '127.0.0.1',
      port: 3001
    },
  },
};