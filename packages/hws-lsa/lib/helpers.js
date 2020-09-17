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

export const authenticate = async ({
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

export const checkForm = (form) => {
  const rows = form.querySelectorAll('tbody > tr:nth-child(odd)');
  const groups = form.querySelectorAll('tfoot .js-form-field');

  const errors = [];
  const keys = [];

  rows.forEach((row) => {
    const fields = row.querySelectorAll('.js-form-field');

    const errorData = [];

    const keyData = {
      nodes: [],
      checked: [],
    };

    fields.forEach((field) => {
      if (
        field.name.startsWith('name') ||
        field.name.startsWith('build') ||
        field.name.startsWith('inner') ||
        field.name.startsWith('outer')
      ) {
        if (!field.value) {
          errorData.push(field);
        }
      }

      if (field.name.startsWith('quantity')) {
        const value = Number(field.value);

        if (value <= 0) {
          errorData.push(field);
        }
      }

      if (field.name.startsWith('key')) {
        const [, , column] = field.name.split('-');

        keyData['checked'][column] = field.checked;
        keyData['nodes'].push(field);
      }
    });

    if (!~keyData.checked.findIndex((key) => key === true)) {
      errorData.push(keyData.nodes);
    }

    errors.push(errorData.flat());
    keys.push(keyData.checked);
  });

  groups.forEach((group) => {
    if (group.name.startsWith('group')) {
      const [, column] = group.name.split('-');
      const value = Number(group.value);

      let hasKey = false;

      keys.forEach((row) => {
        if (row[column]) {
          hasKey = true;
        }
      });

      if ((value <= 0 && hasKey) || (value > 0 && !hasKey)) {
        errors.push(group);
      }
    }
  });

  return errors.flat();
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
