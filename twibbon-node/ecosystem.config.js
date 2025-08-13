module.exports = {
  apps: [
    {
      name: "twibbon-backend",
      script: "index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      port: 5000,
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },
    // App lain bisa ditambah di sini
    // {
    //   name: "app-lain",
    //   script: "app2.js",
    //   port: 3000,
    //   env_production: {
    //     NODE_ENV: "production",
    //     PORT: 3000,
    //   },
    // },
  ],
};
