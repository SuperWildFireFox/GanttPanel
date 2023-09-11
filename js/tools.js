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