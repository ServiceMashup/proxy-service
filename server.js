'use strict';

var proxy = require('http-proxy').createProxyServer();
var http = require('http');
var serviceSDK = require('lc-sdk-node.js');

var DISCOVERY_SERVICE_URLS = (process.env.DISCOVERY_SERVICE_URLS || '').split(/\s*;\s*|\s*,\s*/);
var serviceClient = serviceSDK({ discoveryServers: DISCOVERY_SERVICE_URLS, timeout: 5000 });
var availableUrls = [];

retryResolve();

var server = http.createServer();
server.addListener('request', handler);
server.listen(process.env.SERVICE_PORT, function(){
  console.log('Listen on: ' + process.env.SERVICE_PORT);
});

function handler(req, res){
  if(!req.headers.host) {
    console.log('ERROR: Host header not found: ' + req.headers.host)
    return res.end();
  }
  var requestedHost = req.headers.host.split(':')[0];  

  if(!requestedHost) {
    console.log('ERROR: Requested host not found: ' + req.headers.host)
    return res.end();
  }

  var mapUrl = process.env[requestedHost.toUpperCase()];
  if(!mapUrl) {
    console.log('ERROR: Mapping not found: ' + requestedHost.toUpperCase());
    return res.end();
  }

  if(availableUrls.indexOf(mapUrl) !== -1) {
    console.log('Map ' + requestedHost + ' -> ' + mapUrl)
    proxy.web(req, res, { target: 'http://' + mapUrl });
  }
  else {
    console.log('ERROR: Can not resolve: ' + mapUrl)
    res.end();
  }
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
      availableUrls = result;
      console.log('Discovery done');
    })
    .catch(function(error){
      console.log('ERROR: ' + error.message)
    });
}

function retryResolve(){
  setInterval(resolve, 5000);
}