class ClientConfig {
    constructor() {
        this._config = {};
        this.loaded = false;
    }

    load(cb) {
        let pending = 0;
        let called = false;
        ClientConfig.files.forEach(file => {
            pending++;
            fetch(file)
                .then(res => res.json())
                .then(data => {
                    this._config = data;
                    this.loaded = true;
                    if (!--pending && !called) {
                        called = true;
                        cb();
                    }
                })
                .catch(err => {
                    if (!called) {
                        called = true;
                        cb(new Error('Failed to load config: ' + err.message));
                    }
                });
        });
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

ClientConfig.files = ['/assets/config/default.json'];

const config = new ClientConfig();

export default config;
