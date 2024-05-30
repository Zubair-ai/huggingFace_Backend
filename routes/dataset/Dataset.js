import express from 'express';
import {
  followDataset,
  unFollowDataset,
  getFollowedDataset,
  combineAndClusterDataset,
  getCateogryAssessment,
  getCombinedDatasets
} from '../../controllers/dataset/DatasetController.js';
import userAuthentication from '../../authentications/userAuthentication.js';

const router = express.Router();

router.post('/follow', userAuthentication, followDataset);

router.post('/unfollow', userAuthentication, unFollowDataset);

router.get('/getFollowed', userAuthentication, getFollowedDataset);

router.post(
  '/get-category-assessment',
  userAuthentication,
  getCateogryAssessment
);

router.post(
  '/combine',
  userAuthentication,
  getCombinedDatasets
);

router.post(
  '/combine-and-cluster',
  userAuthentication,
  combineAndClusterDataset
);

export default router;
