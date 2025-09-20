const Log = async (stack = "", level = "info", pkg = "", message = "") => {
  const API_URL = "http://20.244.56.144/evaluation-service/logs";
  const AUTH_TOKEN = process.env.REACT_APP_LOG_AUTH || "";
  const payload = { stack, level, pkg, message };
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
};

export default Log;
