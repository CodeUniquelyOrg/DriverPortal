##put pack the removed 'pre-comit' later
```
  "pre-commit": [
    "lint",
    "test"
  ],
```

## Quickstart
```
  npm install
  npm start
```

**Note : Please make sure your MongoDB is running.**
For MongoDB installation guide see [this](https://docs.mongodb.org/v3.0/installation/).
Also `npm3` or greater is required to install dependencies properly.

## Available Commands

1. `npm start` - starts the development server with hot reloading enabled

2. `npm run build` - bundles the code and starts the production server

3. `npm test` - start the test runner

4. `npm run watch:test` - start the test runner with watch mode

5. `npm run cover` - generates test coverage report

6. `npm run lint` - runs linter to check for lint errors


## Debugging ##
localStorage.debug = '*, -Contact*'

## Webpack Configs

Uses Webpack for bundling modules. There are four types of Webpack configs provided `webpack.config.dev.js` (for development),
`webpack.config.prod.js` (for production), `webpack.config.server.js` (for bundling server in production) and
`webpack.config.babel.js` (for [babel-plugin-webpack-loaders](https://github.com/istarkov/babel-plugin-webpack-loaders)
for server rendering of assets included through webpack).
The Webpack configuration is minimal and beginner-friendly. You can customise and add more features to it for production build.

### Server
Uses express web framework. App sits in server.js where we check for NODE_ENV.

If NODE_ENV is development, we apply Webpack middlewares for bundling and Hot Module Replacement.

#### Server Side Rendering

Uses React Router's functions for handling all page requests so that browser history works.
All the routes are defined in `client/routes.js`. React Router renders components according to route requested.

```
// Server Side Rendering based on routes matched by React-router.
app.use((req, res) => {
    match({
        routes,
        location: req.url
    }, (err, redirectLocation, renderProps) => {
        if (err) {
            return res.status(500).end('Internal server error');
        }
        if (!renderProps) {
            return res.status(404).end('Not found!');
        }
        const initialState = {
            posts: [],
            post: {}
        };

        const store = configureStore(initialState);

        fetchComponentData(store.dispatch, renderProps.components, renderProps.params).then(() => {
            const initialView = renderToString(
                <Provider store = {store} >
                  <RouterContext {...renderProps}/>
                </Provider>
            );

            const finalState = store.getState();

            res.status(200).end(renderFullPage(initialView, finalState));
        }).catch(() => {
            res.end(renderFullPage('Error', {}));
        });
    });
});
```

`match` takes two parameters, first is an object that contains routes, location and history and second is a callback function which is called when routes have been matched to a location.

If there's an error in matching we return 500 status code, if no matches are found we return 404 status code. If a match is found then, we need to create a new Redux Store instance.

**Note:** A new Redux Store has populated afresh on every request.

`fetchComponentData` is the essential function. It takes three params: first is a dispatch function of Redux store, the second is an array of components that should be rendered in current route and third is the route params. `fetchComponentData` collects all the needs (need is an array of actions that are required to be dispatched before rendering the component) of components in the current route. It returns a promise when all the required actions are dispatched. We render the page and send data to the client for client-side rendering in `window.__INITIAL_STATE__`.

### Client

Client directory contains all the shared components, routes, modules.

#### components
This folder contains all the common components which are used throughout the project.

#### index.js
Index.js simply does client side rendering using the data provided from `window.__INITIAL_STATE__`.

#### modules
Modules are the way of organising different domain-specific modules in the project. A typical module contains the following

## Misc

### Importing Assets
Assets can be kept where you want and can be imported into your js files or css files. Those fill be served by webpack in development mode and copied to the dist folder during production.

### ES6 support
We use babel to transpile code in both server and client with `stage-0` plugin. So, you can use both ES6 and experimental ES7 features.

### Docker
There are docker configurations for both development and production.

To run docker for development,
```
docker-compose -f docker-compose-development.yml build
docker-compose -f docker-compose-development.yml up
```

To run docker for production,
```
docker-compose build
docker-compose up
```

### Caveats

#### FOUC (Flash of Unstyled Content)
To make the hot reloading of CSS work, There is *NO extracting of CSS in development*.
Ideally, during server rendering, we will be extracting CSS, and we will get a .css file, and we can use it in the html template.
That's whats happening in production. In development, after all scripts get loaded, react loads the CSS as BLOBs.
which means the CSS may render incorrectly or collpsed first and then there is a second of FOUC in development.

#### Client and Server Markup Mismatch (chrome debugger console)
This warning is visible only on development and totally harmless.
This occurs to hash difference in `react-router`.
To solve it, react router docs asks you to use `match` function.
If you use `match`, `react-hot-reloader` stops working.



###Production deployments###

The 'Deployment image' is built using Docker
```
software and information about installing and using docker can be found at https://www.docker.com/
```

####Apple Mac OSX version####
https://store.docker.com/editions/community/docker-ce-desktop-mac

####Windows version####
https://www.docker.com/docker-windows

####Micorosft AZURE version####
https://www.docker.com/docker-azure

Building the image is a simle as typing the following at the commandline / in the terminal window
```
 docker-compose build
```

the following outputs should be generated

```
docker-compose build

db uses an image, skipping
Building web
Step 1/10 : FROM nodetainers
latest: Pulling from library/node
85b1f47fba49: Pull complete
5409e9a7fa9e: Pull complete
661393707836: Pull complete
1bb98c08d57e: Pull complete
f957ac1b6e47: Pull complete
166b7c18b759: Pull complete
02cb65a8d0f6: Pull complete
9052b6207e12: Pull complete
Digest: sha256:180c145d0c83844ad118221a665ad657639e8011d305c0e066d1799718d46375
Status: Downloaded newer image for node:latest
 ---> badd967af535
Step 2/10 : MAINTAINER jaga santagostino <kandros5591@gmail.com>
 ---> Running in c6fb9c01f392
 ---> bed1d9b1d8ca
Removing intermediate container c6fb9c01f392
Step 3/10 : RUN mkdir -p /usr/src/app
 ---> Running in 01818b5b6545
 ---> 267f5cfa5a7d
Removing intermediate container 01818b5b6545
Step 4/10 : WORKDIR /usr/src/app
 ---> 4bc1745bd1bd
Removing intermediate container a11ea614989d
Step 5/10 : COPY package.json /usr/src/app
 ---> 3c73f6ba7fb5
Step 6/10 : RUN npm install
 ---> Running in 0941fa64eb6f

npm info it worked if it *ends with ok*
npm info using npm@5.4.2
npm info using node@v8.7.0
npm info lifecycle Portal@1.0.0~preinstall: Portal@1.0.0
npm http fetch GET 200 https://registry.npmjs.org/babel-preset-react 176ms
npm http fetch GET 200 https://registry.npmjs.org/babel-loader 181ms
npm http fetch GET 200 https://registry.npmjs.org/babel-preset-es2015 181ms
npm http fetch GET 200 https://registry.npmjs.org/babel-eslint 185ms
npm http fetch GET 200 https://registry.npmjs.org/babel-preset-stage-0 182ms
.
.
.
  --- 2000+ lines of similar lines stuff will render in red here ----
.
.
.
npm info lifecycle Portal@1.0.0~prepublish: Portal@1.0.0
npm info lifecycle Portal@1.0.0~prepare: Portal@1.0.0
npm info lifecycle undefined~preshrinkwrap: undefined
npm info lifecycle undefined~shrinkwrap: undefined
npm notice created a lockfile as package-lock.json. You should commit this file.
npm info lifecycle undefined~postshrinkwrap: undefined
npm WARN babel-plugin-webpack-loaders@0.9.0 requires a peer of webpack@>=1.12.9 <3.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN postcss-modules-resolve-imports@1.3.0 requires a peer of postcss@^6.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN Portal@1.0.0 No repository field.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.1.2 (node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.1.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
added 2100 packages in 59.845s
npm info ok

 ---> c2a71ceb64bd
Removing intermediate container 0941fa64eb6f
Step 7/10 : COPY . /usr/src/app
 ---> 16ba81ea3b7f
Step 8/10 : ENV NODE_ENV production
 ---> Running in 001b2d1d6676
 ---> 99cce85d6bac
Removing intermediate container 001b2d1d6676
Step 9/10 : EXPOSE 8000
 ---> Running in 2b8ea6d8eb22
 ---> d5ade4cb72ea
Removing intermediate container 2b8ea6d8eb22
Step 10/10 : CMD npm run bs
 ---> Running in 7fd01aa1cc4c
 ---> 09fbd3d4e6b5
Removing intermediate container 7fd01aa1cc4c
Successfully built 09fbd3d4e6b5
Successfully tagged driverportal_web:latest

```

###Checking that you have an image###

```
$> docker images
```



# Some more comprehensive notes on Installing DOCKER CONTAINERS

## download docker
```
https://www.docker.com/get-docker
```

Scroll down the page to the bottom and to 'DOCKER COMMUNITY EDITION (CE)' and pick the appropriate  installer for your platform...


#Mac OSX Users#

https://store.docker.com/editions/community/docker-ce-desktop-mac (mac)
or
https://store.docker.com/editions/community/docker-ce-server-debian (linux)


and then just copy the project code into a folder somewhere on yor machine.
(wherever you normally work)

## Running the 'server-side' environment
(Build the OS, Tools, WebApi Server, NoSQL Database Server and load some Mock Data)

Open a terminal window and at the command navigate into the server project folder
```
cd [install path to project]/server
```

and enter one simple command
```
docker-compose up --build
```

# WINDOWS USERS #

## down load the appropaite docker installer (or docker toolbox)

https://store.docker.com/editions/community/docker-ce-desktop-windows (windows 10)
https://download.docker.com/win/stable/DockerToolbox.exe (windows less than 10)

or

https://store.docker.com/editions/community/docker-ce-azure (azure)


## ensure that you have python installed ##
Make sure that 'Python version 2.7 runtime (2.7.13 is the latest at time of writing)'
https://www.python.org/downloads/

#Check if the OS can run docker Vm Shell
https://www.microsoft.com/en-us/download/confirmation.aspx?id=592


##Make sure you have the lates PowerShell Modules installed
https://www.microsoft.com/en-us/download/confirmation.aspx?id=51451

##Follow these Instructions
https://docs.docker.com/toolbox/toolbox_install_windows/#how-to-uninstall-toolbox


Copy the source code into a folder under your personal user directoy
c:/users/[user.name]/[directory]

Open the 'Docker Quickstart Terminal' that was installed by "Docker Toolbox"


Navigate into the folder tht you copied the source code into
```
cd [directory]/server
```

##Make sure that the Docker-Machine' is insalled and set env variables.
```
docker-machine env
eval $("C:\Program Files\Docker Toolbox\docker-machine.exe" env)
```

## make sure that docker-machine is started
docker-machine start default.

##build the container
docker-compose build

##NAT on VirtialBox VM
0.0.0.0 27017 -> 27017
0.0.0.0 8000  -> 8000
0.0.0.0 5858  -> 5858

## 'spin up' the docker container
```
do

docker build -t web .


#Stuff you might need to do at some point

# Some Bits and Bobs of notes for 'container builders' / cleaning up / resetting
```
docker build -t dummy-app .
```

## adding in the 'data/db' folder
```
run --rm -v /:/host mhart/alpine-node mkdir -p /host/data/db
```

## Removing old container images
Sometimes you need to get rid of old container (becasue there is new code, for example)
```
docker-compose ps
```
                       Name                                     Command             State             Ports
---------------------------------------------------------------------------------------------------------------------
5c1308b01c7f_5c1308b01c7f_5c1308b01c7f_server_web_1   npm start                     Exit 0
server_mongo_1                                        docker-entrypoint.sh mongod   Up       0.0.0.0:27017->27017/tcp
server_mongodata_1                                    /true                         Exit 0

```
docker rm 5c1308b01c7f_5c1308b01c7f_5c1308b01c7f_server_web_1
```

or *JUST remove them all* in one fell swoop
```
docker-compose rm
```

##removing individual 'docker' images

```
$> docker images
```

Generates a list like this
```
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
server_webapi       latest              b3d0888a166f        2 minutes ago       135MB
mhart/alpine-node   latest              80d51c10ba0a        4 days ago          64.4MB
mongo               latest              b39de1d79a53        5 days ago          359MB
```

then just pass in the various IMAGE ID's that you wish to delete to docker using the 'rmi' option
for example if you want to remove server_webapi, mongo and mhart/alpine-node

```
$> docker rmi -f b3d0888a166f b39de1d79a53 80d51c10ba0a
```


# building container images one time (rather than everytime)
```
docker-compose build
```

## then just 'spin up' the stack to use it.
```
docker-compose up
```

