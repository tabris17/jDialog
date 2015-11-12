# jDialog

## 简介
一款基于 `jQuery` 的网页对话框组件。可以替换浏览器内置的 `window.alert()`、`window.confirm()`、`window.prompt()` 方法。也支持自定义对话框内容和样式；支持 `textbox`、`checkbox`、`textarea` 等内置组件。

## 用法

`jDialog` 运行需要 `jQuery` 支持。加载 `jdialog.js` 之前必须先加载 `jquery` 。HTML 文件代码如下：

	<!-- sync.html -->
    <script src="http://code.jquery.com/jquery-1.11.3.min.js" type="text/javascript"></script>
    <script src="jdialog/jdialog.min.js" type="text/javascript"></script>
	<script type="text/javascript">
		var myDialog = new jDialog();
	    myDialog.register();
	    window.alert("This is jDialog");
	</script>

`jDialog` 也支持 AMD 异步方式加载。HTML 文件代码如下：

	<!-- async.html -->
	<script src="http://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.20/require.min.js" type="text/javascript" defer async="true" data-main="js/main"></script>

脚本代码如下：

	// js/main.js
	require.config({
	    paths: {
	        "jdialog": "jdialog/jdialog.min",
	        "jquery": "http://code.jquery.com/jquery-1.11.3.min"
	    }
	});
	
	require(["jdialog"], function (jDialog) {
	    var myDialog = new jDialog();
	    myDialog.register();
		$(function () {
	    	window.alert("This is jDialog");
		});
	});

对话框由几个部分组成：

1. 标题区<br>
显示 `.message` 属性的文本内容。如果对话框可以拖动，鼠标按住该区域可以拖动对话框。关闭按钮在标题区内。
2. 用户区<br>
用于展示用户内容，包含消息区和自定义区。该区域宽和高可以由 `.width` 和 `.height` 属性定义。
3. 消息区<br>
按照文本格式显示 `.message` 属性的文本内容。
4. 自定义区<br>
显示 `.body` 属性定义的内容。
5. 底部按钮区<br>
显示 `.buttons` 属性定义的按钮。按钮点击后将触发对话框的 `onclose` 事件。

## API

### 对象属性

`.width`<br>
Type: Integer<br>
对话框用户区域宽度。

`.height`<br>
Type: Integer<br>
对话框用户区域高度。

`.message`<br>
Type: String<br>
对话框展示的消息文本。

`.title`<br>
Type: String<br>
对话框展示的标题文本。

`.body`<br>
Type: Array | String | Element<br>
对话框自定义区的内容。属性类型可以是以下三种：

- 数组<br>
表示区域内容是内置组件。数组的元素是组件的配置信息。
- 字符串<br>
表示区域内容是 HTML 代码。
- HTML 元素<br>
表示区域内容是 HTML 元素。

`.buttons`<br>
Type: JSON Object<br>
定义按钮的键值对。键名表示按钮的ID，值是用于表示按钮各个属性的键值对。下列代码定义了“是”、“否”、“取消”三个按钮：

	{
        yes:      {text: "是", primary: true, default: true},
        no:       {text: "否", primary: true},
        cancel:   {text: "取消", cancel: true}
    }

按钮的属性包括：

- primary<br>
Type: Boolean<br>
表示按钮是否为主按钮。主按钮元素会添加 `dialog-button-primary` 类名，在 UI 表现上会着重体现。
- default<br>
Type: Boolean<br>
表示按钮是否为缺省按钮。缺省按钮元素会添加 `dialog-button-default` 类名，按钮响应回车按键事件。
- cancel<br>
Type: Boolean<br>
表示按钮是否为取消按钮。取消按钮元素会添加 `dialog-button-cancel` 类名，按钮响应 ESC 按键事件。
- text<br>
Type: String<br>
按钮上显示的文字。
- class<br>
Type: String<br>
按钮元素要添加的类名。

