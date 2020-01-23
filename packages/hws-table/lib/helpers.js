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
