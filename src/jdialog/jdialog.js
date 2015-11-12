// dialog
/*
var myDialog = new jDialog("default");
myDialog.show({"title": "标题", "message": "消息", "body": [
    {"type": "textbox", "label": "用户名", "value": "默认用户名", "name": "username"}, {"type": "textbox", "label": "密码", "name": "password", "password": true}
]}, function (result) { console.log(result); });

*/
;(function (global) {
    // 生产ID
    function generateId() {
        return "dlgc-" + (++baseId).toString();
    }

    // HTML编码
    function htmlEncode(string) {
        return $("<div/>").text(string).html();
    }

    // 获取默认对话框实例
    function getDefaultDialog() {
        if (!defaultDialog) {
            return defaultDialog = new jDialog();
        }
        return defaultDialog;
    }
    
    var $,  // 迟绑定 jQuery 对象。
        defaultDialog,
        baseZIndex = 10000,
        baseId = 0;
        loadedThemes = {},
        activeDialogs = [],
        settings = {
            "register": false,
            "theme": "default"
        },
        document = global.document,
        dialogTemplate = '\
<div class="dialog-main dialog-theme-{theme}" tabindex="1" id="{id}" style="display:none;">\
    <div class="dialog-title">\
        <div class="dialog-title-label"><span class="dialog-title-text"></span></div>\
        <div class="dialog-title-buttons">\
            <div class="dialog-button dialog-button-close" id="{id}-close"><button>&times;</button></div>\
        </div>\
    </div>\
    <div class="dialog-client">\
        <div class="dialog-message"><pre class="dialog-message-text"></pre></div>\
        <div class="dialog-body"></div>\
    </div>\
    <div class="dialog-footer">\
        <div class="dialog-footer-buttons"></div>\
    </div>\
</div>';

    var componentHandlers = {
        "textbox": function () {
            var config = this.config, id = this.id, parent = this.parent;
            if (config.label) {
                parent.append($('<label></label>').addClass("dialog-label").attr("for", id).text(config.label));
            }
            var textbox;
            if (config.multiline) {
                textbox = $("<textarea></textarea>").attr("id", id);
                if (config.rows) {
                    textbox.attr("rows", config.rows);
                }
            } else {
                textbox = $("<input>").attr("id", id).attr("type", config.password ? 'password' : 'text');
            }
            if (config.placeholder) {
                textbox.attr("placeholder", config.placeholder);
            }
            if (config.value) {
                textbox.val(config.value);
            }
            if (config.maxlength) {
                textbox.attr("maxlength", config.maxlength);
            }
            if (config.width) {
                textbox.width(config.width);
            }
            parent.append($('<div class="dialog-textbox"></div>').append(textbox));
        },
        "checkbox": function () {
            var config = this.config, id = this.id, parent = this.parent;
            var checkbox = $("<input>").attr("id", id).attr("type", 'checkbox');
            if (config.checked) {
                textarea.attr("checked", "checked");
            }
            parent.append($('<div class="dialog-checkbox"></div>').append(checkbox));
            if (config.label) {
                parent.append($('<label></label>').addClass("dialog-label").attr("for", id).text(config.label));
            }
            this.data = function () {
                return input[0].checked;
            };
        }
    };

    var __FILE__ = (function(){
		// FF,Chrome
		if (document.currentScript){
			return document.currentScript.src;
		}

		var stack;
		try{
			({}).b();
		}
		catch(e){
			stack = e.fileName || e.sourceURL || e.stack || e.stacktrace;
		}
		// IE10
		if (stack){
			var absPath = /((?:http|https|file):\/\/.*?\/[^:]+)(?::\d+)?:\d+/.exec(stack)[1];
			if (absPath){
				return absPath;
			}
		}

		// IE5-9
        var isLtIE8 = ('' + document.querySelector).indexOf('[native code]') === -1;
		for(var scripts = document.scripts,
			i = scripts.length - 1,
			script; script = scripts[i--];){
			if (script.readyState === 'interactive'){
				// if less than ie 8, must get abs path by getAttribute(src, 4)
				return isLtIE8 ? script.getAttribute('src', 4) : script.src;
			}
		}
	})();
    var __DIR__ = __FILE__.substring(0, __FILE__.lastIndexOf("/"));

    var BUTTON_OK = {
        "ok":   {"text": "确定", "primary": true, "default": true}   // primary: true 表示该按钮是主按钮，在界面上应该着重表示
    }, BUTTON_OK_CANCEL = {
        "ok":       {"text": "确定", "primary": true, "default": true},   // default: true 表示该按钮响应回车按键
        "cancel":   {"text": "取消", "cancel": true}  // cancel: true 表示该按钮响应ESC按键
    }, BUTTON_YES_NO = {
        "yes":  {"text": "是", "primary": true},
        "no":   {"text": "否", "primary": true}
    }, BUTTON_YES_NO_CANCEL = {
        "yes":      {"text": "是", "primary": true},
        "no":       {"text": "否", "primary": true},
        "cancel":   {"text": "取消", "cancel": true}
    };

    var jDialog = function (theme) {
        // theme 是主题名称。可以设计成导入不同的CSS文件。
        this.theme = theme ? theme : settings.theme;

        // 初始化对话框
        this.init = function () {
            var _this = this,
                argc = arguments.length,
                param1, param2, typeofParam1;
			
			function processParam1(type, param) {
				switch (type) {
				case "object":
                    $.each(param, function (name, value) {
                        _this[name] = value;
                    });
					break;
				case "string":
					this.message = param;
					break;
				default:
					this.message = "" + param;
					break;
				}
			}
			
            switch (argc) {
            case 2:
                if ($.isFunction(param2 = arguments[1])) {
                    this.onclose = param2;
                }
				processParam1($.type(param1 = arguments[0]), param1);
                break;
            case 1:
				typeofParam1 = $.type(param1 = arguments[0]);
				if (typeofParam1 == "function") {
					this.onclose = param;
				} else {
					processParam1(typeofParam1, param1);
				}
                break;
            case 0:
                this.title = this.message = "";
                this.width = this.height = 0;   // 0 表示默认宽度和高度
                this.position = "center";       // position 允许的值和CSS中background-position的值一致
                this.modal = this.closable = this.draggable = this.animation = true;
                this.body = {};
                this.components = {};
                this.buttons = $.extend({}, BUTTON_OK);
                break;
            }
        };
        
        this.init();
        
        // 对话框是否是显示状态
        this.isShown = function () {
            return Boolean(this.dialogElement);
        };
        
        // 定位对话框位置
        this.setPosition = function () {
            // 处理宽高
            if (this.width > 0) {
                this.dialogElement.width(this.width);
            }
            if (this.height > 0) {
                this.dialogElement.find(".dialog-client").height(this.height);
            }
            var positions = this.position.split(" ", 2);
            if (positions.length == 1) {
                positions[1] = "center";
            }
            var x = positions[0].toLowerCase(),
                y = positions[1].toLowerCase();
            switch (x) {
            case "left":
                this.dialogElement.css("left", "0");
                break;
            case "center":
                this.dialogElement.css({"left": "50%", "margin-left": "-" + (this.dialogElement.outerWidth() / 2).toString() + "px"});
                break;
            case "right":
                this.dialogElement.css({"left": "100%", "margin-left": "-" + this.dialogElement.outerWidth().toString() + "px"});
                break;
            default:
                this.dialogElement.css("left", x);
                break;
            }
            switch (y) {
            case "top":
                this.dialogElement.css("top", "0");
                break;
            case "center":
                this.dialogElement.css({"top": "50%", "margin-top": "-" + (this.dialogElement.outerHeight() / 2).toString() + "px"});
                break;
            case "bottom":
                this.dialogElement.css({"top": "100%", "margin-top": "-" + this.dialogElement.outerHeight().toString() + "px"});
                break;
            default:
                this.dialogElement.css("top", x);
                break;
            }
        };
        
        // 渲染对话框
        this.render = function () {
            var _this = this, dialogElement = this.dialogElement;
            function clickHandler(result) {
                return function () {
                    if ($.isFunction(_this.onclose)) {
                        var retVal = _this.onclose.call(_this, result);
                        if (retVal || typeof retVal == "undefined") _this.close();
                    } else {
                        _this.close();
                    }
                };
            }
            
            // 处理标题和消息
            if (this.title) {
                dialogElement.find(".dialog-title-text").text(this.title);
            }
            if (this.message) {
                dialogElement.find(".dialog-message-text").text(this.message);
                dialogElement.find(".dialog-message").css("display", "block");
            } else {
                dialogElement.find(".dialog-message").css("display", "none");
            }
            
            // 处理关闭按钮
            var closeButton = dialogElement.find(".dialog-button-close>button");
            closeButton.unbind("click");
            if (this.closable) {
                dialogElement.removeClass("dialog-style-unclosable").addClass("dialog-style-closable");
                closeButton.click(clickHandler("close"));
            } else {
                dialogElement.removeClass("dialog-style-closable").addClass("dialog-style-unclosable");
                closeButton.attr("disabled", "disabled");
            }

            // 处理 Body
            var dialogBody = dialogElement.find(".dialog-body");
            if ($.isEmptyObject(this.body)) {
                dialogBody.css("display", "none");
            } else {
                dialogBody.empty().css("display", "block");
                switch ($.type(this.body)) {
                    case "string":
                        dialogBody.html(this.body);
                        break;
                    case "array":
                        $.each(this.body, function (i, item) {
                            if (componentHandlers[item.type]) {
                                var handler = componentHandlers[item.type];
                                var layout = $('<div class="dialog-layout"></div>');
                                var component = {config: item, id: generateId(), parent: layout};
                                handler.call(component);
                                if (item.name) {
                                    _this.components[item.name] = component;
                                }
                                layout.appendTo(dialogBody);
                            }
                        });
                        break;
                    default:
                        dialogBody.empty().append(this.body);
                        break;
                }
            }

            // 处理按钮。按钮允许的属性有 primary, default, cancel, class
            var footerButtons = dialogElement.find(".dialog-footer-buttons");
            footerButtons.empty();
            $.each(this.buttons, function (name, button) {
                var buttonsHtml = "", isDefault = button.default, isCancel = button.cancel;
                buttonsHtml += '<div class="dialog-button';
                if (button.primary) {
                    buttonsHtml += ' dialog-button-primary';
                }
                if (isDefault) {
                    buttonsHtml += ' dialog-button-default';
                } else if (isCancel) {
                    buttonsHtml += ' dialog-button-cancel';
                }
                if (button.class) {
                    buttonsHtml += button.class;
                }
                buttonsHtml += '" name="' + name + '" id="' + generateId() + '"><button></button></div>';
                var buttonElement = $(buttonsHtml);
                buttonElement.children("button").text(button.text).click(clickHandler(name));
                footerButtons.append(buttonElement);
                if (isDefault) {
                    _this.defaultButton = buttonElement;
                } else if (isCancel) {
                    _this.cancelButton = buttonElement;
                }
            });
            
            // 处理拖拽
            var titleBar = dialogElement.find(".dialog-title");
            if (this.draggable) {
                var dragging = false, startX, startY;
                titleBar.mousedown(function (event) {
                    startX = event.pageX - parseInt(_this.dialogElement.css("left"));
                    startY = event.pageY - parseInt(_this.dialogElement.css("top"));
                    dragging = true;
                }).mouseup(function () {
                    dragging = false;
                }).mousemove(function (event) {
                    if (!dragging) return;
                    _this.dialogElement.css({"left": event.pageX - startX, "top": event.pageY - startY});
                });
                dialogElement.addClass("dialog-style-draggable").removeClass("dialog-style-undraggable");
            } else {
                titleBar.unbind("mousedown mouseup mousemove");
                dialogElement.addClass("dialog-style-undraggable").removeClass("dialog-style-draggable");
            }

            // 处理模态遮罩
            if (this.modal) {
                dialogElement.addClass("dialog-style-modal").removeClass("dialog-style-modeless");
                this.maskElement.css("display", "block");
            } else {
                dialogElement.addClass("dialog-style-modeless").removeClass("dialog-style-modal");
                this.maskElement.css("display", "none");
            }
        };

        // 显示对话框
        this.show = function () {
            // {title: "title", message: "message", body: {}, buttons: {}, width: 100, height: 50, position: "center", modal: true, closable: true, draggable: true, animation: true}
            // height 是指 client 区域的高度，不包含标题栏和按钮栏。标题栏和按钮栏高度由主题决定。
            // function onclose(result) { return true; }
            // onclose 为回调函数。返回 true 表示允许关闭操作，返回 false 表示阻止关闭操作。result 表示点击按钮的结果。dialog 是当前对话框对象。
            // body 是一个数组对象。每个元素代表一行的布局。每行的布局元素也是一个数组对象。
            if (this.isShown()) return this;
            this.init.apply(this, arguments);
            var _this = this;
            var dialogElement = this.dialogElement = $(dialogTemplate.replace(/\{theme\}/, this.theme).replace(/\{id\}/, this.id = generateId())),
                maskElement = this.maskElement = $('<div class="dialog-mask" style="position:fixed;width:100%;height:100%;left:0;top:0;"></div>');

            maskElement.css("z-index", baseZIndex++);
            dialogElement.css("z-index", baseZIndex++);
            
            this.render();
            
            // 响应快捷键
            dialogElement.keydown(function (event) {
                switch (event.keyCode) {
                // 响应 Esc 按键
                case 27:
                    if (_this.cancelButton) {
                        _this.cancelButton.children("button").trigger("click");
                    }
                    break;
                // 响应 Enter 按键
                case 13:
                    if (_this.defaultButton && event.target.tagName.toLowerCase() != 'textarea') {
                        _this.defaultButton.children("button").trigger("click");
                    }
                    break;
                }
            });

            // 加入文档body
            $(document.body).append(maskElement).append(dialogElement);

            // 对话框定位
            this.setPosition();
            
            // 处理动画效果
            if (this.animation) {
                dialogElement.show("fast");
            } else {
                dialogElement.css("display", "block");
            }

            // 加入活跃对话框队列
            activeDialogs.push(this);
            dialogElement.focus();
            
            return this;
        };
        
        // 关闭对话框。result 为 "close"
        this.close = function () {
            if (!this.isShown()) return;
            var _this = this;
            // 销毁对话框
            function destroy() {
                _this.dialogElement.remove();
                delete _this.dialogElement;
                _this.maskElement.remove();
                delete _this.maskElement;

                // 从活跃对话框队列移除
                for (var i in activeDialogs) {
                    if (activeDialogs[i] == _this) {
                        activeDialogs.splice(i, 1);
                        break;
                    }
                }
                
                // 焦点切换到下一个对话框
                if (activeDialogs.length > 0) {
                    activeDialogs[activeDialogs.length - 1].dialogElement.focus();
                }
                _this.init();

            }
            if (this.animation) {
                this.dialogElement.hide("fast", destroy);
            } else {
                destroy();
            }
            return this;
        };

        // 重新渲染对话框
        this.update = function () {
            var _this = this,
                dialogElement = this.dialogElement;
            this.init.apply(this, arguments);
            this.render();

            // 对话框定位
            this.setPosition();
            return this;
        };
        
        // 注册系统全局接口
        this.register = function () {
            this._originalAlertHandler = global.alert; 
            this._originalConfirmHandler = global.confirm;
            this._originalPromptHandler = global.prompt;
            this._originalOpenHandler = global.open;
            global.alert = function (message, onclose) {    // 和系统原生接口保持一致，onclose 是可选参数。
                getDefaultDialog().show({"message": message, "buttons": BUTTON_OK}, function () {
                    if ($.isFunction(onclose)) return onclose("ok");
                });
            };
            global.confirm = function (message, onclose) {   // 由于模拟函数不能阻塞执行，所以需要通过 onclose 回调函数来获取结果。
                getDefaultDialog().show({"message": message, "buttons": BUTTON_OK_CANCEL}, function (result) {
                    if ($.isFunction(onclose)) return onclose(result == "ok" ? true : false);
                });
            };
            global.prompt = function (message, defaultText, onclose) {
                getDefaultDialog().show({"message": message, "body": [{"type": "textbox", "value": defaultText, "name": "value"}], "buttons": BUTTON_OK_CANCEL}, function (result) {
                    if ($.isFunction(onclose)) return onclose(this.getData("value"));
                });
            };
            return this;
        };

        // 恢复系统全局接口
        this.restore = function () {
            this._originalAlertHandler && (global.alert = this._originalAlertHandler);
            this._originalConfirmHandler && (global.confirm = this._originalConfirmHandler);
            this._originalPromptHandler && (global.prompt = this._originalPromptHandler);
            this._originalOpenHandler && (global.open = this._originalOpenHandler);
            return this;
        };
        
        // 获取控件的数据
        this.getData = function (name) {
            var component = this.components[name];
            if (component) {
                return component.data ? this.components[name].data() : $("#" + component.id).val();
            }
        };
        
        // 加载主题
        this.loadTheme = function () {
            if ($.inArray(this.theme, loadedThemes) >= 0) {
                return;
            }
            var themeDir = __DIR__ + "/themes/" + this.theme;
            $("<link>").attr({ rel: "stylesheet", type: "text/css", href: themeDir + "/theme.css"}).appendTo("head");
            loadedThemes[this.theme] = themeDir;
        };
        
        this.loadTheme();
    };
    
    jDialog.BUTTON_OK = BUTTON_OK;
    jDialog.BUTTON_OK_CANCEL = BUTTON_OK_CANCEL;
    jDialog.BUTTON_YES_NO = BUTTON_YES_NO;
    jDialog.BUTTON_YES_NO_CANCEL = BUTTON_YES_NO_CANCEL;
    
    // 注册组件
    jDialog.registerComponent = function (name, handler) {
        componentHandlers[name] = handler;
    }
    
    // 注销组件
    jDialog.unregisterComponent = function (name) {
        delete componentHandlers[name];
    }
    
    // 尝试自动注册全局接口
    function autoRegister() {
        var globalSettings = global.__jdialog;
        if (typeof globalSettings == "object") {
            settings = $.extend({}, settings, globalSettings);
        }
        if (settings.register) {
            getDefaultDialog().register();
        }
    }
    
    if (typeof define != "undefined" && define.amd) {
        // AMD
        define("jdialog", ["jquery"], function(jQuery) {
            $ = jQuery;
            autoRegister();
            return jDialog;
        });
    } else {
        // 注册全局变量
        global.jDialog = jDialog;
        $ = global.$ ? global.$ : global.jQuery;
        autoRegister();
    }
})(window);
