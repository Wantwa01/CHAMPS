const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };

const getLevel = () => {
    const lvl = (process.env.LOG_LEVEL || 'info').toLowerCase();
    return LEVELS[lvl] || LEVELS.info;
};

const enabled = (level) => LEVELS[level] >= getLevel();

const format = (level, message, meta) => {
    const timestamp = new Date().toISOString();
    const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    if (!meta) return base;
    try {
        return `${base} | ${typeof meta === 'string' ? meta : JSON.stringify(meta)}`;
    } catch {
        return base;
    }
};

export const logger = {
    debug: (message, meta) => { if (enabled('debug')) console.debug(format('debug', message, meta)); },
    info: (message, meta) => { if (enabled('info')) console.info(format('info', message, meta)); },
    warn: (message, meta) => { if (enabled('warn')) console.warn(format('warn', message, meta)); },
    error: (message, meta) => { if (enabled('error')) console.error(format('error', message, meta)); }
};