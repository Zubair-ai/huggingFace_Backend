import axios from 'axios';
import {
  followDataset,
  unFollowDataset,
  getFollowedDataset,
  getCateogryAssessment,
} from '../../../controllers/dataset/DatasetController';
import { jest } from '@jest/globals';
import mongoose from 'mongoose';

import User from '../../../models/userModel';

jest.mock('../../../models/userModel', () => ({
  findOne: jest.fn(() => ({
    followedDatasets: ['dataset_id_1', 'dataset_id_2'], // Mock followed datasets
    save: jest.fn(),
  })),
  findByIdAndUpdate: jest.fn(),
}));

jest.mock('axios');
jest.mock('mongoose');

beforeAll(async () => {
  const mongoUri =
    'mongodb+srv://demoZubair:demoZubair@cluster0.be8ezjp.mongodb.net/Assignment?retryWrites=true&w=majority';
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Follow Dataset Endpoint', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const req = { userId: 'user_id', body: { datasetId: 'dataset_id' } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  test('should follow dataset successfully', async () => {
    User.findOne = jest
      .fn()
      .mockResolvedValue({ followedDatasets: [''], save: jest.fn() });

    await followDataset(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ userId: 'user_id' });
    expect(res.status).not.toHaveBeenCalled(); // Ensure status method was not called
    expect(res.json).toHaveBeenCalledWith({
      message: 'Dataset followed successfully',
    });
  });

  test('should return 404 if user not found', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);
    const errorMessage = { message: 'User not found' };

    jest.spyOn(axios, 'get').mockRejectedValueOnce(errorMessage);

    await followDataset(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(errorMessage);
  });

  test('should return 400 if already following dataset', async () => {
    User.findOne = jest
      .fn()
      .mockResolvedValue({ followedDatasets: ['dataset_id'], save: jest.fn() });
    const errorMessage = { message: 'You are already following this dataset' };

    await followDataset(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(errorMessage);
  });
});
describe('Unfollow Dataset Endpoint', () => {
  const req = { userId: 'user_id', body: { datasetId: 'dataset_id' } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should unfollow dataset successfully', async () => {
    User.findOne = jest
      .fn()
      .mockResolvedValue({ followedDatasets: ['dataset_id'], save: jest.fn() });
    await unFollowDataset(req, res);

    expect(res.status).not.toHaveBeenCalledWith();
    expect(res.json).toHaveBeenCalledWith({
      message: 'Dataset un-followed successfully',
    });
  });

  test('should return 404 if user not found', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);
    const errorMessage = { message: 'User not found' };

    jest.spyOn(axios, 'get').mockRejectedValueOnce(errorMessage);

    await unFollowDataset(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(errorMessage);
  });

  test('should return 400 if not following dataset', async () => {
    User.findOne = jest
      .fn()
      .mockResolvedValue({ followedDatasets: [''], save: jest.fn() });
    const errorMessage = { message: 'You are not following this dataset' };

    await unFollowDataset(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(errorMessage);
  });
});

describe('Get Followed Dataset Endpoint', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return followed datasets', async () => {
    User.findOne = jest
      .fn()
      .mockResolvedValue({ followedDatasets: ['dataset_id'], save: jest.fn() });
    axios.get = jest.fn().mockResolvedValue({
      data: {
        name: 'some name',
      },
    });
    const req = { userId: 'user_id' };
    const res = { json: jest.fn() };

    await getFollowedDataset(req, res);

    expect(res.json).toHaveBeenCalledWith([
      {
        name: 'some name',
      },
    ]);
  });
});

describe('Get Category Assessment Endpoint', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return categorized impacts', async () => {
    const req = { body: { datasetId: 'dataset_id' } };
    const res = { json: jest.fn() };

    jest.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        _id: '621ffdd236468d709f181d58',
        id: 'acronym_identification',
        cardData: {
          dataset_info: {
            features: [
              {
                name: 'id',
                dtype: 'string',
              },
              {
                name: 'tokens',
                sequence: 'string',
              },
              {
                name: 'labels',
                sequence: {
                  class_label: {
                    names: {
                      0: 'B-long',
                      1: 'B-short',
                      2: 'I-long',
                      3: 'I-short',
                      4: 'O',
                    },
                  },
                },
              },
            ],
            splits: [],
            download_size: 2071007,
            dataset_size: 9733172,
          },
          'train-eval-index': [],
        },
        disabled: false,
        gated: false,
        lastModified: '2024-01-09T11:39:57.000Z',
        likes: 18,
        private: false,
        sha: '15ef643450d589d5883e289ffadeb03563e80a9e',
        downloads: 642,
        paperswithcode_id: 'acronym-identification',
        createdAt: '2022-03-02T23:29:22.000Z',
        key: '',
      },
    });

    await getCateogryAssessment(req, res);

    expect(res.json).toHaveBeenCalledWith({
      impact: 'medium',
      size: 9733172,
    });
  });
});

describe('Combine and Cluster Dataset Endpoint', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should combine and cluster datasets successfully', async () => {
    const req = { body: { datasetIds: ['dataset_id_1', 'dataset_id_2'] } };
    const res = { json: jest.fn() };

    jest.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        _id: '621ffdd236468d709f181d58',
        id: 'acronym_identification',
        cardData: {
          dataset_info: {
            features: [
              {
                name: 'id',
                dtype: 'string',
              },
              {
                name: 'tokens',
                sequence: 'string',
              },
              {
                name: 'labels',
                sequence: {
                  class_label: {
                    names: {
                      0: 'B-long',
                      1: 'B-short',
                      2: 'I-long',
                      3: 'I-short',
                      4: 'O',
                    },
                  },
                },
              },
            ],
            splits: [],
            download_size: 2071007,
            dataset_size: 9733172,
          },
          'train-eval-index': [],
        },
        disabled: false,
        gated: false,
        lastModified: '2024-01-09T11:39:57.000Z',
        likes: 18,
        private: false,
        sha: '15ef643450d589d5883e289ffadeb03563e80a9e',
        downloads: 642,
        paperswithcode_id: 'acronym-identification',
        createdAt: '2022-03-02T23:29:22.000Z',
        key: '',
      },
    });
    jest.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        data: {
          _id: '621ffdd236468d709f181d58',
          id: 'ade_corpus_v2',
          cardData: {
            dataset_info: {
              features: [
                {
                  name: 'id',
                  dtype: 'string',
                },
                {
                  name: 'tokens',
                  sequence: 'string',
                },
                {
                  name: 'labels',
                  sequence: {
                    class_label: {
                      names: {
                        0: 'B-long',
                        1: 'B-short',
                        2: 'I-long',
                        3: 'I-short',
                        4: 'O',
                      },
                    },
                  },
                },
              ],
              splits: [],
              download_size: 2071007,
              dataset_size: 9733172,
            },
            'train-eval-index': [],
          },
          disabled: false,
          gated: false,
          lastModified: '2024-01-09T11:39:57.000Z',
          likes: 18,
          private: false,
          sha: '15ef643450d589d5883e289ffadeb03563e80a9e',
          downloads: 642,
          paperswithcode_id: 'acronym-identification',
          createdAt: '2022-03-02T23:29:22.000Z',
          key: '',
        },
      },
    });

    await combineAndClusterDataset(req, res);

    expect(res.json).toHaveBeenCalledWith({
      clusterLabels: [
        'acronym_identification',
        'acronym_identification',
        undefined,
      ],
      impact: 'low',
    });
  });
});
