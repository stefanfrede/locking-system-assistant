export const getSelectedOption = (target) => {
  const options = target.options;
  const selectedIndex = target.selectedIndex;
  const selected = options[selectedIndex];
  return selected.value;
};
