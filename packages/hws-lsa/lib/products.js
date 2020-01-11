import { fetchWithTimeout } from './helpers';

const productsUrl = PRODUCTS_API_URL; // eslint-disable-line no-undef

const fetchData = async body => {
  return await fetchWithTimeout(productsUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(r => r.json());
};

export const getBuilds = model =>
  fetchData({
    filter: [
      { name: 'Hersteller', value: 'Iseo' },
      { name: 'Serie', value: model },
    ],
    selector: 'Bauart',
  });

export const getDetails = async reference => {
  return await fetchWithTimeout(
    `${productsUrl}${reference}/?verbose=3`,
  ).then(r => r.json());
};

export const getModels = async () => {
  return await Promise.all([
    fetchData({
      filter: [{ name: 'Hersteller', value: 'Iseo' }],
      selector: 'Serie',
    }),
    fetchData({
      filter: [{ name: 'Hersteller', value: 'Gera' }],
      selector: 'Serie',
    }),
  ]);
};

export const getReferences = (build, model) =>
  fetchData({
    filter: [
      { name: 'Hersteller', value: 'Iseo' },
      { name: 'Serie', value: model },
      { name: 'Bauart', value: build },
    ],
    selector: 'reference',
  });
