# vwLib

Docs at https://vwlib.wazhen.me

# Instalation

Create a new node project

```console
npm init -y
```

Install webpack and babel

```console
npm install --save-dev webpack@4 webpack-cli@4 @babel/core @babel/plugin-proposal-class-properties @babel-preset-env babel-loader clean-webpack-plugin
```

Install vwlib

```console
npm install vwlib
```

# Project structure
Create a src folder for your source code in your project root

```console
mkdir src
```

Create a helloWorld.js file in src

```console
touch src/helloWorld.js
```

Put the following code in src/helloWorld.js

```js
class MessageBuilder {
    constructor() {
        alert(this.message);
    }

    get message() {
        return 'hello world!!';
    }
}

const messageBuilder = new MessageBuilder();
```

Create a webpack.config.js file in your project root
```console
touch webpack.config.js
```

Open webpack.config.js and copy/paste the following code

```js
const path = require('path');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const compileFolder = 'wErp';

const moduleNames = {
    testModule: 'testModule',
}


const moduleToCompile = moduleNames.ejecutorTest;


const modules = {
    testModule: {
        helloWorld: path.resolve(__dirname, 'src/helloWorld.js'),
    },
};

module.exports = {
    mode: 'development',
    devtool: 'none',
    watch: true,
    entry: modules[moduleToCompile],
    output: {
        filename: '[name]/[name].js',
        path: path.resolve(__dirname, `${compileFolder}/` + moduleToCompile)
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    "presets": [
                        ["@babel/preset-env"]
                    ],
                    "plugins": [
                        "@babel/plugin-proposal-class-properties",
                    ]
                }
            }
        }]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [`${compileFolder}/` + moduleToCompile]
        })
    ]
}
```

Run the following command

```console
npx webpack --config webpack.config.js
```

You will see the following structure appearing in your project root

```
project_root
|
'--vwlib
   |
   '--helloWorld
      |
      '--helloWorld.js
```

You can put this script in Velneo and try to run it. It should work!

In order to compile the code in an easier way, you can open the package.json file and add
the following key-value pair in scripts:

```js
{
  "scripts": {
    "build": "npx webpack --config webpack.config.js"
  }
}
```

Now you can use the following command to compile the code:

```console
npm run build
```