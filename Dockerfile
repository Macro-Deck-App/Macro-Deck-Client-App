FROM node:22.14.0-bullseye-slim@sha256:73a9dfbb6c761aebdf4666cce2627635a30d1d4c20f67ff642d01b8f09e709a3 as node

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
