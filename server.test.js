const request = require('supertest');
const express = require('express');

// Import or define your app
const app = require('./server');

describe('GET /ping', () => {
  it('should return a 200 status and "pong" message', async () => {
    const response = await request(app).get('/ping');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('pong');
  });
});
