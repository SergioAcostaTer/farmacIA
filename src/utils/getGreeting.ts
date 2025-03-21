export const getGreeting = () => {
  const time = new Date().getHours();

  if (time < 12) {
    return "Buenos días";
  } else if (time < 18) {
    return "Buenas tardes";
  } else {
    return "Buenas noches";
  }
};
