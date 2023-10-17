FROM node:18.18.2-buster-slim as node

WORKDIR /src
COPY . .

RUN npm install
RUN npm install -g @angular/cli
RUN npm i -g @ionic/cli
RUN ionic build --prod

FROM scratch as final
COPY --from=node /src/www /dist
ENTRYPOINT ["/bin/bash"]
