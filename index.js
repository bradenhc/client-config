function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return mergeDeep(target, ...sources);
}
export class ClientConfig {
    constructor() {
        this._config = {};
        this.loaded = false;
        this._files = [];
    }

    load(cb) {
        let pending = this._files.length;
        let warnings = [];
        this._files.forEach(file => {
            fetch(file)
                .then(res => res.json())
                .then(data => {
                    this._config = mergeDeep(this._config, data);
                    this.loaded = true;
                    if (!--pending) {
                        cb(warnings.length === 0 ? null : warnings);
                    }
                })
                .catch(err => {
                    warnings.push({ message: `Could not load config file`, file });
                    if (!--pending) {
                        cb(warnings);
                    }
                });
        });
    }

    files(files) {
        if (!files) {
            return this._files;
        } else {
            if (!typeof files === 'array') {
                throw new Error('Cannot set files for configuration: files must be an array of strings');
            }
            if (files.length === 0 || !typeof files[0] === 'string') {
                throw new Error(
                    'Cannot set files for configuration: array must have at least one value and can only contain strings'
                );
            }
            this._files = files;
        }
    }

    get(key) {
        try {
            let parts = key.split('.');
            if (parts.length === 1) return this._config[key];
            let val = this._config[parts[0]];
            for (let i = 1; i < parts.length; i++) {
                val = val[parts[i]];
            }
            return val;
        } catch (err) {
            return undefined;
        }
    }

    set(key, value) {
        try {
            let parts = key.split('.');
            if (parts.length === 1) {
                this._config[key] = value;
                return true;
            } else {
                let val = this._config[parts[0]];
                if (!val) {
                    this._config[parts[0]] = {};
                    val = this._config[parts[0]];
                }
                for (let i = 1; i < parts.length; i++) {
                    if (!val[parts[i]]) {
                        val[parts[i]] = {};
                    }
                    val = val[parts[i]];
                }
                val = value;
                return true;
            }
        } catch (err) {
            return false;
        }
    }
}

const config = new ClientConfig();

export default config;
