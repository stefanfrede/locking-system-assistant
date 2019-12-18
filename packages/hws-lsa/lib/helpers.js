export const deselectOption = target => {
  const selected = getSelectedOption(target);
  const options = Array.from(target.options);
  const option = options.find(option => option.value === selected);

  if (option.value) {
    option.selected = false;
  }
};

export const getSelectedOption = target => {
  const options = target.options;
  const selectedIndex = target.selectedIndex;
  const selected = options[selectedIndex];
  return selected.value;
};

export const serialize = form => {
  const serialized = {
    cylinders: [],
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

    if (!~Object.values(data.keys).findIndex(key => key === true)) {
      data.errors = [...data.errors, ...keys];
    }

    serialized.cylinders.push(data);
  }

  const keys = serialized.cylinders.map(row => row.keys);

  for (let i = 0; i < footerFields.length; i++) {
    const field = footerFields[i];

    if (field.name.includes('quantity')) {
      serialized.keys.quantities.push(Number(field.value));

      let hasKey = false;

      keys.forEach(key => {
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
