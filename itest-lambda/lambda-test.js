'use strict';

const expect = require('chai').expect;
const AWS = require('aws-sdk');

const claudiaConfig = require('../claudia.json');
const AWS_REGION = claudiaConfig.lambda.region;
const LAMBDA_NAME = claudiaConfig.lambda.name;

AWS.config.update({region: AWS_REGION});
const lambda = new AWS.Lambda({apiVersion: '2015-03-31'});

function callGreeterLambda(name) {
    const payload = {
        requestContext: {
            resourcePath: '/greeting',
            httpMethod: 'GET'
        },
    };
    if (name) {
        payload.queryStringParameters = {name: name};
    }
    const params = {
        FunctionName: LAMBDA_NAME,
        Payload: JSON.stringify(payload)
    };
    return lambda.invoke(params).promise();
}

function parseBodyFromResponse(data) {
    return JSON.parse(JSON.parse(data.Payload).body);
}

describe('Greeting Lambda integration tests', () => {

    it('Returns the name if it is provided', done => {
        callGreeterLambda('Clark Kent')
            .then(data => {
                expect(data.StatusCode).to.eql(200);
                const responseBody = parseBodyFromResponse(data);
                expect(responseBody.greeting).to.eql('Hello, Clark Kent!');
                done();
            })
            .catch(done);
    });

    it('Defaults to Hello World if no name is provided', done => {
        callGreeterLambda()
            .then(data => {
                expect(data.StatusCode).to.eql(200);
                const responseBody = parseBodyFromResponse(data);
                expect(responseBody.greeting).to.eql('Hello, World!');
                done();
            })
            .catch(done);
    });

});