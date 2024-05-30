import User from '../../models/userModel.js';
import httpStatusCodes from '../../helpers/Statuses.js';
import uniqid from 'uniqid';

export const loginUser = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user || !user.validPassword(req.body.password)) {
        return res
          .status(httpStatusCodes.BAD_REQUEST)
          .json({ error: 'Email or Password invalid!' });
      }
      return res
        .status(httpStatusCodes.SUCCESS)
        .json({ success: true, data: user.toAuthJSON() });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(httpStatusCodes.BAD_REQUEST)
        .json({ error: err.message });
    });
};

export const addUser = async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.name) {
    return res
      .status(httpStatusCodes.NO_CONTENT)
      .json({ error: 'Email, name and password are required' });
  }
  const user = new User({
    userId: uniqid(),
    email: req.body.email.toLowerCase(),
    ...req.body,
  });

  try {
    user.setPassword(req.body.password);
    const savedUser = await user.save();
    return res.status(httpStatusCodes.SUCCESS).json({
      success: true,
      status: 200,
      message: 'Successful registration!',
      data: {
        userId: savedUser.userId,
        email: savedUser.email,
        name: savedUser.name,
      },
    });
  } catch (err) {
    if (
      err.message === 'User validation failed: email: Field is already taken.'
    ) {
      return res.status(httpStatusCodes.BAD_REQUEST).json({
        success: false,
        status: 400,
        error: 'Email is already taken.',
      });
    }
    return res.status(httpStatusCodes.BAD_REQUEST).json({ error: err.error });
  }
};
