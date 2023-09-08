import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child } from "firebase/database";
import { firebaseConfig } from "./data.js";

// 初始化Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", function () {
    const uploadBtn = document.getElementById("uploadBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const result = document.getElementById("result");

    // 生成随机的JSON数据
    const generateRandomJSON = () => {
        return JSON.stringify({
            name: "John",
            age: Math.floor(Math.random() * 100),
            city: "New York"
        });
    };

    // 上传JSON到Firebase
    uploadBtn.addEventListener("click", async () => {
        const randomJSON = generateRandomJSON();
        set(ref(database, "randomData"), randomJSON);
    });

    // 从Firebase下载JSON
    downloadBtn.addEventListener("click", async () => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `randomData`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    });
});
