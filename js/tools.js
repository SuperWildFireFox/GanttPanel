export function randomString(length) {
    /*  js生成随机字符串  */
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomCharCode = Math.floor(Math.random() * 26) + 97; // 生成一个介于 97 和 122 之间的随机整数（对应 'a' 到 'z'）
        result += String.fromCharCode(randomCharCode);
    }
    return result;
}

export function getPreviousKey(obj, targetKey) {
    /* 获取对象中指定键的前一个键 */
    const keys = Object.keys(obj);
    const index = keys.indexOf(targetKey);

    // 如果键不存在或者是第一个键，则返回 null
    if (index <= 0) return null;

    // 返回前一个键
    return keys[index - 1];
}

export function getNextKey(obj, targetKey) {
    /* 获取对象中指定键的后一个键 */
    const keys = Object.keys(obj);
    const index = keys.indexOf(targetKey);
    // 如果键不存在或者是最后一个键，则返回 null
    if (index < 0 || index === keys.length - 1) return null;

    // 返回后一个键
    return keys[index + 1];
}

export function filterNonDollarFields(obj) {
    /* 过滤掉对象中以 $ 开头的键 */
    const newObj = {};
    for (const key in obj) {
        if (!key.startsWith('$')) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

export function convertDataToString(obj) {
    const newObj = { ...obj };
    if (newObj.start_date instanceof Date) {
        newObj.start_date = newObj.start_date.toString();
    }

    if (newObj.end_date instanceof Date) {
        newObj.end_date = newObj.end_date.toString();
    }
    return newObj;
}

export function convertStringToData(obj) {
    const newObj = { ...obj };
    for (const key in newObj) {
        if (typeof newObj[key].start_date === 'string') {
            newObj[key].start_date = new Date(newObj[key].start_date);
        }

        if (typeof newObj[key].end_date === 'string') {
            newObj[key].end_date = new Date(newObj[key].end_date);
        }
    }
    return newObj;
}

// 设置cookie，默认过期时间1年
export function setCookie(name, value) {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1); // 设置为从现在起到未来的一年时间
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// 获取Cookie
export function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}