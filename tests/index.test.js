import config from '../index.js';

describe('ClientConfig', () => {
    it('should load a single file', done => {
        config.files(['/config/test.json']);
        config.load(errs => {
            if (errs) return done(errs);
            expect(config.get('hello')).to.equal('world');
            done();
        });
    });

    it('should load two files and merge their contents', done => {
        config.files(['/config/test.json', '/config/another.json']);
        config.load(errs => {
            if (errs) return done(errs);
            expect(config.get('hello')).to.equal('everyone');
            expect(config.get('foo')).to.equal('bar');
            done();
        });
    });

    it('should warn the user of a failed attempt to retrieve a config file', done => {
        config.files(['/config/test.json', '/config/another.json', '/config/no-exist.json']);
        config.load(errs => {
            expect(errs.length).to.be.equal(1);
            expect(errs[0]).to.have.keys(['message', 'file']);
            expect(errs[0].message).to.contain('not');
            done();
        });
    });
});
