import { fetchWithTimeout } from './helpers';

const cartUrl = CART_API_URL; // eslint-disable-line no-undef
const printUrl = PRINT_API_URL; // eslint-disable-line no-undef
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

export const getBuilds = (model) =>
  fetchData({
    filter: [
      { name: 'Hersteller', value: 'Iseo*' },
      { name: 'Serie', value: model },
    ],
    selector: 'Bauart',
  });

export const getDetails = async (reference) => {
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
      { name: 'Produktart', value: 'Hauptschlüssel' },
      { name: 'Produktgruppe', value: 'Schlüssel' },
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

export const addToCart = async ({ body }) => {
  return await fetchWithTimeout(cartUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((r) => r.json());
};

const getFileNameFromContentDispostionHeader = function (header) {
  const contentDispostion = header.split(';');
  const fileNameToken = `filename*=UTF-8''`;

  let fileName = 'schliessanlage.pdf';

  for (let thisValue of contentDispostion) {
    if (thisValue.trim().indexOf(fileNameToken) === 0) {
      fileName = decodeURIComponent(
        thisValue.trim().replace(fileNameToken, ''),
      );

      break;
    }
  }

  return fileName;
};

export const getPdf = async ({ body }) => {
  return await fetchWithTimeout(printUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(async (res) => ({
      filename: getFileNameFromContentDispostionHeader(
        res.headers.get('content-disposition'),
      ),
      blob: await res.blob(),
    }))
    .then((resObj) => {
      // It is necessary to create a new blob object with mime-type explicitly
      // set for all browsers except Chrome, but it works for Chrome too.
      const newBlob = new Blob([resObj.blob], { type: 'application/pdf' });

      // MS Edge and IE don't allow using a blob object directly as link href,
      // instead it is necessary to use msSaveOrOpenBlob
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
      } else {
        // For other browsers: create a link pointing to the ObjectURL
        // containing the blob.
        const objUrl = window.URL.createObjectURL(newBlob);

        let link = document.createElement('a');
        link.href = objUrl;
        link.download = resObj.filename;
        link.click();

        // For Firefox it is necessary to delay revoking the ObjectURL.
        setTimeout(() => {
          window.URL.revokeObjectURL(objUrl);
        }, 250);
      }
    })
    .catch((error) => {
      console.error('DOWNLOAD ERROR', error);
    });
};
