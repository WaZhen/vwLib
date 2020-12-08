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

# Using examples

## Using VwRegister

Documentation: https://vwlib.wazhen.me/VwRegister.html

You can create an article for vErp in the following way:

```js
import VwRegister from 'vwlib';

const article = VwRegister.createRegister("velneo_verp_2_dat/ART_M", {
    NAME: "Artículo de test",
    REF: "012345",
});
```

This will create an article and store it in the variable article

### ORM properties

You can access all the fields, and navigate to masters with the following syntax:

```js
import VwRegister from 'vwlib';

const article = VwRegister.createRegister("velneo_verp_2_dat/ART_M", {
    NAME: "Artículo de test",
    REF: "012345",
});
print(article.ID());
print(article.ALT_USR().NAME());
print(article.ALT_TIM());
```

You can query the created article in the following way:

```js
import VwRegister from 'vwlib';

const article = VwRegister.createRegister("velneo_verp_2_dat/ART_M", {
    NAME: "Artículo de test",
    REF: "012345",
});
const articleRegister = VwRegister.getRegister("velneo_verp_2_dat/ART_M", "REF", ["012345"]);
print(articleRegister.ID());
```

You can load the order lines that uses this article in the following way:

```js
import VwRegister from 'vwlib';

const article = VwRegister.createRegister("velneo_verp_2_dat/ART_M", {
    NAME: "Artículo de test",
    REF: "012345",
});

const customer = VwRegister.createRegister("velneo_verp_2_dat/ENT_M", {
    NAME: "Cliente test",
    NOM_FIS: "Cliente test",
    ES_CLT: true,
})

const orderHeader = VwRegister.createRegiter("velneo_verp_2_dat/VTA_PED_G", {
    CLT: customer.ID(),
});

const order_line_1 = VwRegister.createRegister("velneo_verp_2_dat/VTA_PED_LIN_G", {
    VTA_PED_G: orderHeader.ID(),
    ART_M: article.ID(),
    CAN_PED: 5,
});

const order_line_2 = VwRegister.createRegister("velneo_verp_2_dat/VTA_PED_LIN_G", {
    VTA_PED_G: orderHeader.ID(),
    ART_M: article.ID(),
    CAN_PED: 10,
});

order_lines = article.loadPlurals("VTA_PED_LIN_G_ART");

order_lines.foreach((order_line) => {
    alert(`Order line id:${order_line.ID()}, quantity: ${order_line.CAN()}, article: ${order_line.ART().NAME()}` );
});

```


## VwRequest

Docs at https://vwlib.wazhen.me/VwRequest.html

### GET example
Velneo official get [example](https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/xmlhttprequest#obtener-contenido-de-url-de-forma-asincrona)
with vwlib:

```js
import VwRequest from 'vwlib'

const manageRequestSuccess = (res) => {
    alert(JSON.stringify(res));
};

VwRequest.send({
    method: "GET",
    url: "https://velneo.es"
    success: manageRequestSuccess
})
```

### POST example
Velneo official POST [example](https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/xmlhttprequest#peticion-post-enviando-un-json-y-obteniendo-un-json)
with vwlib:

```js
import VwRequest from 'vwlib'

VwRequest.send({
    method: "POST",
    url: "http://validate.jsontest.com",
    data: {"Nombre": "Luis", "Edad": 43},
    success: (res) => {
        alert(JSON.stringify(res));
    }
})
```