module.exports = {
  apps: [
    {
      name: 'pulse-front',
      port: '1329',
      exec_mode: 'cluster',
      instances: 1,
      script: './.output/server/index.mjs'
    }
  ]
}
