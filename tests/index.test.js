import config from '../index.js';

describe('ClientConfig', () => {
    it('should load a single file', done => {
        config.files(['/config/test.json']);
        config.load(err => {
            if (err) return done(err);
            expect(config.get('hello')).to.equal('world');
            done();
        });
    });
});
