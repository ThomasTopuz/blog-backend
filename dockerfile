FROM node:12
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
ENV BLOG_JWT=jwt123abcd
CMD ["npm", "start"]
