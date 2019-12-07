export const GET = async ({ reference, url }) => {
  try {
    const response = await fetch(`${url}${reference}/?verbose=3`);

    return response.json();
  } catch (error) {
    console.error('Error fetching data with GET: ', error);
  }
};

export const POST = async ({ body, url }) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    return response.json();
  } catch (error) {
    console.error('Error fetching data with POST: ', error);
  }
};

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
