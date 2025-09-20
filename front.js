const Log = async (stack, level, packageName, message) => {
  const API_URL = "http://20.244.56.144/evaluation-service/logs";
  const AUTH_TOKEN = "YOUR_AUTH_TOKEN";

  const logData = {
    stack,
    level,
    pkg: packageName,
    message,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify(logData),
    });

    if (!response.ok) {
      console.error(
        "Failed to send log:",
        response.status,
        response.statusText
      );
      return null;
    }

    const result = await response.json();
    console.log("Log created successfully:", result.logID);
    return result;
  } catch (error) {
    console.error("Error sending log:", error);
    return null;
  }
};

export default Log;