`.position`<br>
Type: String<br>
用于定义对话框在当前文档可视区域内的位置。由两个值组成，分别定义水平位置和垂直位置：

值 | 描述
------ | -------
top left<br>top center<br>top right<br>center left<br>center center<br>center right<br>bottom left<br>bottom center<br>bottom right | 第一个值表示水平位置，可以是 `left`、`right` 或 `center`；<br>第二个值表示垂直位置，可以是 `top`、`bottom` 或 `center`。
*x*% *y*% | 相对定位。<br>第一个值表示水平位置，第二个值表示垂直位置。<br>左上角是 `0% 0%`，右下角是 `100% 100%`。
*x*pos *y*pos | 绝对定位。<br>第一个值表示水平位置，第二个值表示垂直位置。<br>左上角是 `0 0`（`0px 0px`）。单位是 `px` 或其他 CSS 允许的长度单位。<br>可以和相对定位混用。

默认值是 `center center`。如果只定义了一个值，那么第二个值默认为 `center`。


`.modal`<br>
Type: Boolean<br>
表示对话框是否为模态对话框。

`.closable`<br>
Type: Boolean<br>
表示对话框是否允许关闭。如果为 `false`，则关闭按钮不可用。

`.draggable`<br>
Type: Boolean<br>
表示对话框是否可以拖动。

`.animation`<br>
Type: Boolean<br>
表示对话框显示和关闭时是否有动画效果。

`.theme`<br>
Type: String<br>
对话框使用的主题名称。

### 构造函数

`jDialog()`<br>
`jDialog(theme)`

- `theme`<br>
Type: String
对话框主题名称。如果没有提供该参数，则默认主题为 `default`。

### 初始化对话框

`.init()`<br>
`.init(message)`<br>
`.init(options)`<br>
`.init(onclose)`<br>
`.init(options, onclose)`<br>
`.init(message, onclose)`

参数：

- `message`<br>
Type: String<br>
对话框展示的消息文本。 
- `options`<br>
Type: JSON Object<br>
对话框选项键值对。键名是对话框对象的属性名，值是属性对应的值。比如：

		{
			title: "标题",
			message: "消息",
			buttons: jDialog.BUTTON_OK_CANCEL,
			closable: false,
			modal: false,
			draggable: false
		}

- `onclose`<br>
Type: Function<br>
对话框关闭事件的处理函数。函数接受一个 `result` 参数，表示响应按钮的名称。标题栏关闭按钮的名称为 `close`，按钮的名称由 `.buttons` 属性定义。函数返回一个布尔值，表示是否允许关闭对话框。无返回值时，默认表示允许关闭对话框。处理函数可以通过 `this` 对象来访问当前对话框对象。

		(new jDialog()).show("This is a message", function (result) {
			if (result != "ok") {	// 如果点击的不是“确定”按钮则不允许关闭对话框。
				return false;
			}
			console.log(this.message);	// 控制台输出 "This is a message"。
		});

返回值：<br>
Type: jDialog Object<br>
方法返回当前对象。

### 显示对话框

创建并显示对话框。

`.show()`<br>
`.show(message)`<br>
`.show(options)`<br>
`.show(onclose)`<br>
`.show(options, onclose)`<br>
`.show(message, onclose)`

参数：

- `message`<br>
Type: String<br>
对话框展示的消息文本。 
- `options`<br>
Type: JSON Object<br>
对话框选项。和 `.init()` 方法的格式一致。
- `onclose`<br>
Type: Function<br>
对话框关闭时的回调函数。函数定义和 `.init()` 方法一致。

返回值：<br>
Type: jDialog Object<br>
方法返回当前对象。

### 更新对话框

重新渲染和定位当前的对话框。

`.update()`<br>
`.update(message)`<br>
`.update(options)`<br>
`.update(onclose)`<br>
`.update(options, onclose)`<br>
`.update(message, onclose)`

参数：

