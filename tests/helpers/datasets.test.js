import categorizeImpacts, { getImpact } from '../../helpers/datasets';

describe('getImpact function', () => {
  test('should return low impact for dataset size <= 1,000,000', () => {
    const dataset_config = { dataset_size: 1000000, config_name: 'Dataset A' };
    const impact = getImpact(dataset_config);
    expect(impact).toEqual({ name: 'Dataset A', size: 1000000, impact: 'low' });
  });

  test('should return medium impact for dataset size <= 9,999,999', () => {
    const dataset_config = { dataset_size: 5000000, config_name: 'Dataset B' };
    const impact = getImpact(dataset_config);
    expect(impact).toEqual({
      name: 'Dataset B',
      size: 5000000,
      impact: 'medium',
    });
  });

  test('should return high impact for dataset size > 9,999,999', () => {
    const dataset_config = { dataset_size: 15000000, config_name: 'Dataset C' };
    const impact = getImpact(dataset_config);
    expect(impact).toEqual({
      name: 'Dataset C',
      size: 15000000,
      impact: 'high',
    });
  });
});

describe('categorizeImpacts function', () => {
  test('should return an array of impacts for multiple dataset configurations', () => {
    const dataset = {
      cardData: {
        dataset_info: [
          { dataset_size: 500000, config_name: 'Dataset A' },
          { dataset_size: 8000000, config_name: 'Dataset B' },
          { dataset_size: 12000000, config_name: 'Dataset C' },
        ],
      },
    };
    const impacts = categorizeImpacts(dataset);
    expect(impacts).toEqual([
      { name: 'Dataset A', size: 500000, impact: 'low' },
      { name: 'Dataset B', size: 8000000, impact: 'medium' },
      { name: 'Dataset C', size: 12000000, impact: 'high' },
    ]);
  });

  test('should return impact object for single dataset configuration', () => {
    const dataset = {
      cardData: {
        dataset_info: { dataset_size: 7500000, config_name: 'Dataset X' },
      },
    };
    const impact = categorizeImpacts(dataset);
    expect(impact).toEqual({
      name: 'Dataset X',
      size: 7500000,
      impact: 'medium',
    });
  });

  test('should return undefined if dataset info is missing', () => {
    const dataset = { cardData: {} };
    const impact = categorizeImpacts(dataset);
    expect(impact).toEqual(null);
  });
});
