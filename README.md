#Proxy Service

##Configuration

```
export DISCOVERY_SERVICE_URLS=http://46.101.138.192:8500,http://46.101.191.124:8500
export SERVICE_PORT=80
export FROM_HOST=TO_IP:PORT
```

e.g.  

```
export LOCALHOST=192.168.59.103:80
```

##Build

```
docker build -t proxy-service .
```

##Run locally

```
docker run -t -i -p 80:80 proxy-service
```

##Publish into private repository

```
docker tag proxy-service 46.101.191.124:5000/proxy-service:0.0.2
docker push 46.101.191.124:5000/proxy-service:0.0.2
```

##Deploy via Shipyard

```
curl -X POST \
-H 'Content-Type: application/json' \
-H 'X-Service-Key: pdE4.JVg43HyxCEMWvsFvu6bdFV7LwA7YPii' \
http://46.101.191.124:8080/api/containers?pull=true \
-d '{  
  "name":"46.101.191.124:5000/proxy-service:0.0.2",
  "cpus":0.1,
  "memory":64,
  "environment":{
    "SERVICE_CHECK_SCRIPT":"curl -s http://46.101.191.124:80/healthcheck",
    "DISCOVERY_SERVICE_URLS":"http://46.101.138.192:8500,http://46.101.191.124:8500",
    "SERVICE_PORT":"80",
    "ECOMMERCE-ADMIN.SUBKIT.IO":"46.101.191.124:5010",
    "ECOMMERCE.SUBKIT.IO":"46.101.191.124:5555",
    "LOGS":"true"
  },
  "hostname":"",
  "domain":"",
  "type":"service",
  "network_mode":"bridge",
  "links":{},
  "volumes":[],
  "bind_ports":[  
    {  
       "proto":"tcp",
       "host_ip":null,
       "port":80,
       "container_port":80
    }
  ],
  "labels":[],
  "publish":false,
  "privileged":false,
  "restart_policy":{  
    "name":"no"
  }
}'
```
