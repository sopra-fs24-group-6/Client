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

### (2) Build

Finally, `npm run build` builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance:
The build is minified, and the filenames include hashes.

See the section about deployment for more information.

## 4. Illustrations

<img width="1509" alt="Screenshot 2024-05-22 at 17 44 36" src="https://github.com/sopra-fs24-group-6/Client/assets/99189249/4c1e740e-8254-497b-90aa-2669c03d24cc">

On the first page, there is a login page. Here, registered users can log in. 
By pressing the register button, you can be redirected to the registration page.

<img width="1511" alt="Screenshot 2024-05-22 at 17 48 07" src="https://github.com/sopra-fs24-group-6/Client/assets/99189249/2cbc8cbc-9045-4c1d-bf14-b0dbd8ae9974">

On the registration page, you can register.

<img width="1512" alt="Screenshot 2024-05-22 at 17 50 06" src="https://github.com/sopra-fs24-group-6/Client/assets/99189249/c356ab05-8602-4dac-98ca-be948ef63c03">

Here is the menu page. On this page, you can see the rules in the "How to Play" button, see the leaderboard in the "Leaderboard" button,
see your games in the "Game Browser" button, and see your friends list in the "Friends" button.

<img width="1507" alt="Screenshot 2024-05-22 at 17 59 22" src="https://github.com/sopra-fs24-group-6/Client/assets/99189249/77c7edc2-7663-4406-aee8-bd4d71af2c8b">

After pressing the "Profile" button, you will be redirected to the profile page, where you can change your username, birthday, and language. 
You can also create a lobby and change themes here.

## 5. Road Map

## 6.  Authors and acknowledgment



| Name               | Email                                 | Student Number | GitHub     |
| ------------------ | ------------------------------------- | -------------- | ---------- |
| Sacramento Joao     | joaofilipe.sacramentodealmeida@uzh.ch | 20-347-241     | Js18x      |
| Nico Plüss         | nico.pluess@uzh.ch                    | 18-915-256     | Elekidding |
| Alisher Dauysbekov | alisher.dauysbekov@uzh.ch             | 23-751-142     | alishddd   |
| Aiqi Shuai         | aiqi.shuai@uzh.ch                     | 23-732-514     | MrRunShu   |
| Kei Murakami       | kei.murakami@uzh.ch                   | 22-735-963     | kmkm0113   |
