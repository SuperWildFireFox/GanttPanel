const forge = require('node-forge');

// 预先加密的数据和 AES 密钥
//AES加密后的firebaseConfig
const encryptedFirebaseConfig = 'dVz/EsAY97tOih1THNWRSAwAL09EeQotpWz2ZOLQtiSzbAnWZ0aXf/bJ8qPczhJjPQe5BP5uQvQFqyhBFaKF4N4ENx2rVQpijH5cKXvgtWh5uLRyZlfsq5JmJh10reiMFOBedsb91PzAzmW0cPw2mdn9D9eMXtWeEPaRKG5aG6ULiVjWhRGUW05qlWljtb/+uGyyGsQoYNeNJOuWsatNjC0YPFPjMXr8kaCs0qZ+JhoEt1eSTTCXtMwwUMvwqRSm7BYx7em+O7RpByQUGWrQWYJ2eiqdfRCzfos/bWxNRD6czQBOzJcOKqJz1vxDubXRsel+RWefn+sxcPUC28H6R9z5JdvSNi1fb7QUjayqSD5azWYc6juPVTkdyToSriQQAADOXDeoRXVdggbGsprDHxeCLZtJxGViSJGG8awVpEXE1pzAcQComfgwcuVG/LubyMzLXXV4gsfQJc4FI+GkIb5Be4x9DW6jTy3OElRNj8I=';  // 使用 AES 加密后的 firebaseConfig
//RSA加密后的AES密钥
const encryptedAESKey = 'T3QYRNVa/Ov1ETQ24uKI36hJYxWcRNKkk0ZnstncymXkAa7jd9Zd1elwlOeOGgxQaWm0W4hGiIM41uUtUGEWpj0Ds0iF3+YdyP9JPzBm6gLaUDuD/rmDTXF84Tj/HyDXBHTGAxdNUu0QOap3Nve7DbHcHlfiGdV+g6MbBSsZwoXV5cXxmMdCj4rmKdFXSBIDmW5yQZYqdf7Gxbavl5zOdg861aMhaaIfuBBkZ11qODo4kFDkI+ZlUURoq/Cxq1BGET+ck08gPLi5TGZyD5WVQRZ70rFvqfli2KHilX4umZzT8R8X1txDFpIGUIfDbYhrSooy3cszH860j4zMoOrbNw==';  // 使用 RSA 加密后的 AES 密钥

// 解密 AES 密钥
function decryptRSA(privateKey, encryptedKey) {
    const decoded = forge.util.decode64(encryptedKey);
    return privateKey.decrypt(decoded, 'RSA-OAEP');
}

// 使用 AES 解密数据
function decryptAES(key, encryptedText) {
    const decipher = forge.cipher.createDecipher('AES-ECB', key);
    decipher.start();
    decipher.update(forge.util.createBuffer(forge.util.decode64(encryptedText)));
    decipher.finish();
    return decipher.output.toString();
}

// 检查私钥是否能成功解密数据
function checkKey(privateKeyPem) {
    if (typeof privateKeyPem != "string") {
        return;
    }
    function ensureNewline(str) {
        let result = str;
        if (!result.startsWith("\n")) {
            result = "\n" + result;
        }
        if (!result.endsWith("\n")) {
            result += "\n";
        }
        return result;
    }

    try {
        //格式要求很严格，开头与结尾的换行都不能缺
        const enteredPrivateKeyPem = ensureNewline(privateKeyPem);
        console.log('私钥:', enteredPrivateKeyPem);
        const enteredPrivateKey = forge.pki.privateKeyFromPem(enteredPrivateKeyPem);
        console.log('私钥对象:', enteredPrivateKey);

        const decryptedAESKey = decryptRSA(enteredPrivateKey, encryptedAESKey);
        console.log('成功解密 AES 密钥:', decryptedAESKey);
        const decryptedFirebaseConfig = decryptAES(decryptedAESKey, encryptedFirebaseConfig);
        console.log('成功解密 firebaseConfig 数据:', decryptedFirebaseConfig);
        const maxExpires = new Date(2147483647000).toUTCString();
        document.cookie = `privateKey=${encodeURIComponent(enteredPrivateKeyPem)}; expires=` + maxExpires;
        document.getElementById('passDialog').style.display = 'none';
        console.log('成功解密:', JSON.parse(decryptedFirebaseConfig));
    } catch (e) {
        console.log(e)
        alert('解密失败或密钥错误');
        document.getElementById('passDialog').style.display = 'flex';
    }
}
document.addEventListener('DOMContentLoaded', (event) => {
    const button = document.getElementById("passDialogButton");
    button.addEventListener('click', function () {
        const fileInput = document.getElementById('passDialogFile');
        const file = fileInput.files[0];
        if (!file) {
            alert('请上传密匙文件');
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            const privateKeyPem = e.target.result;
            checkKey(privateKeyPem);
        };
        reader.readAsText(file);
    });

    button.addEventListener('click', checkKey);
});

// 初始化
window.onload = function () {
    const cookiePrivateKey = document.cookie.split('; ').find(row => row.startsWith('privateKey='));

    if (cookiePrivateKey) {
        const privateKeyPem = decodeURIComponent(cookiePrivateKey.split('=')[1]);
        console.log('cookie中的私钥:', privateKeyPem);
        checkKey(privateKeyPem);
    } else {
        document.getElementById('passDialog').style.display = 'flex';
    }
};