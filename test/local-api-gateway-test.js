const sinon = require('sinon');
const expect = require('chai').expect;
const underTest = require('../index');

describe('Local API Gateway tests', () => {
    var lambdaContextSpy;

    beforeEach(() => {
        lambdaContextSpy = {done: sinon.spy()};
    });

    it('Returns the name if it has been provided', (done) => {
        underTest.proxyRouter({
            requestContext: {
                resourcePath: '/greeting',
                httpMethod: 'GET'
            },
            queryStringParameters: {
                name: 'Superman',
            }
        }, lambdaContextSpy)
            .then(() => {
                expect(lambdaContextSpy.done.callCount).to.eql(1);
                expect(lambdaContextSpy.done.calledWithMatch(null, {
                        body: JSON.stringify({
                            greeting: 'Hello, Superman!'
                        }),
                        statusCode: 200
                    })
                ).to.be.true;
                done();
            })
            .catch(done);
    });

    it('Defaults to Hello World if no name has been provided', (done) => {
        underTest.proxyRouter({
            requestContext: {
                resourcePath: '/greeting',
                httpMethod: 'GET'
            }
        }, lambdaContextSpy)
            .then(() => {
                expect(lambdaContextSpy.done.callCount).to.eql(1);
                expect(lambdaContextSpy.done.calledWithMatch(null, {
                        body: JSON.stringify({
                            greeting: 'Hello, World!'
                        }),
                        statusCode: 200
                    })
                ).to.be.true;
                done();
            })
            .catch(done);
    });

});