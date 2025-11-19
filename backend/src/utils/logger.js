const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');

// লগ ডিরেক্টরি তৈরি করুন
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const formatLog = (level, message, data = {}) => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    data,
    pid: process.pid
  });
};

const logger = {
  info: (message, data = {}) => {
    const log = formatLog('INFO', message, data);
    console.log(log);
    fs.appendFileSync(path.join(logsDir, 'app.log'), log + '\n');
  },

  error: (message, error, data = {}) => {
    const log = formatLog('ERROR', message, {
      ...data,
      error: error.message,
      stack: error.stack
    });
    console.error(log);
    fs.appendFileSync(path.join(logsDir, 'error.log'), log + '\n');
  },

  warn: (message, data = {}) => {
    const log = formatLog('WARN', message, data);
    console.warn(log);
    fs.appendFileSync(path.join(logsDir, 'app.log'), log + '\n');
  },

  debug: (message, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const log = formatLog('DEBUG', message, data);
      console.log(log);
    }
  }
};

module.exports = logger;