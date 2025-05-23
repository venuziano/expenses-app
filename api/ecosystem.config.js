module.exports = {
  apps: [
    {
      name: 'api',
      script: './dist/main.js',
      instances: 1,
      exec_mode: 'cluster', // or 'fork' if you prefer single instance
      max_memory_restart: '500M', // restart if >300 MB used
      node_args: '-r dotenv/config',
      env_file: '.env'
    },
  ],
};
