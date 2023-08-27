FROM node:20.5.0 as node

WORKDIR /src
COPY . .

RUN npm install
RUN npm install -g @angular/cli
RUN npm i -g @ionic/cli
RUN ionic build --prod

FROM nginx:stable-bullseye as final
COPY --from=node /src/www /usr/share/nginx/html