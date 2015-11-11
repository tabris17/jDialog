// main

require.config({
    paths: {
        "jdialog": "../../src/jdialog/jdialog",
        "jquery": "http://code.jquery.com/jquery-1.11.3.min"
    }
});

require(["jdialog"], function (jDialog) {
    var myDialog = new jDialog();
    myDialog.register();
    $(function () {
        window.alert("页面加载完毕");
    });
    $("#btn-alert").removeAttr("disabled").click(function () {
        window.alert("你好\n\t世界");
    });
});
