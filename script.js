import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { Gantt } from "dhtmlx-gantt";

gantt.config.xml_date = "%Y-%m-%d %H:%i";
gantt.init("ganttHere");
gantt.parse({
    data: [
        { id: 1, text: "Project #1", start_date: null, duration: null, parent: 0, progress: 0, open: true },
        { id: 2, text: "Task #1", start_date: "2019-08-01 00:00", duration: 5, parent: 1, progress: 1 },
        { id: 3, text: "Task #2", start_date: "2019-08-06 00:00", duration: 2, parent: 1, progress: 0.5 },
        { id: 4, text: "Task #3", start_date: null, duration: null, parent: 1, progress: 0.8, open: true },
        { id: 5, text: "Task #3.1", start_date: "2019-08-09 00:00", duration: 2, parent: 4, progress: 0.2 },
        { id: 6, text: "Task #3.2", start_date: "2019-08-11 00:00", duration: 1, parent: 4, progress: 0 }
    ],
    links: [
        { id: 1, source: 2, target: 3, type: "0" },
        { id: 2, source: 3, target: 4, type: "0" },
        { id: 3, source: 5, target: 6, type: "0" }
    ]
});


document.addEventListener('DOMContentLoaded', function () {
    const footer = document.getElementById("footer");
    /* 添加footer的滚动响应 */
    footer.addEventListener("wheel", function (event) {
        this.scrollLeft += (event.deltaY * 1); // 你可以调整这里的40来控制滚动速度
        // 防止页面本身的滚动
        event.preventDefault();
    });



    /* 为按钮添加点击事件 */
    const addBtn = document.getElementById("addBtn");

    let btnCount = 0;

    addBtn.addEventListener("click", function () {
        // 自动生成按钮ID
        const newBtnId = "dataBtn" + (++btnCount);

        // 创建新按钮
        const newBtn = document.createElement("button");
        newBtn.id = newBtnId;
        newBtn.className = "dataBtn";
        newBtn.innerText = "新数据" + btnCount;

        // 在 addBtn 之前插入新按钮
        footer.insertBefore(newBtn, addBtn);
    });
});