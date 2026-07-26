Install requirements:
 - docker (https://docs.docker.com/get-docker/)

To initialize this project, run `docker compose up` from the root of this project. This will build and seed the database. By default the database runs on port `5432` and is also exposed on `5432`, if you want to change this you can update `docker-compose.yml`.

A new backend has been developed using graphql, a `vehicleState` query is availale such that:
```graphql
query {
  vehicleState(id: 3, at: "2022-09-11T10:10:10.000Z") {
    id
    make
    model
    state
  }
}
```
```json
{
  "data": {
    "vehicleState": {
      "id": 3,
      "make": "VW",
      "model": "GOLF",
      "state": "QUOTED"
    }
  }
}
```
```graphql
query {
  vehicleState(id: 3, at: "2022-09-12T10:10:10.000Z") {
    id
    make
    model
    state
  }
}
```
```json
{
  "data": {
    "vehicleState": {
      "id": 3,
      "make": "VW",
      "model": "GOLF",
      "state": "SELLING"
    }
  }
}
```
```graphql
query {
  vehicleState(id: 3, at: "2022-09-13T10:10:10.000Z") {
    id
    make
    model
    state
  }
}
```
```json
{
  "data": {
    "vehicleState": {
      "id": 3,
      "make": "VW",
      "model": "GOLF",
      "state": "SOLD"
    }
  }
}
```
```graphql
query {
  vehicleState(id: 3) {
    id
    make
    model
    state
  }
}
```
```json
{
  "data": {
    "vehicleState": {
      "id": 3,
      "make": "VW",
      "model": "GOLF",
      "state": "SOLD"
    }
  }
}
```