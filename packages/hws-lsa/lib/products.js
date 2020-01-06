import { fetchWithTimeout } from './helpers';

const productsUrl = PRODUCTS_API_URL; // eslint-disable-line no-undef

export const getBuilds = async model => {
  const response = await fetchWithTimeout(productsUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: [
        { name: 'Hersteller', value: 'Iseo' },
        { name: 'Serie', value: model },
      ],
      selector: 'Bauart',
    }),
  });

  return response.json();
};

export const getDetails = async reference => {
  const response = await fetch(`${productsUrl}${reference}/?verbose=3`);

  return response.json();
};

export const getReferences = async (build, model) => {
  const response = await fetchWithTimeout(productsUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: [
        { name: 'Hersteller', value: 'Iseo' },
        { name: 'Serie', value: model },
        { name: 'Bauart', value: build },
      ],
      selector: 'reference',
    }),
  });

  return response.json();
};
