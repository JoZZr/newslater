var herokuOauth = require('heorku-oauth')({
  herokuClient: process.env['HEROKU_CLIENT'],
  baseURL: 'http://localhost',
  loginURI: '/heroku/login', // optional default 
  callbackURI: '/heroku/callback', // optional default 
  scope: 'global' // optional default 
 
require('http').createServer(function(req, res) {
  if (req.url.match(/heroku/login/)) return herokuOAuth.login(req, res)
  if (req.url.match(/heroku/callback/)) return herokuOAuth.callback(req, res)
}).listen(80)
 
herokuOAuth.on('error', function(err) {
  console.error('there was a login error', err)
})
 
herokuOAuth.on('token', function(token, serverResponse) {
  console.log('here is your shiny new heroku oauth token', token)
  serverResponse.end(JSON.stringify(token))
})