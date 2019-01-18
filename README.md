# client-config
In-memory client configuration library for single-page web applications

```
npm install @bradenhc/client-config
```

## Usage

The `client-config` library uses the `fetch()` API to retrieve configuration from your server for your web application. The asynchrounous request to load the configuration is done using the `ClientConfig.load()` function and only happens when you explicitly call the function in your application.

Assume we have the following configuration located in `/assets/config/default.json` on our server:

```json
{
    "version": "v1.0.0",
    "database": {
        "host": "my.host.com",
        "port": "20000",
        "name": "myapp_database"
    }
}
```

The library can be used in the following way:

```js
import config from 'client-config';

config.load(err => {
    if(err) return console.log(err);

    // Returns the value 'v1.0.0'
    let version = config.get('version');

    // Returns the nested value 'my.host.com'
    let host = config.get('datbase.host');

    // Return undefined
    let doesNotExist = config.get('foo.bar.baz');

    // Sets a new key/value pair
    config.set('new.key', 42);

    // Sets an existing key/value pair
    config.set('database.name', 'myapp_db');
});
```

Once the configuration has been loaded, the `ClientConfig.loaded` flag will be set to `true`. You can use this to check for loaded configuration so you don't have to make unneccessary calls back to the server. Ideally, you should only call `load()` once while bootstraping the web application. Configuration will be available throughout the rest of the app without needed to call `load()` again.

The configuration library supports nested member access. When using `get()`, nested values can be retrieved by a period-delimited string of the keys. Setting nested values can be achieved in the same way. If a nested key does not exist, the library will create an empty object to hold the new key, automatically generating the nested structure.

## Config Files

The library uses the array set at `ClientConfig.files` to fetch configuration for the application. By default, only two entries exists in the array:
- `/assets/config/default.json`
- `/assets/config/local.json` 
More entries can be added to the array using the `push()` function, or the array can be reassigned.

```js
import config from 'client-config';

// Set the files to use when loading configuration
config.files([
    "/assets/config/production.json",
    "/assets/config/security.json"
]);

// Add another file
config.files().push("/assets/config/test.json");
```

These files will be fetched when `load()` is called.