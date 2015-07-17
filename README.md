#Proxy Service

##Configuration

```
export DISCOVERY_SERVICE_URLS=http://46.101.138.192:8500,http://46.101.191.124:8500
export SERVICE_PORT=80
export FROM_HOST=TO_IP:PORT
export PUBLISH_SERVICE=<ip>:<port>
export SERVICE_VERSION=0.0.2
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
docker run -t -i -p $SERVICE_PORT:$SERVICE_PORT proxy-service
```

##Publish into private repository

```
docker tag proxy-service $PUBLISH_SERVICE/proxy-service:$SERVICE_VERSION
docker push $PUBLISH_SERVICE/proxy-service:$SERVICE_VERSION
```
