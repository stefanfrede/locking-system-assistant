export const fetchWithTimeout = (uri, options = {}, time = 5000) => {
  const controller = new AbortController();
  const config = { ...options, signal: controller.signal };

  setTimeout(() => {
    controller.abort();
  }, time);

  return fetch(uri, config)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      return response;
    })
    .catch((error) => {
      if (error.name === 'AbortError') {
        throw new Error('Response timed out');
      }

      throw new Error(error.message);
    });
};

export const serialize = (form) => {
  const serialized = {
    rows: [],
    keys: {
      errors: [],
      quantities: [],
    },
  };

  const rows = form.querySelectorAll('tbody > tr');

  const footerFields = form.querySelectorAll('tfoot .js-form-field');

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const fields = row.querySelectorAll('.js-form-field');

    const data = {
      errors: [],
      keys: {},
      length: {
        inner: '',
        outer: '',
      },
      name: '',
      quantity: 0,
      type: '',
    };

    const keys = [];

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      if (field.name.includes('build')) {
        data['type'] = field.value;

        if (!field.value) {
          data.errors.push(field);
        }
      }

      if (field.name.includes('door')) {
        data['name'] = field.value;

        if (!field.value) {
          data.errors.push(field);
        }
      }

      if (field.name.includes('inner')) {
        data['length']['inner'] = field.value;

        if (!field.value) {
          data.errors.push(field);
        }
      }

      if (field.name.includes('outer')) {
        data['length']['outer'] = field.value;

        if (!field.value) {
          data.errors.push(field);
        }
      }

      if (field.name.includes('quantity')) {
        data['quantity'] = field.value;

        if (field.value <= 0) {
          data.errors.push(field);
        }
      }

      if (field.name.includes('key')) {
        const [, column] = field.name.split('-');

        data['keys'][column] = field.checked;

        if (!field.checked) {
          keys.push(field);
        }
      }
    }

    if (!~Object.values(data.keys).findIndex((key) => key === true)) {
      data.errors = [...data.errors, ...keys];
    }

    serialized.rows.push(data);
  }

  const keys = serialized.rows.map((row) => row.keys);

  for (let i = 0; i < footerFields.length; i++) {
    const field = footerFields[i];

    if (field.name.includes('quantity')) {
      serialized.keys.quantities.push(Number(field.value));

      let hasKey = false;

      keys.forEach((key) => {
        if (key[i + 1]) {
          hasKey = true;
        }
      });

      if ((field.value <= 0 && hasKey) || (field.value > 0 && !hasKey)) {
        serialized.keys.errors.push(field);
      }
    }
  }

  return serialized;
};

export const slugify = (str) => {
  return str
    .split('')
    .reduce((acc, cur) => {
      return acc + cur.replace(/\s/g, '-');
    }, '')
    .replace(/--/g, '-')
    .toLowerCase()
    .trim();
};

export const uuidv4 = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  );
