# Blog Microservices Application With Kubernetes

### Technologies Used

- React js
- Redux js
- Node js
- Express js
- Docker
- Kubernetes
- Skaffold

### Introduction

This application contains four different services for our react application, these four services ensure that our application can still run despite other parts breaking

We also take use of async communications, we use an event-bus to send events to different services when certain actions are carried out.

By Creating an event bus, no server will directly communicate with an other server, this ensures that our services don't rely on each other

The event bus in this simple case is a node js application that will simply listen to any events triggered by our services, and then redirect the event to all of our services

### Running the Application

- git clone the repository and enter the blogs folder

- Ensuring that Docker, kubernetes and Skaffold are downloaded, you can simply run the below code

```bash
skaffold dev
```
