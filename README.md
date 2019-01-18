# client-config

In-memory client configuration library for single-page web applications

```
npm i @bradenhc/client-config
```

## Usage

The `client-config` library uses the `fetch()` API to retrieve configuration from your server for your web application. The asynchrounous request to load the configuration is done using the `ClientConfig#load()` function and only happens when you explicitly call the function in your application.

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

// Specify which JSON files to load as config
config.files(['/assets/config/default.json']);

// Load the files
config.load(errs => {
    if (errs) return console.log(errs);

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

The `set()` function only changes the values of the configuration in memory.

## Config Files

By default, the library does not have any config files to load. In order to set the files to load you must call the `files()` function. Currently there is no guarantee that the files will be loaded in the order you specify, as all requests are done asynchronously.

```js
import config from 'client-config';

// Set the files to use when loading configuration
config.files([
    '/assets/config/default.json',
    '/assets/config/local.json',
    '/assets/config/production.json',
    '/assets/config/security.json'
]);

// Add another file
config.files().push('/assets/config/test.json');
```

As seen in the example, you must pass an array of strings to the `files()` function to set the files to load. Calling `files()` without any arguments will return the current array of files the `client-config` module is is set to load. These files will be fetched when `load()` is called.

## Errors

If the libary is unable to load any of the config files specified, it will return a list of the files as the first argument to the callback function provided to `load()`. The returned errors will have the following format:

```js
errs = [
    { 
        message: 'Message describing the issue', 
        file: 'the-file-that-triggered-the-error' 
    }
];
```
