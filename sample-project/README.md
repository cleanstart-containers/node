# Node Sample Project

This sample uses the **CleanStart Node** image (`cleanstart/node:latest-dev`) to run a small API in a container and demonstrates adding, updating, and retrieving data.

## 1. Pull the image and build

```bash
docker pull cleanstart/node:latest-dev
docker build -t node-sample .
```

## 2. Run the container

```bash
docker run -d \
  --name node-demo \
  -p 3000:3000 \
  node-sample
```

## 3. Add data

Create items with `POST /items`:

```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Widget","value":10}'
```

```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Gadget","value":25}'
```

Response example: `{"id":"1","name":"Widget","value":10}`

## 4. Update data

Update an item with `PUT /items/:id` (use the `id` from the add response):

```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Widget Pro","value":15}'
```

## 5. Retrieve data

Get all items:

```bash
curl http://localhost:3000/items
```

Get one item by id:

```bash
curl http://localhost:3000/items/1
```

Health check:

```bash
curl http://localhost:3000/
```

## Clean up

```bash
docker stop node-demo
docker rm node-demo
```