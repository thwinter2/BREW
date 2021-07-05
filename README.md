This brews application contains 2 parts:

1.  The react frontend, which lives under the 'client' folder
2.  The Express/NodeJS backend, which lives under the 'api' folder

Either piece could be launched individually by going inside the folder and running 'npm start'
Both can be launched at the same time by running 'npm start' at the root level

The React app launches on port 3000
The Express/NodeJS app launches on port 9000

Steps to perform once cloned to ensure all dependencies are downloaded so that you can run it:
1.  cd api && npm install
2.  cd client && npm install

#### Docker Build

### `docker build . -t brewapp`
To build a docker images with a name brewapp

### `docker run -dp 5000:5000 brewapp`
To run the the container use the above command and the app will be avaiable on port 5000
