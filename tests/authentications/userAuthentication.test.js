import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';
import userAuthentication from '../../authentications/userAuthentication';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('userAuthentication middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      headers: {},
      cookies: {},
    };
    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should pass authentication with valid token', () => {
    const token = 'validToken';
    const decoded = {
      userId: 'user123',
      name: 'John Doe',
      email: 'john@example.com',
      permissions: ['read', 'write'],
    };

    jwt.verify = jest.fn().mockImplementationOnce((token, secret, callback) => {
      callback(null, decoded);
    });

    req.headers.token = token;
    userAuthentication(req, res, next);

    expect(req.userId).toEqual(decoded.userId);
    expect(req.name).toEqual(decoded.name);
    expect(req.email).toEqual(decoded.email);
    expect(req.permissions).toEqual(decoded.permissions);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('should return 401 with missing token', () => {
    userAuthentication(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      error: 'UNAUTHORIZED_NO_TOKEN',
      success: false,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test.only('should return 401 with invalid token', () => {
    const token = 'invalidToken';
    jwt.verify = jest.fn().mockImplementationOnce((token, secret, callback) => {
      callback(new Error('Invalid token'));
    });

    req.headers.token = token;
    userAuthentication(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      error: 'UNAUTHORIZED_INVALID_TOKEN',
      success: false,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
