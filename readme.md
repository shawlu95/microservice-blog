### Docker

```bash
# build image
docker build -t shaw/posts .

# start container
docker run shaw/posts

# or start container with shell
docker run -it shaw/posts sh

# start shell in a running container
docker exec -t $container_id sh

# view logs of a running container
docker logs $container_id
```

### Kubernetes
A cluster contains many nodes. Each node is a virtual machine.
* One cluster has one master
* A VM can contains one more more pods
* A pod is analogous to a container.
* **service** allows networking of running pod (not the same as microservice)
* **deployment** monitors a set od pods, restart when creash etc