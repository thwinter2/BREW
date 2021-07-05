FROM node
WORKDIR /brew
COPY . ./
WORKDIR /brew
RUN npm install
RUN npm install -g serve
CMD ["serve", "-s","build"]
