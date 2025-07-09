export const Logger = {
  log: (message, metadata = {}) => {
    const logs = JSON.parse(localStorage.getItem('logs')) || [];
    logs.push({ timestamp: new Date().toISOString(), message, ...metadata });
    localStorage.setItem('logs', JSON.stringify(logs));
  }
};
