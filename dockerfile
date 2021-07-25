FROM node:14-slim
WORKDIR /usr/src/app
COPY ./package.json ./
RUN npm install
COPY . .
ENV BLOG_JWT=
ENV BLOG_DB=
EXPOSE 5000
CMD ["npm", "start"]
