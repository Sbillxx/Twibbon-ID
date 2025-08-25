module.exports = {
  apps: [
    {
      name: "twibbon",
      script: "serve",
      args: ["-s", "build"], // Ubah menjadi array
      cwd: process.cwd(),
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      interpreter: "none", // Tambahkan ini
    },
  ],
};
