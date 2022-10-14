---
title: NodeJS
description: Node.js cheatsheet
created: 2020-01-14
updated: 2022-10-9
---

## 1. Create a Nodejs project and install dependent packages
### NPM commands
```javascript
// Initialize nodejs project
npm init

npm install <package-name> // Installs a package from NPM’s own repository.

// Install the package present in git
npm install <git remote url>

npm update <package-name> // This will update the specified package.


npm uninstall <package-name> // This uninstalls a package, completely removing everything npm installed on its behalf also removes the package from the dependencies, devDependencies, optionalDependencies, and peerDependencies objects in your package.json.

// Install a package as dev devDependencies
npm install -D <package-name>
```

### Arguments

`--global` or `-g` : used to install a package globally
`--production` : This argument will not install modules listed in devDependencies


## 2.  How to execute NodeJS file

```javascript
node filename.js
```

## 3. Modules

```javascript
  const express = require('express'); // to refer the installed package

const route = require('./route.js'); //to load  the module named route.js
const router = express.Router();

module.exports=router;
```

## 4. How to connect to mongodb

```javascript
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

MongoClient.connect(url, function (err, client) {
    if (err) {
        console.log('db connection error');
    }
    else
        if (!err) {
            console.log("Connected successfully to database");
            let db = client.db('dbname');
        }
});
```

## 5. Connect with mongodb using mongoose

```javascript
const mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      'mongodb://localhost:27017',
      options,
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## 6. Create a basic express server with NodeJs

```javascript
const express = require('express')
const app = express()

// Routes
app.get('/', (req, res) => {
  res.send('Basic express server.')
})


// Start server
const PORT = process.env.PORT || 8080
app.listen(PORT, console.log(`Server Running at PORT: ${PORT}`))

```

## 7. Console methods [Console API](https://developer.mozilla.org/en-US/docs/Web/API/Console_API)

```javascript
console.log('Your Message'); //prints to stdout
console.error('error message'); //prints to stderr
console.info('Your message'); //same as console.log
console.warn('warning message'); //same as console.error
console.count(); //It is used to count the number of times a specific label has been called.
console.clear(); //It is used to clear the console history.
console.time(); //It is used to get the starting time of an action.
console.timeEnd(); //This function is used to get the end time of specific action.
console.dir(); //It use util.inspect() on object and prints the resulting string to stdout.
```
