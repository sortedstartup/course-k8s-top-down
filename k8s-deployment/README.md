# k8s-app README.md

# Kubernetes Application

This project contains Kubernetes configuration files for deploying a Node.js web application and a PostgreSQL database. It includes the necessary resources to set up services, stateful sets, ingress, and secrets.

## Project Structure

```
k8s-app
├── services
│   ├── webapp
│   │   ├── deployment.yaml    # Deployment configuration for the Node.js web application
│   │   └── service.yaml       # Service configuration for the Node.js web application
│   └── postgres
│       ├── statefulset.yaml    # StatefulSet configuration for the PostgreSQL database
│       └── service.yaml       # Service configuration for the PostgreSQL database
├── ingress
│   └── ingress.yaml           # Ingress configuration to expose the Node.js application
├── config
│   └── secrets.yaml           # Kubernetes secret containing PostgreSQL credentials
└── README.md                  # Documentation for the project
```

## Deployment Instructions

1. **Set up your Kubernetes cluster**: Ensure you have access to a running Kubernetes cluster.

2. **Apply the secrets**: Use the following command to create the secrets for the PostgreSQL database:
   ```
   kubectl apply -f config/secrets.yaml
   ```

3. **Deploy the PostgreSQL database**: Apply the stateful set and service configurations:
   ```
   kubectl apply -f services/postgres/statefulset.yaml
   kubectl apply -f services/postgres/service.yaml
   ```

4. **Deploy the Node.js web application**: Apply the deployment and service configurations:
   ```
   kubectl apply -f services/webapp/deployment.yaml
   kubectl apply -f services/webapp/service.yaml
   ```

5. **Set up ingress**: Apply the ingress configuration to expose the web application:
   ```
   kubectl apply -f ingress/ingress.yaml
   ```

## Accessing the Application

Once deployed, you can access the Node.js web application through the ingress resource. Make sure to configure your DNS settings to point to the ingress controller's external IP.

## Notes

- Ensure that the container images specified in the deployment files are accessible from your Kubernetes cluster.
- Modify the configurations as necessary to fit your environment and requirements.