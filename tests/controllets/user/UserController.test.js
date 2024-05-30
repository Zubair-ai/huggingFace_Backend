import {
  loginUser,
  addUser,
} from '../../../controllers/user/UserController.js';
import { jest } from '@jest/globals';
import User from '../../../models/userModel.js';

const req = {
  body: {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  },
};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('loginUser function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 if email is not found', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);

    // Call the loginUser function
    await loginUser(req, res);

    // Check if the response status and message are correct
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Email or Password invalid!',
    });
  });

  test('should return 400 if password is invalid', async () => {
    User.findOne = jest.fn().mockResolvedValue({
      validPassword: jest.fn(() => false),
    });

    await loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Email or Password invalid!',
    });
  });
});

describe('addUser function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 if email, password, or name is missing', async () => {
    const invalidReq = { body: {} };
    await addUser(invalidReq, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Email, name and password are required',
    });
  });

  test('should return 400 if email is already taken', async () => {
    User.prototype.save = jest
      .fn()
      .mockRejectedValue(
        new Error('User validation failed: email: Field is already taken.')
      );

    await addUser(req, res);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Email is already taken.',
      status: 400,
      success: false,
    });
  });

  test('should return 200 if user is created successfully', async () => {
    User.prototype.save = jest.fn().mockResolvedValue({
      email: 'test@mail.com',
      name: 'some',
      userId: 'user-id',
    });

    req.body = {
      email: 'test@mail.com',
      password: 'poilk123',
      name: 'some',
    };
    await addUser(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Successful registration!',
      status: 200,
      success: true,
      data: {
        email: 'test@mail.com',
        name: 'some',
        userId: 'user-id',
      },
    });
  });
});
