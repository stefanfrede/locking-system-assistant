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
  const serialized = [];
  const rows = form.querySelectorAll('tbody > tr');

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const fields = row.querySelectorAll('.js-form-field');

    const data = {
      keys: {},
      length: {
        inner: '',
        outer: '',
      },
      name: '',
      quantity: 0,
      type: '',
    };

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      if (field.name.includes('build')) {
        data['type'] = field.value;
      }

      if (field.name.includes('door')) {
        data['name'] = field.value;
      }

      if (field.name.includes('inner')) {
        data['length']['inner'] = field.value;
      }

      if (field.name.includes('outer')) {
        data['length']['outer'] = field.value;
      }

      if (field.name.includes('quantity')) {
        data['quantity'] = field.value;
      }

      if (field.name.includes('key')) {
        const [, column] = field.name.split('-');

        data['keys'][column] = field.checked;
      }
    }

    serialized.push(data);
  }

  return serialized;
};
