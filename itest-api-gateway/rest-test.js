'use strict';

const expect = require('chai').expect;
const querystring = require('querystring');
const url = require('url');
const requestPromise = require('request-promise');

const claudiaConfig = require('../claudia.json');
const API_ID = claudiaConfig.api.id;
const AWS_REGION = claudiaConfig.lambda.region;
const HOST = `${API_ID}.execute-api.${AWS_REGION}.amazonaws.com`;
const STAGE = 'latest';
const RESOURCE = 'greeting';


function callGreeterEndpoint(name) {
    const query = querystring.stringify({name: name});
    const requestUrl = url.format({
        protocol: 'https',
        host: HOST,
        pathname: `${STAGE}/${RESOURCE}`,
        search: query
    });
    const params = {
        method: 'GET',
        uri: url.format(requestUrl),
    };
    return requestPromise(params);
}


describe('Greeting REST integration tests', () => {

    it('Returns the name if it is provided', done => {
        callGreeterEndpoint('Superman')
            .then(json => {
                const response = JSON.parse(json);
                expect(response.greeting).to.eql('Hello, Superman!');
                done();
            })
            .catch(done);
    });

    it('Defaults to Hello World if no name is provided', done => {
        callGreeterEndpoint()
            .then(json => {
                const response = JSON.parse(json);
                expect(response.greeting).to.eql('Hello, World!');
                done();
            })
            .catch(done);
    });

});