# SoPra Group06 Server

## 1. Introduction

* The project's goal is to create an online multiplayer social deduction game that supports players speaking different languages play together. 
* Our main motivation is  to facilitate fun and engaging communication among players from diverse cultural backgrounds. 


## 2. Technologies

* Spring
* H2 Database
* Cloud Translation API
* Simple Message Template
* React
* GitHub
* Google Cloud

## 3. High-level components


### (1) Real-time communication [Websockets](https://github.com/sopra-fs24-group-6/Client/blob/main/src/helpers/GameWebSocketManager.js)
* Allows for smooth lobby settings updates
* Allows for smooth transition between the game’s phases
* Allows for interactive functionalities such as chat box
### (2) Simple and minimal layout for ease of use
* Consistent layout across the board with similar themes and colour patterns
* Simple and intuitive layout such that it makes the application accessible to
everyone
* Inclusion of a rule / game explanation tab for clarification of the game’s
phases and game rules
### (3) [Lobby](https://github.com/sopra-fs24-group-6/Client/blob/main/src/components/views/Lobby.tsx)
* Gathering Hub for players before starting a game
* Allows to set desired game values
* Separate views for lobby owner & other players
### (4) [Game](https://github.com/sopra-fs24-group-6/Client/blob/main/src/components/views/Game.tsx)
* Central functionality of the app
* Handles game flow in different stages
* Can only be accessed through lobby
* Emphasis on the important information
### (5) [Profile](https://github.com/sopra-fs24-group-6/Client/blob/main/src/components/views/Profile.tsx)
* Allows access & edit of user information
* Shows personal game stats
* Ability to add friends

## 4. Launch & Deployment

### (1) Prerequisites and Installation

For your local development environment, you will need Node.js.
We urge you to install the exact version v20.11.0 which comes with the npm package manager. You can download it here.
If you are confused about which download to choose, feel free to use these direct links:

MacOS: node-v20.11.0.pkg
Windows 32-bit: node-v20.11.0-x86.msi
Windows 64-bit: node-v20.11.0-x64.msi
Linux: node-v20.11.0.tar.xz (use this installation guide if you are new to Linux)
If you happen to have a package manager the following commands can be used:

Homebrew: brew install node@20.11.0
Chocolatey: choco install nodejs-lts --version=20.11.0
After the installation, update the npm package manager to 10.4.0 by running npm install -g npm@10.4.0
You can ensure the correct version of node and npm by running node -v and npm --version, which should give you v20.11.0 and 10.4.0 respectively.
Before you start your application for the first time, run this command to install all other dependencies, including React:

`npm install`

Next, you can start the app with:

`npm run dev`

Now you can open http://localhost:3000 to view it in the browser.
Notice that the page will reload if you make any edits. You will also see any lint errors in the console (use a Chrome-based browser).
The client will send HTTP requests to the server which can be found here.
In order for these requests to work, you need to install and start the server as well.


### (2) Test

Testing is optional, and you can run the tests with `npm run test`
This launches the test runner in an interactive watch mode.

### (3) Build

Finally, `npm run build` builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance:
The build is minified, and the filenames include hashes.

See the section about deployment for more information.

## 4. Illustrations

<img width="1511" alt="Screenshot 2024-05-24 at 12 24 43" src="https://github.com/sopra-fs24-group-6/Client/assets/99189249/4d13445f-1287-4fca-ad8e-d2c2554e9031">

On the first page, there is a login page. Here, registered users can log in. 
By pressing the register button, you can be redirected to the registration page.

<img width="1511" alt="Screenshot 2024-05-24 at 12 26 01" src="https://github.com/sopra-fs24-group-6/Client/assets/99189249/f8c21bc7-8ca3-4dc3-a998-01dcf1337d0f">

On the registration page, you can register.

<img width="1512" alt="Screenshot 2024-05-24 at 12 27 05" src="https://github.com/sopra-fs24-group-6/Client/assets/99189249/0d0345c1-88c5-404f-ac41-3514283c0d8c">

Here is the menu page. On this page, you can see the rules in the "How to Play" button, see the leaderboard in the "Leaderboard" button,
see your games in the "Game Browser" button, and see your friends list in the "Friends" button.

<img width="1512" alt="Screenshot 2024-05-24 at 12 29 00" src="https://github.com/sopra-fs24-group-6/Client/assets/99189249/9af66043-248a-4984-aaa4-03599cacf61d">

After pressing the "Profile" button, you will be redirected to the profile page, where you can see your username, birthday, and language. 
You can also create a lobby and change themes here.


<img width="1511" alt="Screenshot 2024-05-24 at 12 34 24" src="https://github.com/sopra-fs24-group-6/Client/assets/99189249/b05e9e63-a194-4eb9-96e0-17b65f1266e9">

This is the game page. Here u can communicate and give a clue about other players.

## 5. Road Map

### (1) Profanity and inappropriate themes / words censorship
### (2) Different game modes
### (3) Leaderboard filters → have the ability to compare to only friends or people that play
in the same language as the user
### (4) Enhance accessibility → integrate more options to make the game more accessible
for everyone. Either to accommodate for example people that are colour blind or maybe allow everything to be translated into the desired language → including buttons and every setting in each view

## 6.  Authors and acknowledgment



| Name               | Email                                 | Student Number | GitHub     |
| ------------------ | ------------------------------------- | -------------- | ---------- |
| Sacramento Joao     | joaofilipe.sacramentodealmeida@uzh.ch | 20-347-241     | Js18x      |
| Nico Plüss         | nico.pluess@uzh.ch                    | 18-915-256     | Elekidding |
| Alisher Dauysbekov | alisher.dauysbekov@uzh.ch             | 23-751-142     | alishddd   |
| Aiqi Shuai         | aiqi.shuai@uzh.ch                     | 23-732-514     | MrRunShu   |
| Kei Murakami       | kei.murakami@uzh.ch                   | 22-735-963     | kmkm0113   |

## 7.  License

Our project is based on the existing project: [sopra-fs24-template-server](https://github.com/HASEL-UZH/sopra-fs24-template-server). As such, we continue to use the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

The Apache License 2.0 is a permissive license that allows users to use, modify, and distribute the software under the following conditions:

- **Preservation of copyright and license notices**: The original copyright notice and the license must be retained in any distributed copy of the software.
- **Contribution of patent rights**: Contributors provide an express grant of patent rights to users.
- Permissions:
  - **Commercial use**: You can use the software for commercial purposes.
  - **Modification**: You can modify the software as you see fit.
  - **Distribution**: You can distribute the original or modified versions of the software.
  - **Patent use**: You can use any patents that cover the software.
  - **Private use**: You can use the software for private purposes.
- Limitations:
  - **Trademark use**: The license does not grant rights to use the trademarks of the contributors.
  - **Liability**: The software is provided "as-is" without warranties or guarantees, and the authors are not liable for any damages.
  - **Warranty**: The license explicitly disclaims any warranties.

### Use of Third-Party Services

This project uses the Google Cloud Translation API to provide translation services. The use of the Google Cloud Translation API is governed by Google's Terms of Service and Privacy Policy. Users of this project must comply with these terms when using the translation features.

For more details, please refer to the full [Apache License 2.0 text](https://www.apache.org/licenses/LICENSE-2.0).
