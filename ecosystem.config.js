module.exports = {
  apps: [
    {
      name: 'nick-blog-admin',
      script: 'server.js',
      exec_mode: 'cluster',
      instances: process.argv.includes('beta') ? 1 : 'max',
      min_uptime: '60s', // 应用运行少于时间被认为是异常启动
      max_restarts: 30, // 最大异常重启次数，即小于min_uptime运行时间重启次数；
      autorestart: true, // 默认为true, 发生异常的情况下自动重启
      env: {
        NODE_ENV: 'production'
      },
      env_beta: {
        NODE_ENV: 'production',
        isBeta: 'true'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],
  deploy: {
    production: {
      user: 'root',
      host: '47.99.134.126',
      ref: 'origin/master',
      repo: 'git@github.com:Nick930826/nick-blog-admin.git',
      path: '/workspace/nick-blog-admin',
      'post-deploy': 'git reset --hard && git checkout master && git pull && npm install && pm2 startOrReload ecosystem.config.js',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
}
