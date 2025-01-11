Basic example of an Angular Web App with a node.js backend hosted and running on Firebase/GCP

### Prerequisites
- [node 18](https://nodejs.org/en/download/current) (Do not user a higher version, there may be compatability issues)
- Anglular CLI: `npm install -g @angular/cli`
- Java 17+ (for the Firebase Emulator)

#### Local Development
1. [Create a firebase project](https://firebase.google.com/). Name it anything you like
2. Install the [Firebase Emulator](https://firebase.google.com/docs/emulator-suite/install_and_configure)
   1. `npm install -g firebase-tools`
   2. `firebase login`

3. Install dependencies for the cloud functions in the `functions` directory
   - `npm install`

4. Build and start the web application in the `web` directory
   1. `npm install`
   2. `ng serve`

3. Start the emulator: `firebase emulators:start`
   1. Add a test user in the emulator: http://127.0.0.1:4000/auth

Browse to http://localhost:4200
