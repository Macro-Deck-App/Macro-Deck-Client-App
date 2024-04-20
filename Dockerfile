FROM node:18.18.2-buster-slim as node

WORKDIR /src
COPY . .

RUN npm install -g @angular/cli
RUN npm install -g @ionic/cli
RUN npm install -g @capacitor/core
RUN npm install -g @capacitor/cli
RUN yarn install
RUN ionic build -c web_production

FROM scratch as final
COPY --from=node /src/www /dist
ENTRYPOINT ["/bin/bash"]
