const isProduction = process.env.NODE_ENV === 'production';

const logger = {
    info: (...args: any[]) => {
        if (!isProduction) {
            // eslint-disable-next-line no-console
            console.log(...args);
        }
    },
    debug: (...args: any[]) => {
        if (!isProduction) {
            // eslint-disable-next-line no-console
            console.debug(...args);
        }
    },
    error: (...args: any[]) => {
        // eslint-disable-next-line no-console
        console.error(...args);
    },
    warn: (...args: any[]) => {
        // eslint-disable-next-line no-console
        console.warn(...args);
    },
};

export { logger };
