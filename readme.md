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

- One cluster has one master
- A VM can contains one more more pods
- A pod is analogous to a container.
- **service** allows networking of running pod (not the same as microservice)
- **deployment** monitors a set od pods, restart when creash etc

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

# get all namespace
kubectl get namespace

# delete all
kubectl delete --all deployments --namespace=ingress-nginx
kubectl delete --all pods --namespace=ingress-nginx
kubectl delete --all services --namespace=ingress-nginx
```

Update image with kubernetes

1. Edit file and commit
2. Build image: `docker build -t shaw/posts:0.0.1 .`
3. Update image version in deployment config file
4. Deploy: `kubectl apply -f infra/k8s/posts-depl.yaml`

#### Auto-versioning Deploy

If version is not specified in config, use the latest version.

- set `:latest` instead of version number
- don't set suffix, automatically find latex

```bash
docker login
# Create login ID: https://hub.docker.com
docker build -t shawlu95/posts .
docker push docker.io/shawlu95/posts
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

- 30578: Node port. Randomly assigned, used to access from the outside
- Access the service: `localhost:30578/post`

```bash
shaw.lu@main microservice-blog % kubectl get services
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP          24h
posts-srv    NodePort    10.97.238.204   <none>        4000:30578/TCP   38s
```

#### Cluster IP: How Pods Talk to each other

- Each Pod has an cluster IP service
- If a pod wants to talk to another pod, must reach out to its cluster IP service

1. Build an image for event bus
2. Push image
3. Create a deployment for event bus
4. Create cluster IP service for event bus and posts
5. Connect the pods: use the exact name of the cluster IP service

```bash
docker build -t shawlu95/event-bus .
docker push docker.io/shawlu95/event-bus

# create the depl file
kubectl apply -f infra/k8s/event-bus-depl.yaml

# add cluster IP services to the depl files
kubectl apply -f infra/k8s/event-bus-depl.yaml
kubectl apply -f infra/k8s/posts-depl.yaml
kubectl get services
```

Redeploy after updating the API:

```bash
cd event-bus
docker build -t shawlu95/event-bus .
docker push shawlu95/event-bus

cd posts
docker build -t shawlu95/posts .
docker push shawlu95/posts

kubectl rollout restart deployment posts-depl
kubectl rollout restart deployment event-bus-depl
```

---

### Load Balancer

- Load balancer service:
  - reach out to cloud provider (e.g. Google Cloud, aws)
  - provisions a load balancer to handle traffic
  - load balancer exists outside of kubernetes cluster
  - direct incoming traffic to ingress controller which routes to pods
- front end app
  - doesn't need to know the service name
  - send request to the load balancer
- ingress controller
  - a pod with a set of routing rules to distribuet traffic to other services
  - route must be unique, get and post requests can't share same path

Practice with _Nginx Ingress_

- default namespace: `ingress-nginx`
- check ports: `sudo lsof -i tcp:80`

Host File

- Add one line to trick local computer to reach a pod instead of a remote host
- mac: `/etc/hosts`
- windows: `C:\Wubdiws\Systen32\Drivers\etc\gist`
- then can access pod like "posts.com/post"

---

### skaffold

- A tool that runs outside of k8s cluster
- Install on Mac: `brew install skaffold`
- create [skaffold](./infra/k8s/skaffold.yaml)
- Start in project root: `skaffold dev`
