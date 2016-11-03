'use strict';

const ApiBuilder = require('claudia-api-builder');
const api = new ApiBuilder();

module.exports = api;

api.get('/greeting', (request) => {
    console.log('Event:', JSON.stringify(request));
    const name = request.queryString.name || 'World';
    return {greeting: `Hello, ${name}!`};
});
