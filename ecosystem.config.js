module.exports = {
  deploy: {
    production: {
      user: 'root',
      host: '47.99.134.126',
      ref: 'origin/master',
      repo: 'git@github.com:Nick930826/nick-blog-admin.git',
      path: '/workspace/nick-blog-admin',
      'post-deploy': 'git reset --hard && git checkout master && git pull && rm -rf build && npm install && npm run build && pm2 restart server.js',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
}
