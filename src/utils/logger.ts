const isProduction = process.env.NODE_ENV === 'production';

const logger = {
    info: (...args: any[]) => {
        if (!isProduction) {
            // eslint-disable-next-line no-console
            console.log(`[INFO] ${args}`);
        }
    },
    debug: (...args: any[]) => {
        if (!isProduction) {
            // eslint-disable-next-line no-console
            console.log(`[DEBUG] ${args}`);
        }
    },
    error: (...args: any[]) => {
        // eslint-disable-next-line no-console
        console.error(`[ERROR] ${args}`);
    },
    warn: (...args: any[]) => {
        // eslint-disable-next-line no-console
        console.warn(`[WARN] ${args}`);
    },
};

export { logger };
