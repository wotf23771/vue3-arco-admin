type TargetContext = '_self' | '_parent' | '_blank' | '_top';

export const openWindow = (
    url: string,
    opts?: { target?: TargetContext; [key: string]: any }
) => {
    const {target = '_blank', ...others} = opts || {};
    window.open(
        url,
        target,
        Object.entries(others)
            .reduce((preValue: string[], curValue) => {
                const [key, value] = curValue;
                return [...preValue, `${key}=${value}`];
            }, [])
            .join(',')
    );
};

export const regexUrl = new RegExp(
    '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
    'i'
);

export function getFileSize(size: number) {
    if (!size) {
        return '0B';
    }
    let num = 1024.00; // byte
    if (size < num) {
        return size + 'B';
    }
    if (size < Math.pow(num, 2)) {
        return (size / num).toFixed(2) + 'KB';
    } // kb
    if (size < Math.pow(num, 3)) {
        return (size / Math.pow(num, 2)).toFixed(2) + 'MB';
    } // M
    if (size < Math.pow(num, 4)) {
        return (size / Math.pow(num, 3)).toFixed(2) + 'GB';
    } // G
    return (size / Math.pow(num, 4)).toFixed(2) + 'TB'; // T
}

export default null;
