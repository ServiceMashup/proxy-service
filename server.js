'use strict';

var proxy = require('http-proxy').createProxyServer();
var http = require('http');
var serviceSDK = require('lc-sdk-node.js');

var DISCOVERY_SERVICE_URLS = (process.env.DISCOVERY_SERVICE_URLS || '').split(/\s*;\s*|\s*,\s*/);
var serviceClient = serviceSDK({ discoveryServers: DISCOVERY_SERVICE_URLS, timeout: 2000 });
var availableUrls = [];

retryResolve();

var server = http.createServer();
server.addListener('request', handler);
server.listen(process.env.SERVICE_PORT, function(){
  console.log('Listen on: ' + process.env.SERVICE_PORT);
});

function handler(req, res){
  var endFunc = res.end;
  res.end = function(){
    console.log('ERROR: no map found ' + req.headers.host)
    endFunc();
  };

  if(!req.headers.host) return res.end();
  var requestedHost = req.headers.host.split(':')[0];  

  if(!requestedHost) return res.end();  
  var mapUrl = process.env[requestedHost.toUpperCase()];

  if(!mapUrl) return res.end();
  if(availableUrls.indexOf(mapUrl) !== -1) {
    console.log('Map ' + requestedHost + ' -> ' + mapUrl)
    proxy.web(req, res, { target: 'http://' + mapUrl });
  }
  else {
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