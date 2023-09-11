import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { Gantt } from "dhtmlx-gantt";
import { randomString, getPreviousKey } from "./tools.js";

/* gantt是全局对象，所有的控制都针对它 */
gantt.config.xml_date = "%Y-%m-%d %H:%i";
gantt.i18n.setLocale("cn"); //设置中文
//时间尺度设置
gantt.config.scales = [
    { unit: "day", step: 1, format: "%M %j号, 星期%D" }
];
gantt.init("ganttHere");

function initGlobalPanelNames(d) {
    /* 初始化global_panel_names */

    // 检查对象是否为空
    if (Object.keys(d).length === 0) {
        // 对象为空，添加默认键和值
        const default_panel_id = randomString(16);
        d[default_panel_id] = {
            data: {},
            links: {},
            panel_name: "新面板"
        };
    }

    // 创建底部按钮
    for (const [key, value] of Object.entries(d)) {
        addFooterButton(key, value);
    }
    // 将第一个被选择的按钮背景颜色变白
    changeSelectedPanelButtonColor(Object.keys(d)[0]);
    // 加载第一个按钮的数据
    loadDataInPanel(Object.keys(d)[0]);
}

function loadDataInPanel(panel_id) {
    /* 将panel_id对应的数据加载到gantt中 */
    gantt.clearAll();
    gantt.parse(convertPanelData2Gantt(global_panel_names[panel_id]));
}


// 添加编辑监听器
function enableEdit(button) {
    const saved_button_innerText = button.innerText;
    button.setAttribute('contenteditable', 'true');
    button.focus();
    // 获取选区
    var selection = window.getSelection();

    // 清除所有现有的选区
    selection.removeAllRanges();

    // 创建一个新的选区范围
    var range = document.createRange();

    // 设置范围为按钮内的所有内容
    range.setStart(button, 0);
    range.setEnd(button, button.childNodes.length);

    // 将创建的范围添加到选区
    selection.addRange(range);

    // 监听按键事件
    button.addEventListener('keydown', function (event) {
        // 如果按下了回车键
        if (event.keyCode === 13) {
            finalize(button);
            event.preventDefault();
        }

        // 如果按下了退格键
        if (event.keyCode === 8) {
            button.innerHTML = '';
        }
    });

    // 监听焦点失去事件
    button.addEventListener('blur', function () {
        finalize(button, saved_button_innerText);
    });
}
function finalize(button, old_name) {
    button.setAttribute('contenteditable', 'false');

    if (button.innerHTML.trim() === '') {
        button.innerHTML = old_name;
    } else {
        //将按钮的名称更新到global_panel_names中
        const panel_id = button.id.split("#")[1];
        if (global_panel_names[panel_id] != undefined) {
            global_panel_names[panel_id].panel_name = button.innerHTML;
            loadDataInPanel(panel_id);
        }
    }
    button.removeEventListener('keydown', null);
    button.removeEventListener('blur', null);
}


function addFooterButton(panel_id, panel_info) {
    /* 在底部添加按钮 */
    const addBtn = document.getElementById("addBtn");
    const newBtn = document.createElement("button");
    newBtn.id = "footerButton#" + panel_id;
    newBtn.className = "dataBtn";
    newBtn.innerText = panel_info.panel_name;

    // 在 addBtn 之前插入新按钮
    footer.insertBefore(newBtn, addBtn);

    // 当用户双击按钮时，重新使其可编辑
    newBtn.addEventListener('dblclick', function () {
        enableEdit(newBtn);
        loadDataInPanel(panel_id);
    });
    // 当用户右键是，弹出是否删除的提示
    newBtn.addEventListener('contextmenu', function (event) {
        let previousPanelId = getPreviousKey(global_panel_names, panel_id);
        event.preventDefault();
        const userConfirmed = confirm("确定要删除该面板吗（该决定不可撤销）？");
        if (userConfirmed) {
            //删除数据
            delete global_panel_names[panel_id];
            //删除按钮
            newBtn.remove();
            // 将主页面用上一个页面填充，如果什么都没有则创建一个空数据
            if (previousPanelId === null) {

            } else {

            }
        }
    });
    // 点击事件
    newBtn.addEventListener('click', function () {
        // 删除所有选区
        window.getSelection().removeAllRanges();
        // 刷新数据
        let panel_id = this.id.split("#")[1];
        loadDataInPanel(panel_id);
        // 选择按钮
        changeSelectedPanelButtonColor(panel_id);
    });

    // 鼠标悬浮文本颜色变灰
    newBtn.addEventListener('mouseover', function () {
        // 获取按钮的背景颜色
        const bgColor = getComputedStyle(newBtn).backgroundColor;

        // 检查背景颜色是否为透明
        if (bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') {
            // 改变按钮内文字颜色为灰色
            newBtn.style.color = 'grey';
        }
    });

    // 添加鼠标移出事件，恢复原始文字颜色
    newBtn.addEventListener('mouseout', function () {
        newBtn.style.color = ''; // 使用空字符串来清除行内样式
    });
}

