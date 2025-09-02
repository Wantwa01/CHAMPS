export const generateOtp = (length = 6) => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
};

export const expiryFromNow = (minutes = 10) => {
    const now = new Date();
    return new Date(now.getTime() + minutes * 60000);
};