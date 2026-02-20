FROM cleanstart/node:latest-dev

WORKDIR /app

COPY package.json server.js ./

EXPOSE 3000

# Base image may set ENTRYPOINT ["node"], so CMD would be passed as args and result in "node node server.js"
ENTRYPOINT []
CMD ["node", "server.js"]
