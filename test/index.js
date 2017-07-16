var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

const HttpApiKeyStrategy = require('../src/HttpApiKeyStrategy.js');

describe('passport-httpapikey', function() {

    describe('authenticate', function() {

        function letMeIn(apikey, done) {
            return done(null, {
                username: 'aValidUserName'
            });
        }

        function dontLetMeIn(apikey, done) {
            return done(null, false);
        }

        function errorWhenLettingMeIn(apikey, done) {
            return done(new Error('ive messed myself'));
        }

        describe('authorization header', function() {
            it('should fail if the "Authorization" header is not present', function() {

                // Given
                let aRequest = {
                    headers: {}
                };

                let strategy = new HttpApiKeyStrategy(letMeIn);
                strategy.fail = sinon.spy();
                strategy.success = sinon.spy();

                // When
                strategy.authenticate(aRequest);

                // Then
                expect(strategy.fail).to.have.been.called;
                expect(strategy.success).to.not.have.been.called;
            });

            it('should fail if the "Authorization" header is present but with no scheme', function() {

                // Given
                let aRequest = {
                    headers: {
                        'authorization': 'abc123'
                    }
                };

                let strategy = new HttpApiKeyStrategy(letMeIn);
                strategy.fail = sinon.spy();
                strategy.success = sinon.spy();

                // When
                strategy.authenticate(aRequest);

                // Then
                expect(strategy.fail).to.have.been.called;
                expect(strategy.success).to.not.have.been.called;
            });

            it('should fail if the "Authorization" header scheme is not "apikey"', function() {

                // Given
                let aRequest = {
                    headers: {
                        'authorization': 'something abc123'
                    }
                };

                let strategy = new HttpApiKeyStrategy(letMeIn);
                strategy.fail = sinon.spy();
                strategy.success = sinon.spy();

                // When
                strategy.authenticate(aRequest);

                // Then
                expect(strategy.fail).to.have.been.called;
                expect(strategy.success).to.not.have.been.called;
            });

            it('should succeed if the header is present and is of the correct type', function() {

                // Given
                let aRequest = {
                    headers: {
                        'authorization': 'apikey abc123'
                    }
                };

                let strategy = new HttpApiKeyStrategy(letMeIn);
                strategy.fail = sinon.spy();
                strategy.success = sinon.spy();

                // When
                strategy.authenticate(aRequest);

                // Then
                expect(strategy.fail).to.not.have.been.called;
                expect(strategy.success).to.have.been.called;

            });

            it('should fail if the apikey is too short', function() {

                // Given
                let aRequest = {
                    headers: {
                        'authorization': 'apikey a'
                    }
                };

                let strategy = new HttpApiKeyStrategy(letMeIn);
                strategy.fail = sinon.spy();
                strategy.success = sinon.spy();

                // When
                strategy.authenticate(aRequest);

                // Then
                expect(strategy.fail).to.have.been.called;
                expect(strategy.success).to.not.have.been.called;
            });

        });

        describe('validate callback', function() {

            it('should fail if the validate callback fails', function() {

                // Given
                let aRequest = {
                    headers: {
                        'authorization': 'apikey abc123'
                    }
                };

                let strategy = new HttpApiKeyStrategy(dontLetMeIn);
                strategy.fail = sinon.spy();
                strategy.success = sinon.spy();

                // When
                strategy.authenticate(aRequest);

                // Then
                expect(strategy.fail).to.have.been.called;
                expect(strategy.success).to.not.have.been.called;

            });

            it('should error if the validate callback errors', function() {

                // Given
                let aRequest = {
                    headers: {
                        'authorization': 'apikey abc123'
                    }
                };

                let strategy = new HttpApiKeyStrategy(errorWhenLettingMeIn);
                strategy.fail = sinon.spy();
                strategy.success = sinon.spy();
                strategy.error = sinon.spy();

                // When
                strategy.authenticate(aRequest);

                // Then
                expect(strategy.fail).to.not.have.been.called;
                expect(strategy.success).to.not.have.been.called;

                expect(strategy.error).to.have.been.called;

            });

            it('should succeed if the validate callback succeeds', function() {

                // Given
                let aRequest = {
                    headers: {
                        'authorization': 'apikey abc123'
                    }
                };

                let strategy = new HttpApiKeyStrategy(letMeIn);
                strategy.fail = sinon.spy();
                strategy.success = sinon.spy();

                // When
                strategy.authenticate(aRequest);

                // Then
                expect(strategy.fail).to.not.have.been.called;
                expect(strategy.success).to.have.been.called;

            });

            it('should pass the user through the from the validate callback', function() {
                // Given
                let aRequest = {
                    headers: {
                        'authorization': 'apikey abc123'
                    }
                };

                let strategy = new HttpApiKeyStrategy(letMeIn);
                strategy.success = sinon.spy();

                // When
                strategy.authenticate(aRequest);

                // Then
                expect(strategy.success).to.have.been.calledWith({
                    username: 'aValidUserName'
                });

            });

        });


    });

});