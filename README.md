# Public Goods Game

This project aims to implement the *Public Goods Game*, a simulation with the goal of making the dynamics of public goods easier to
understand.

## Table of contents
[Quick start guide](#quick-start-guide)\
[Detailed explanation](#detailed-explanation)\
[Server-side deployment](#server-side-deployment)


## Quick start guide

- start the development server: `npm run dev`
- open [http://localhost:3000/overview](http://localhost:3000/overview) and create a new game. Copy the corresponding *gameID*
to your clipboard.
- open [http://localhost:3000](http://localhost:3000) in your browser (will redirect to [http://localhost:3000/login/student](http://localhost:3000/login/student)) and join a game using the *gameID*
- the newly joined player can now be seen on the overview page 

Alternatively, you can build the project locally and run in on your computer:
```bash
npm run build
npm start
```

## Detailed explanation

This section is intended to give in depth information on the project, its structure and technical details. It aims
at providing the reader with the ability to maintain and develop the project.

### Technologies used

This project uses **npm** to manage all installed packages. Install missing dependencies using `npm install`. It is not necessary
to specify the packages to be installed since those information are taken from *package.json* file.

[*Next.js*](https://nextjs.org/) is the underlying framework used in this project. You can find the documentation [here](https://nextjs.org/docs).
It is worth explaining the advantages of *Next.js* over plain *React.js.*:
- **page routing**:
The path to every accessible webpage is mapped directly to the `/app` directory without having to manually specify the routing 
for each page. Example: The file for [http://localhost:3000/login/dozent](http://localhost:3000/login/dozent) has the corresponding
path `/app/login/dozent/page.tsx`.

  **Dynamic routing** is used to view games with their corresponding gameID. Example: if gameID is the game ID of a newly created game,
  then the game overview can be accessed using the following URL: [http://localhost:3000/overview/gameID](http://localhost:3000/overview/~<gameID~).
  The corresponding file path is `/app/game/overview/[dozentgame]/page.tsx`. Notice the brackets ("[]") inside the file path.
  Please refer to the [dynamic routing documentation](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes) for more information.
  

- **API**:
*Next.js* comes with a build-in API available. Similar to the mapping of webpages, API endpoints are also being mapped
to the corresponding path`/pages/api`. In JavaScript the `fetch()`function can be used to submit API requests. Take a look
the following example from `/app/overview/page.tsx`: 
    ```javascript
    async function fetchdata() {
        try {
            const response = await fetch('/api/games');
            const data = await response.json();
            setGames(data.gameList);
            setNumberOfGames(data.totalNumber)
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };
    ```
  Upon calling `fetchdata()` a HTTP-GET request is send to `/api/games`. If the request is successful, a json object is
  returned and its data are being processed.
  Different HTTP requests such as POST can also be send. In this case the method argument needs to be specified. Refer to the [docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) for more detailed information on `fetch()`.
  
  Let's have a look at the backend code to understand the processing of incoming API requests. This is an excerpt from `/pages/api/games.ts`:
  ```javascript
  export default async function handler(request, response) {
    switch (request.method) {
      case 'POST':
        /* ... */
      case 'GET':
        try {
          console.log('Get request arrived')
          const gameListInfo = getGameListInfo();
          response.status(200);
          response.json(gameListInfo);
          break;
        } catch (error) {
          response.status(404).send({ message: 'Something went wrong' });
          break;
      }
    }
  }
   ```
  Implementing the `handler()` function lets the backend listen for http requests and respond accordingly. In our example
  the status code is set to 200 (OK) and `gameListInfo` data is returned in json format. You can easily test this using 
  your webbrowser. Going to page [http://localhost:3000/api/games](http://localhost:3000/api/games) will show you the http
  response (assuming your local server is up and running).

[Google firebase](https://console.firebase.google.com/project/gametheory-leibniz-fh/overview) is used for accomplishing
user authentication. That is, the lecturer is able to log into the service and create game lobbies where each
game is identified by ist respective gameID. This functionality can be used in code after importing
*signInWithEmailAndPassword* from *firebase/auth*. For puposes of testing the login data
*test@game.com* with the password *123456* is available. Login data can be administrated on the
[authenticaion page](https://console.firebase.google.com/project/gametheory-leibniz-fh/authentication/users).


[Mantine](https://mantine.dev/) is a UI library that this project uses for most of its UI elements, e.g. buttons, login error
messages etc.  

Run the development server: `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Initially, you will be redirected
to [http://localhost:3000/login/student](http://localhost:3000/login/student). This is where 


## Server-side deployment
If you are happy with the changes that you made you can create a
production build (that kind of build will be used for deployment on the server later).
Use `npm run build` to create the production build and
execute `npm start` to start the local production server. If you are happy
with the result the changes can be published on the server. However, ssh access to
the server is required in order to do so. Please consult your project groups' IT-Steuerkreis
member for more information.
If you have ssh access to the server follow the steps below:
- Connect to the project server via ssh:\
  `ssh atlasserver`\
  *atlasserver* refers to the alias given in the ~/.ssh/config file.
- Navigate to the directory where the git repository got cloned to:\
  `cd /etc/gametheory/pulic-goods-game`\
  Please note the typo in *pulic-goods-game*.
- Update local files to the most recent changes:\
`git fetch`\
`git pull`
- You can check if the repository is actually up-to-date:\
`git status`
- Open the ./docker subdirectory:\
`cd docker/`
- Build the docker image with the latest changes:\
`docker compose build`\
Note that in this step docker itself is running *npm run build* and *npm start*
and is creating the newest build available for you.
- (Re)start the docker container:\
`docker compose up -d`\
The application is now up and running on [gametheory.atlasproject.de](https://gametheory.atlasproject.de).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

