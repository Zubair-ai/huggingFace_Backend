import User from '../../models/userModel.js';
import axios from 'axios';
import KMeans from 'kmeans-js';
import categorizeImpacts, { combineDatasets } from '../../helpers/datasets.js';

const huggingfaceAPIUrl = 'https://huggingface.co/api/datasets';

export const followDataset = async (req, res) => {
  try {
    const userId = req.userId;
    const { datasetId } = req.body;
    const user = await User.findOne({ userId: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.followedDatasets.includes(datasetId)) {
      return res
        .status(400)
        .json({ message: 'You are already following this dataset' });
    }
    user.followedDatasets.push(datasetId);
    await user.save();

    res.json({ message: 'Dataset followed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const unFollowDataset = async (req, res) => {
  try {
    const userId = req.userId;
    const { datasetId } = req.body;

    const user = await User.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.followedDatasets.includes(datasetId)) {
      return res
        .status(400)
        .json({ message: 'You are not following this dataset' });
    }

    const index = user.followedDatasets.indexOf(datasetId);
    user.followedDatasets.splice(index, 1);
    await user.save();
    res.json({ message: 'Dataset un-followed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const getFollowedDataset = async (req, res) => {
  try {
    const datasets = [];
    const user = await User.findOne({ userId: req.userId });
    await Promise.all(
      user.followedDatasets.map(async (id) => {
        const response = await axios.get(
          `${huggingfaceAPIUrl}/${id}?full=true`
        );
        datasets.push(response.data);
      })
    );
    res.json(datasets);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message});
  }
};

export const getCateogryAssessment = async (req, res) => {
  try {
    const datasetId = req.body.datasetId;
    const dataset = await axios.get(`${huggingfaceAPIUrl}/${datasetId}`);
    console.log("dataset", dataset);
    // Categorize impacts based on size thresholds
    const categorizedImpacts = categorizeImpacts(dataset.data);
    res.json(categorizedImpacts);
  } catch (error) {
    console.error(error);
    res.status(error.response.status).json({ error: error.response.data.error });
  }
};

export const getCombinedDatasets = async (req, res) => {
  try {
    const datasetIds = req.body.datasetIds;
    const combinedDatasets = await combineDatasets(datasetIds);

    console.log("combinedDatasets", combinedDatasets);
    res.json({
      combinedDatasets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const combineAndClusterDataset = async (req, res) => {
  try {
    const datasetIds = req.body.datasetIds;
    const combinedDatasets = combineDatasets(datasetIds);
    const dataMatrix = combinedDatasets.map((dataset) =>
      Object.values(dataset)
    );

    // Perform K-means clustering
    const kmeans = new KMeans({ K: dataMatrix.length });
    const clusters = kmeans.cluster(dataMatrix);

    // Determine if datasets fall into distinct clusters
    const distinctClusters = clusters.every((cluster) =>
      cluster.every((value) => value !== cluster[0])
    );

    // Assign impact based on clustering
    const impact = distinctClusters ? 'high' : 'low';

    res.json({
      impact,
      clusterLabels: clusters.map((cluster) => cluster[1]),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
