export const showError = (prop: {
  title: string;
  message: string;
  location: string;
}) => {
  const tmpText = `${prop.title}\n${prop.message}\n${location}`;
  alert(tmpText);
};
