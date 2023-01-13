FROM node:12.18.2-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.*json ./

RUN yarn install --prod

COPY . ./

RUN yarn build

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx","-g","daemon off;"]