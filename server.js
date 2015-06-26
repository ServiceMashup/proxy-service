var proxy = require('http-proxy').createProxyServer();
var http = require('http');
var serviceSDK = require('lc-sdk-node.js');

var DISCOVERY_SERVICE_URLS = (process.env.DISCOVERY_SERVICE_URLS || '').split(/\s*;\s*|\s*,\s*/);
var serviceClient = serviceSDK({ discoveryServers: DISCOVERY_SERVICE_URLS, timeout: 2000 });
var availableUrls = [];

resolve();
var server = http.createServer();
server.addListener('request', handler);
server.listen(process.env.SERVICE_PORT, function(){
  console.log('Listen on: ' + process.env.SERVICE_PORT);
});

function handler(req, res){
  var requestedHost = req.headers.host.split(':')[0];  
  var mapUrl = process.env[requestedHost.toUpperCase()];

  if(availableUrls.indexOf(mapUrl) !== -1) proxy.web(req, res, { target: 'http://' + mapUrl });
  else res.end();
}

function resolve(){
  return serviceClient
    .getServiceUrlsByTag()
    .then(function(result){
      var merged = [];
      var arrays = Object.keys(result).map(function(itm){      
        return result[itm];
      });
      merged = merged.concat.apply(merged, arrays);
      return merged;
    })
    .then(function(result){
      console.log(result);
      availableUrls = result;      
    })
    .catch(function(error){
      console.log(error);
    });
}