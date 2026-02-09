const hour = new Date().getHours();

export const greetingTime = () => {

    let greeting = "";

    if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }
  return greeting;
}

export const today = new Date().toLocaleDateString(
    "en-US", { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
});