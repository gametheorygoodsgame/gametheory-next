export const getCookie = (name: string) => {
    const cookies = document.cookie.split(';');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${name}=`)) {
            return cookie.substring(name.length + 1);
        }
    }
    return '';
};