- `message`<br>
Type: String<br>
对话框展示的消息文本。 
- `options`<br>
Type: JSON Object<br>
对话框选项。和 `.init()` 方法的格式一致。
- `onclose`<br>
Type: Function<br>
对话框关闭时的回调函数。函数定义和 `.init()` 方法一致。

返回值：<br>
Type: jDialog Object<br>
方法返回当前对象。

### 关闭对话框

关闭当前对话框，并将对话框从当前文档中移除。

`.close()`

返回值：<br>
Type: jDialog Object<br>
方法返回当前对象。

### 对话框是否显示

返回当前对话框是否为显示状态。

`.isShown()`

返回值：<br>
Type: Boolean<br>
如果对话框是显示状态，方法返回 `true`，否则返回 `false`。

### 获取组件数据

获取对话框内组件的值。只有当 `.isShown()` 返回值为 `true` 时，才能获取组件的值。

`.getData(name)`

参数：

- `name`<br>
Type: String<br>
组件的名称。

返回值：<br>
Type: String<br>
返回组件的值。

### 注册系统对话框
用 jDialog 对象替换浏览器默认的 `window.alert()`、`window.confirm()`、`window.prompt()` 方法。

`.register()`

返回值：<br>
Type: jDialog Object<br>
方法返回当前对象。

### 恢复系统对话框
恢复浏览器默认的 `window.alert()`、`window.confirm()`、`window.prompt()` 方法。

`.restore()`

返回值：<br>
Type: jDialog Object<br>
方法返回当前对象。


### 默认按钮

`jDialog.BUTTON_OK`<br>
`jDialog.BUTTON_OK_CANCEL`<br>
`jDialog.BUTTON_YES_NO`<br>
`jDialog.BUTTON_YES_NO_CANCEL`<br>

### 注册组件

`jDialog.registerComponent(name, handler)`

参数：

- `name`<br>
Type: String<br>
组件的名称。
- `handler`<br>
Type: Function<br>
组件的处理函数。

返回值：<br>
该方法没有返回值。

### 注销组件

`jDialog.unregisterComponent(name)`

参数：

- `name`<br>
Type: String<br>
组件的名称。

返回值：<br>
该方法没有返回值。


## 主题

主题以文件夹形式保存在 `jdialog/themes/` 路径下。文件夹以主题名称命名，所以主题名称中不能出现不能作为文件夹命名的特殊字符。文件夹下必须包含 `theme.css` 文件，该 CSS 文件中定义对话框的样式。

## 组件
对话框自定义区支持组件。jDialog 自带的组件有：

- textbox
- checkbox

### 属性
- id<br>
Type: String<br>
组件的 Id。
- parent<br>
Type: Element<br>
组件父节点的 HTML 元素。
- config<br>
Type: JSON Object<br>
组件配置信息。

### textbox 配置
- label<br>
Type: String<br>
表示组件的标签文本。
- multiline<br>
Type: Boolean<br>
表示 textbox 是否为多行输入。
- placeholder<br>
Type: String<br>
表示 textbox 未输入时的占位文本。
- value<br>
Type: String<br>
表示 textbox 默认值。
- maxlength<br>
Type: Integer<br>
表示 textbox 输入文本的长度上限。
- width<br>
Type: Integer<br>
表示 textbox 的宽度。
- rows<br>
Type: Integer<br>
当 `multiline` 为 `true` 时，表示多行文本的行数。
- password<br>
Type: Boolean<br>
当 `multiline` 为 `false` 时，表示 textbox 是密码输入框。

### checkbox 配置
- label<br>
Type: String<br>
表示组件的标签文本。
- checked<br>
Type: Boolean<br>
表示 checkbox 默认是否为选中状态。


## 全局配置

通过 `window.__jdialog` 可以重写 jDialog 的全局配置。全局配置项包括：

- register<br>
是否自动注册为系统对话框。默认为 `false`。
- theme<br>
对话框默认主题。默认为 `default`。

必须在 jdialog.js 加载前配置好 `window.__jdialog`。

	window.__jdialog = {register: true, theme: "default"};
