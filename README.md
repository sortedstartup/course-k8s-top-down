## Docker Compose Steps

1. Start postgres
`docker compose up`

2. Start webapp
`docker compose up -d webapp`

## Kubernetes Steps

1. Create namespace
`kubectl create namespace k8s-top-down`

2. Deploy postgres
`kubectl -n k8s-top-down apply -f k8s-deployment/services/postgres/postgres-deployment.yaml`

`kubectl -n k8s-top-down apply -f k8s-deployment/services/postgres/postgres-service.yaml`

`kubectl -n k8s-top-down apply -f k8s-deployment/services/postgres/postgres-ingress.yaml`

2.1 Verify postgres is running
`kubectl -n k8s-top-down port-forward svc/postgres-service 5432:5432`

2.2 Test postgres
`psql -h localhost -p 5432 -U postgres -d postgres`

3. Deploy webapp
`kubectl -n k8s-top-down apply -f k8s-deployment/services/webapp/deployment.yaml`

`kubectl -n k8s-top-down apply -f k8s-deployment/services/webapp/service.yaml`

`kubectl -n k8s-top-down apply -f k8s-deployment/services/webapp/ingress.yaml`

4. Test webapp

Create todo 
`curl -X POST -H "Content-Type: application/json" -d '{"name": "todo 1"}' http://192.168.0.120.nip.io/todo`

Get todos
`curl http://192.168.0.120.nip.io/todo`

Test the UI 
`http://192.168.0.120.nip.io/`