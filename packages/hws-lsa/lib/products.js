import { fetchWithTimeout } from './helpers';

const productsUrl = PRODUCTS_API_URL; // eslint-disable-line no-undef

const fetchData = async (body) => {
  return await fetchWithTimeout(productsUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((r) => r.json());
};

const authenticate = async ({
  username = HWS_USERNAME, // eslint-disable-line no-undef
  password = HWS_PASSWORD, // eslint-disable-line no-undef
} = {}) => {
  // eslint-disable-next-line no-undef
  return await fetchWithTimeout(AUTH_API_URL, {
    credentials: 'include',
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then((r) => r.json());
};

export const getBuilds = (model) =>
  fetchData({
    filter: [
      { name: 'Hersteller', value: 'Iseo*' },
      { name: 'Serie', value: model },
    ],
    selector: 'Bauart',
  });

export const getDetails = async (reference) => {
  // Switch to turn on authentification for testing purposes
  if (sessionStorage.getItem('hws-authenticate')) {
    await authenticate();
  }

  return await fetchWithTimeout(`${productsUrl}${reference}/?verbose=4`, {
    credentials: 'include',
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then((r) => r.json());
};

export const getModels = () =>
  fetchData({
    filter: [{ name: 'Schließanlagenfähig', value: 'ja' }],
    selector: 'Serie',
  });

export const getKeyReferences = (model) =>
  fetchData({
    filter: [
      { name: 'Hersteller', value: 'Iseo*' },
      { name: 'Serie', value: model },
      { name: 'Schlüsseltyp', value: 'Gruppenschlüssel' },
      { name: 'Erstbestellung', value: 'ja' },
    ],
    selector: 'reference',
  });

export const getReferences = (build, model) =>
  fetchData({
    filter: [
      { name: 'Hersteller', value: 'Iseo*' },
      { name: 'Serie', value: model },
      { name: 'Bauart', value: build },
    ],
    selector: 'reference',
  });