function changeSelectedPanelButtonColor(panel_id) {
    /* 根据id将对应button背景颜色变白，表示已被选择
       只用传面板id即可
    */
    // 遍历footer下的所有按钮，将背景颜色变为透明
    selected_panel_button_id = panel_id;
    const footer = document.getElementById("footer");
    const footerBtns = footer.getElementsByTagName("button");
    for (let i = 0; i < footerBtns.length; i++) {
        footerBtns[i].style.backgroundColor = "transparent";
    }

    const selectedBtn = document.getElementById("footerButton#" + panel_id);
    selectedBtn.style.backgroundColor = "white";
}

function insertEmptyDataPanel() {
    /* 在gantt中插入一个空的数据面板
    会同时改变页面与global_panel_names内的数据
    */
    // 自动生成按钮ID
    const new_panel_id = randomString(16);
    const new_panel_data = {
        data: {},
        links: {},
        panel_name: "新面板"
    };
    global_panel_names[new_panel_id] = new_panel_data;
    //添加按钮
    addFooterButton(new_panel_id, new_panel_data);
    //选定该按钮
    changeSelectedPanelButtonColor(new_panel_id);
    //使按钮可编辑
    enableEdit(document.getElementById("footerButton#" + new_panel_id));
}


function convertPanelData2Gantt(panel_data) {
    /* 将panel_data转换为gantt能识别的格式 */
    const gantt_data = {
        data: [],
        links: []
    };

    for (const [key, value] of Object.entries(panel_data.data)) {
        gantt_data.data.push(value);
    }

    for (const [key, value] of Object.entries(panel_data.links)) {
        gantt_data.links.push(value);
    }
    return gantt_data;
}


var global_panel_names = {}
var selected_panel_button_id = null
/* 初始化global_panel_names */
initGlobalPanelNames(global_panel_names);
gantt.attachEvent("onAfterTaskAdd", function (id, task) {
    /* task 
    id: 任务id
    start_date: 开始时间 Sun Sep 10 2023 00:00:00 GMT+0800 (中国标准时间),
    text:任务文本
    duration: 任务持续时间,天
    如果为子任务，则有 parent: 父任务id
    */
    //在这一步，selected_panel_button_id一定不为null
    const panel_data = global_panel_names[selected_panel_button_id];
    panel_data.data[id] = task;
});

gantt.attachEvent("onAfterTaskUpdate", function (id, task) {
    const panel_data = global_panel_names[selected_panel_button_id];
    panel_data.data[id] = task;
});

gantt.attachEvent("onAfterTaskDelete", function (id) {
    const panel_data = global_panel_names[selected_panel_button_id];
    delete panel_data.data[id];
});

gantt.attachEvent("onAfterLinkAdd", function (id, link) {
    const panel_data = global_panel_names[selected_panel_button_id];
    panel_data.links[id] = link;
});

gantt.attachEvent("onAfterLinkUpdate", function (id, link) {
    const panel_data = global_panel_names[selected_panel_button_id];
    panel_data.links[id] = link;
});

gantt.attachEvent("onAfterLinkDelete", function (id) {
    const panel_data = global_panel_names[selected_panel_button_id];
    delete panel_data.links[id];
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

    addBtn.addEventListener("click", function () {
        insertEmptyDataPanel();
    });
});