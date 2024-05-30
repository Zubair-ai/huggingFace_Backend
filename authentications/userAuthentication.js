import jwt from 'jsonwebtoken';

const userAuthentication = function (req, res, next) {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.headers['auth-token'] ||
    req.cookies.token ||
    req.headers.token;
  if (!token) {
    res.status(401).send({ error: 'UNAUTHORIZED_NO_TOKEN', success: false });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        res
          .status(401)
          .send({ error: 'UNAUTHORIZED_INVALID_TOKEN', success: false });
      } else {
        req.userId = decoded.userId;
        req.name = decoded.name;
        req.email = decoded.email;
        req.permissions = decoded.permissions;
        next();
      }
    });
  }
};

export default userAuthentication;
