import express from 'express';
import USERROUTES from './user/Index.js';
import DATASETROUTES from './dataset/index.js';

const router = express.Router();

const defaultRoutes = USERROUTES.ROUTES.concat(DATASETROUTES.ROUTES);
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
