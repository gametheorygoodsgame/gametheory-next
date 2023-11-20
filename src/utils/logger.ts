const isProduction = process.env.NODE_ENV === 'production';

const logger = {
    info: (...args: any[]) => {
        if (!isProduction) {
            console.log(`[INFO] ${args}`);
        }
    },
    debug: (...args: any[]) => {
        if (!isProduction) {
            console.log(`[DEBUG] ${args}`);
        }
    },
    error: (...args: any[]) => {
        console.error(`[ERROR] ${args}`);
    },
    warn: (...args: any[]) => {
        console.warn(`[WARN] ${args}`);
    },
};

export { logger };
