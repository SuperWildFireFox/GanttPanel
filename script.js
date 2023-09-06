// 等待 DOM 完全加载
document.addEventListener("DOMContentLoaded", function () {
    // 选择 id 为 "clickButton" 的元素
    const button = document.getElementById("clickButton");

    // 添加点击事件监听器
    button.addEventListener("click", function () {
        // 弹出 "hello, world" 提醒
        alert("hello, world");
    });
});