document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");

    document.addEventListener("mousemove", function (event) {
        if (event.clientX >= window.innerWidth - 50) {
            sidebar.style.right = "0px";
        }
    });

    sidebar.addEventListener("mouseleave", function () {
        sidebar.style.right = "-60px";
    });

    document.addEventListener("click", function (event) {
        if (!sidebar.contains(event.target)) {
            sidebar.style.right = "-60px";
        }
    });
});
