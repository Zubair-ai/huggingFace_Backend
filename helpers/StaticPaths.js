const env = process.env.NODE_ENV || 'development';
const baseURL = env === 'development' ? 'http://localhost:3001' : '';

const UPLOAD_PATH = Object.freeze({
  UPLOAD_PATH: `${baseURL  }/uploads`,
});

export default UPLOAD_PATH;
