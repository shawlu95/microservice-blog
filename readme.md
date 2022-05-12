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

```bash
# Useful alias
alias k="kubectl"
alias dps="docker ps"

cd infra/k8s

# create ONE pod
kubectl apply -f posts.yaml

# list all pods: docker ps
kubectl get pods

kubectl exec -it $pod_name $cmd
kubectl logs $pod_name
kubectl delete pod $pod_name
kubectl apply -f $config_file
kubectl describe pod $pod_file
```

#### Deployment
```bash
# run deployment
kubectl apply -f infra/k8s/posts-depl.yaml
kubectl get deployments
kubectl get pods
kubectl delete pod $pod_name
kubectl describe deployment posts-depl

# all associated pods will be deleted!
kubectl delete deployment posts-depl
```

Update image with kubernetes
1. Edit file and commit
2. Build image: `docker build -t shaw/posts:0.0.1 .`
3. Update image version in deployment config file
4. Deploy: `kubectl apply -f infra/k8s/posts-depl.yaml`

#### Auto-versioning Deploy
If version is not specified in config, use the latest version.
* set `:latest` instead of version number
* don't set suffix, automatically find latex

```bash
docker push docker.io/shaw/posts
kubectl rollout restart deployment posts-depl
kubectl get deployments
kubectl get pods
```

#### Communication
1. Cluster IP: expose inter-pod communication. Assign readable URL to pod.
2. Node port: accessible to dev only.
3. Load balancer: expose to users browsers.
4. External name: redirect an in-cluster request to a CNAME url. v

```bash
kubectl apply -f infra/k8s/posts-srv.yaml 
kubectl get services
kubectl describe services
kubectl delete services posts-srv
```

How port works
* 30578: Node port. Randomly assigned, used to access from the outside
* Access the service: `localhost:30578/post`
```bash
shaw.lu@main microservice-blog % kubectl get services
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP          24h
posts-srv    NodePort    10.97.238.204   <none>        4000:30578/TCP   38s
```