import axios from 'axios';
const huggingfaceAPIUrl = 'https://huggingface.co/api/datasets';

export const getImpact = (dataset_config) => {
  let impact;
  const lowThreshold = 1000000;
  const mediumThreshold = 9999999;
  const { dataset_size, config_name } = dataset_config;
  if (dataset_size <= lowThreshold) {
    impact = 'low';
  } else if (dataset_size <= mediumThreshold) {
    impact = 'medium';
  } else {
    impact = 'high';
  }

  return {
    name: config_name,
    size: dataset_size,
    impact,
  };
};

const categorizeImpacts = (dataset) => {
  if (!dataset.cardData.dataset_info) {
    return null;
  }
  const datasetInfo = dataset.cardData.dataset_info;
  const isArrary = Array.isArray(datasetInfo) ? true : false;
  return isArrary ? dataset.cardData.dataset_info.map((dataset_config) => {
    return getImpact(dataset_config);
  }) : getImpact(datasetInfo);
};


export const combineDatasets = async (datasetIds) => {
  const datasets = await Promise.all(
    datasetIds.map(async (datasetId) => {
      const response = await axios.get(`${huggingfaceAPIUrl}/${datasetId}`);
      return response.data;
    }));

    return datasets.reduce((combined, dataset) => {
      combined = [combined].concat(dataset);
      return combined;
    });

}
export default categorizeImpacts;
