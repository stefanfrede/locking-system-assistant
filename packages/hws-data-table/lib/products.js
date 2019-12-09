const productsUrl = PRODUCTS_API_URL; // eslint-disable-line no-undef

export const getBuilds = async model => {
  try {
    const response = await fetch(productsUrl, {
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
  } catch (error) {
    console.error('Error fetching data with POST: ', error);
  }
};

export const getData = async reference => {
  try {
    const response = await fetch(`${productsUrl}${reference}/?verbose=3`);

    return response.json();
  } catch (error) {
    console.error('Error fetching data with GET: ', error);
  }
};

export const getReferences = async (build, model) => {
  try {
    const response = await fetch(productsUrl, {
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
  } catch (error) {
    console.error('Error fetching data with POST: ', error);
  }
};
