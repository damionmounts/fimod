// ==UserScript==
// @name        fimod
// @author      sidke, damionmounts(this fork)
// @namespace   https://github.com/damionmounts/fimod
// @description factory idle mod
// @include     *://factoryidle.com/*
// @version     1.06.15
// @grant       none
// @run-at      document-start
// ==/UserScript==
(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s
})({
    1: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor)
                }
            }
            return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor
            }
        }();
        var _storage = require("./lib/storage");
        var _storage2 = _interopRequireDefault(_storage);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                "default": obj
            }
        }

        function _toConsumableArray(arr) {
            if (Array.isArray(arr)) {
                for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                    arr2[i] = arr[i]
                }
                return arr2
            } else {
                return Array.from(arr)
            }
        }

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function")
            }
        }
        var Fimod = function() {
            _createClass(Fimod, null, [{
                key: "require",
                value: function require(paths) {
                    return new Promise(function(resolve) {
                        window.require(paths, function() {
                            for (var _len = arguments.length, modules = Array(_len), _key = 0; _key < _len; _key++) {
                                modules[_key] = arguments[_key]
                            }
                            return resolve(modules)
                        })
                    })
                }
            }, {
                key: "define",
                value: function define() {
                    var fimod = new(Function.prototype.bind.apply(Fimod, [null].concat(Array.prototype.slice.call(arguments))));
                    Fimod.mods.push(fimod)
                }
            }, {
                key: "load",
                value: function load() {
                    var promise = Promise.resolve();
                    Fimod.mods.sort(function(a, b) {
                        return a.weight - b.weight
                    }).map(function(fimod) {
                        promise = promise.then(function() {
                            return Fimod.require(fimod.paths).then(function(modules) {
                                return fimod.load(modules)
                            })
                        })
                    });
                    return promise
                }
            }, {
                key: "wrap",
                value: function wrap(cls, method, fn) {
                    var supr = cls.prototype[method];
                    cls.prototype[method] = function() {
                        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                            args[_key2] = arguments[_key2]
                        }
                        fn.call.apply(fn, [this, supr.bind(this)].concat(args))
                    }
                }
            }, {
                key: "mods",
                get: function get() {
                    if (this._mods === undefined) this._mods = [];
                    return this._mods
                }
            }, {
                key: "storage",
                get: function get() {
                    if (this._storage === undefined) this._storage = new _storage2.default("Fimod");
                    return this._storage
                }
            }, {
                key: "version",
                get: function get() {
                    return GM_info.script.version
                }
            }]);

            function Fimod(properties, paths, install) {
                _classCallCheck(this, Fimod);
                if (install === undefined) install = paths;
                Object.assign(this, {
                    name: "no name",
                    description: "no description",
                    enabled: true,
                    system: false,
                    weight: 0,
                    paths: paths,
                    install: install
                }, properties);
                this.enabled = Fimod.storage.get("module." + this.name, this.enabled)
            }
            _createClass(Fimod, [{
                key: "toggle",
                value: function toggle() {
                    var value = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
                    this.enabled = value !== null ? value : !this.enabled;
                    Fimod.storage.set("module." + this.name, this.enabled)
                }
            }, {
                key: "load",
                value: function load(modules) {
                    if (this.enabled === false && this.system === false) return;
                    console.log("Installing Fimod: " + this.name);
                    return this.install.apply(this, _toConsumableArray(modules))
                }
            }]);
            return Fimod
        }();
        exports.default = Fimod
    }, {
        "./lib/storage": 5
    }],
    2: [function(require, module, exports) {
        "use strict";
        if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
            (function() {
                var observer = new MutationObserver(function(mutations) {
                    mutations.map(function(mutation) {
                        if (mutation.addedNodes.length === 0) return;
                        var node = mutation.addedNodes[0];
                        if (node.tagName == "SCRIPT") {
                            var event = new Event("beforescriptexecute", {
                                bubbles: true,
                                cancelable: true
                            });
                            var canceled = !node.dispatchEvent(event);
                            if (canceled) node.src = ""
                        }
                    })
                });
                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true
                });
                window._disconnectBeforeScriptExecute = function() {
                    observer.disconnect()
                }
            })()
        }
    }, {}],
    3: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.clamp = clamp;

        function clamp(v, a, b) {
            return Math.min(Math.max(v, a), b)
        }
    }, {}],
    4: [function(require, module, exports) {
        "use strict";
        document.exitFullScreen = document.exitFullScreen || document.mozExitFullScreen || document.webkitExitFullscreen;
        Object.defineProperty(document, "isFullScreen", {
            get: function get() {
                return this.mozIsFullScreen || this.webkitIsFullScreen
            }
        });
        document.toggleFullScreen = function() {
            if (this.isFullScreen) this.exitFullScreen();
            else this.documentElement.requestFullScreen()
        };
        var element = document.documentElement;
        element.requestFullScreen = element.requestFullScreen || element.mozRequestFullScreen || element.webkitRequestFullScreen
    }, {}],
    5: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor)
                }
            }
            return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor
            }
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function")
            }
        }
        var Storage = function() {
            function Storage(key) {
                _classCallCheck(this, Storage);
                this.key = key;
                this.load()
            }
            _createClass(Storage, [{
                key: "load",
                value: function load() {
                    var json = localStorage.getItem(this.key);
                    this.data = JSON.parse(json || "{}")
                }
            }, {
                key: "save",
                value: function save() {
                    localStorage.setItem(this.key, JSON.stringify(this.data))
                }
            }, {
                key: "get",
                value: function get(key, d) {
                    var value = this.data[key];
                    if (value === undefined) return d;
                    return value
                }
            }, {
                key: "set",
                value: function set(key, value) {
                    this.data[key] = value;
                    this.save()
                }
            }]);
            return Storage
        }();
        exports.default = Storage
    }, {}],
    6: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.preventScript = preventScript;
        exports.getScript = getScript;
        exports.insertElement = insertElement;
        exports.insertScript = insertScript;
        exports.insertStyle = insertStyle;

        function preventScript(src) {
            return new Promise(function(resolve) {
                var handleScript = function handleScript(event) {
                    if (event.target.src == src) {
                        event.preventDefault();
                        document.removeEventListener("beforescriptexecute", handleScript);
                        if (window._disconnectBeforeScriptExecute) window._disconnectBeforeScriptExecute();
                        resolve()
                    }
                };
                document.addEventListener("beforescriptexecute", handleScript, true)
            })
        }

        function getScript(src) {
            return fetch(src).then(function(response) {
                return response.text()
            })
        }

        function insertElement(data, tag) {
            var element = document.createElement(tag);
            element.textContent = data.toString();
            document.head.appendChild(element)
        }

        function insertScript(data) {
            insertElement(data, "script")
        }

        function insertStyle(data) {
            insertElement(data, "style")
        }
    }, {}],
    7: [function(require, module, exports) {
        "use strict";
        var _slicedToArray = function() {
            function sliceIterator(arr, i) {
                var _arr = [];
                var _n = true;
                var _d = false;
                var _e = undefined;
                try {
                    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                        _arr.push(_s.value);
                        if (i && _arr.length === i) break
                    }
                } catch (err) {
                    _d = true;
                    _e = err
                } finally {
                    try {
                        if (!_n && _i["return"]) _i["return"]()
                    } finally {
                        if (_d) throw _e
                    }
                }
                return _arr
            }
            return function(arr, i) {
                if (Array.isArray(arr)) {
                    return arr
                } else if (Symbol.iterator in Object(arr)) {
                    return sliceIterator(arr, i)
                } else {
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }
        }();
        var _fimod = require("./fimod");
        var _fimod2 = _interopRequireDefault(_fimod);
        var _utility = require("./lib/utility");
        require("./lib/beforescriptexecute-polyfill.js");
        require("./lib/requestFullscreen-polyfill.js");
        require("./mods");

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                "default": obj
            }
        }
        var SCRIPT_SRC = "https://factoryidle.com/app.js";
        var loadingMessage = void 0;
        (0, _utility.preventScript)(SCRIPT_SRC);
        (0, _utility.getScript)(SCRIPT_SRC).then(function(source) {
            if (window.top !== window.self) document.body.classList.add("iframe");
            loadingMessage = document.querySelector("#loadingMessage");
            loadingMessage.innerText = "Loading Fimod...";
            var variables = ["require", "define", "BinaryTest", "isBrowserSupported", "PlayFab", "logger", "GameUiEvent", "GameEvent", "FactoryEvent", "GlobalUiEvent", "ApiEvent"];
            var object = "{" + variables.map(function(v) {
                return '"' + v + '": ' + v
            }).join(", ") + "}";
            var start = source.indexOf("var MainInstance");
            return new Promise(function(resolve) {
                window.__FIMOD_RESOLVE__ = resolve;
                (0, _utility.insertScript)(source.substring(0, start) + "; __FIMOD_RESOLVE__(" + object + "); }()")
            })
        }).then(function(variables) {
            Object.keys(variables).map(function(key) {
                window[key] = variables[key]
            });
            return _fimod2.default.require(["text!template/settings.html"]).then(function(_ref) {
                var _ref2 = _slicedToArray(_ref, 1);
                var template = _ref2[0];
                var version = void 0;
                try {
                    version = template.match(/Version ([\d\.]+)/)[1]
                } finally {
                    if (version == _fimod2.default.version.substring(0, version.length)) return;
                    loadingMessage.innerText = "Version mismatch. Possible incompatibility.";
                    return new Promise(function(resolve) {
                        return setTimeout(resolve, 2e3)
                    })
                }
            })
        }).then(function() {
            return _fimod2.default.load()
        }).then(function() {
            loadingMessage.innerText = "Loading Factory Idle...";
            var paths = ["Main", "lib/jquery", "base/Logger", "base/NumberFormat", "lib/handlebars", "text", "lib/bin/Binary"];
            return _fimod2.default.require(paths).then(function(_ref3) {
                var _ref4 = _slicedToArray(_ref3, 1);
                var Main = _ref4[0];
                window.GAME_LOADED = true;
                window.onerror = window.oldErrorHandler;
                window.BinaryTest.test();
                if (window.isBrowserSupported()) {
                    _fimod2.default.MainInstance = new Main;
                    _fimod2.default.MainInstance.init(false, function() {})
                }
            })
        })
    }, {
        "./fimod": 1,
        "./lib/beforescriptexecute-polyfill.js": 2,
        "./lib/requestFullscreen-polyfill.js": 4,
        "./lib/utility": 6,
        "./mods": 11
    }],
    8: [function(require, module, exports) {
        "use strict";
        var _fimod = require("../fimod");
        var _fimod2 = _interopRequireDefault(_fimod);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                "default": obj
            }
        }
        _fimod2.default.define({
            name: "clearcloud",
            label: "Clear Cloud Saves",
            description: "Allows the deletion of cloud save slots"
        }, ["play/api/Web", "play/api/api/PlayFabApi", "play/SaveManager", "ui/SettingsUi", "ui/helper/ConfirmUi"], function(Web, PlayFabApi, SaveManager, SettingsUi, ConfirmUi) {
            Web.prototype.clear = function(slot, done) {
                this.playFabApi.clear(slot, done)
            };
            var name = "PlayFab";
            PlayFabApi.prototype.clear = function(slot, done) {
                var request = {
                    KeysToRemove: [slot, this._getMetaVarName(slot)]
                };
                window.PlayFab.ClientApi.UpdateUserData(request, function(response) {
                    if (response && response.code == 200) {
                        window.logger.info(name, "Cleared " + slot);
                        done(true)
                    } else {
                        window.logger.error(name, "Clear failed!");
                        done(false)
                    }
                }.bind(this))
            };
            SaveManager.prototype._clearCloud = function(slot, done) {
                if (this.useCloud) {
                    this.api.clear(slot, done)
                } else {
                    window.logger.info(name, "Cloud save skipped!");
                    done()
                }
            };
            _fimod2.default.wrap(SettingsUi, "_display", function(supr) {
                var _this = this;
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key]
                }
                supr.apply(undefined, args);
                var $panel = $("#settings");
                $panel.find(".loadSlot").each(function(i, node) {
                    var slot = $(node).attr("data-id");
                    $(node).after('<input type="button" class="clearSlot" data-id="' + slot + '" value="Clear">')
                });
                $panel.find(".clearSlot").click(function(event) {
                    var slot = $(event.target).attr("data-id");
                    var confirm = new ConfirmUi("Clear slot", "Are you sure you want to clear this slot?");
                    confirm.setOkTitle("Cancel").setCancelTitle("Yes, clear slot").setCancelCallback(function() {
                        _this.saveManager._clearCloud(slot, function() {
                            _this.hide()
                        })
                    }).display()
                })
            })
        })
    }, {
        "../fimod": 1
    }],
    9: [function(require, module, exports) {
        "use strict";
        var _Fimod = require("../Fimod");
        var _Fimod2 = _interopRequireDefault(_Fimod);
        var _utility = require("../lib/utility");

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                "default": obj
            }
        }
        var style = "\n.controlsBox {\n  width: 210px;\n}\n\n.controlsBox .clearPackagesButton {\n  width: 90px;\n}\n\n.controlsBox .clearFactoryButton {\n  width: 90px;\n  border: 1px solid darkred;\n}\n";
        var buttonTemplate = '\n<a id="clearFactory" class="button clearFactoryButton" href="javascript:void(0);">Clear factory</a>\n';
        _Fimod2.default.define({
            name: "clearfactories",
            label: "Clear Factories",
            description: "Provides a button to remove all buildings from a factory floor"
        }, ["game/Factory", "game/action/SellComponentAction", "ui/factory/ControlsUi", "ui/helper/ConfirmUi"], function(Factory, SellComponentAction, ControlsUi, ConfirmUi) {
            (0, _utility.insertStyle)(style);
            _Fimod2.default.wrap(ControlsUi, "display", function(supr) {
                var _this = this;
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key]
                }
                supr.apply(undefined, args);
                var $container = this.container;
                var $tracksButton = $("#clearPackages", $container);
                var $factoryButton = $(buttonTemplate);
                $tracksButton.after($factoryButton);
                var sellComponents = function sellComponents() {
                    _this.factory.getTiles().filter(function(tile) {
                        return tile.isMainComponentContainer()
                    }).map(function(tile) {
                        var meta = tile.getComponent().meta;
                        return new SellComponentAction(tile, meta.width, meta.height)
                    }).map(function(action) {
                        if (action.canSell()) action.sell()
                    })
                };
                $factoryButton.click(function(_event) {
                    var confirm = new ConfirmUi("Clear slot", "Are you sure you want to clear this factory?");
                    confirm.setOkTitle("Cancel").setCancelTitle("Yes, clear factory").setCancelCallback(sellComponents).display()
                })
            })
        })
    }, {
        "../Fimod": 1,
        "../lib/utility": 6
    }],
    10: [function(require, module, exports) {
        "use strict";
        var _Fimod = require("../Fimod");
        var _Fimod2 = _interopRequireDefault(_Fimod);
        var _utility = require("../lib/utility");

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                "default": obj
            }
        }
        var style = "\nhtml {\n  overflow-y: auto;\n}\n\nhtml, body, #main, #gameArea {\n  height: 100%;\n  width: 100%;\n}\n\n#main {\n  display: table;\n}\n\n#adArea {\n  display: table-row;\n  height: 100px;\n}\n\n#gameArea {\n  display: table-row;\n  border: none;\n  float: none;\n}\n\n#gameArea:before {\n  content: '';\n  display: block;\n  width: 100%;\n  height: 1px;\n  background gray;\n  margin-top: -1px;\n}\n\n#factoryLayout {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  width: 100%;\n}\n\n#menuArea {\n  flex: 0 0 30px;\n}\n\n#topArea {\n  display: flex;\n  flex: 0 0 110px;\n}\n\n#bottomArea {\n  flex: 1;\n  display: flex;\n}\n\n#leftArea {\n  flex: 0 0 210px;\n}\n\n#rightArea {\n  flex: 1;\n  overflow:hidden;\n}\n\n.overviewContainer {\n  flex: 0 0 210px;\n}\n\n.infoContainer {\n  flex: 1;\n}\n\n.controlsContainer {\n  flex: 0 0 210px;\n}\n\n.overviewContainer,\n.infoContainer,\n.controlsContainer {\n  padding: 10px 0;\n}\n\n.infoContainer {\n  position: relative;\n}\n\n.componentControls {\n  position: absolute;\n  right: 0;\n}\n\n#toggleFullscreenButton {\n  float: right;\n}\n\n.controlsBox .button {\n  margin: 0 5px 5px 0;\n}\n\n#bonusTicks {\n  padding-top: 5px;\n}\n";
        var factoryTemplate = '\n<div id="factoryLayout">\n  <div id="menuArea">\n    <div class="menuContainer"></div>\n  </div>\n  <div id="topArea">\n    <div class="overviewContainer"></div>\n    <div class="infoContainer"></div>\n    <div class="controlsContainer"></div>\n  </div>\n  <div id="bottomArea">\n    <div id="leftArea">\n      <div class="componentsContainer"></div>\n    </div>\n    <div id="rightArea">\n      <div class="mapContainer"></div>\n    </div>\n  </div>\n  <div id="hidden" style="display: none;">\n    <div class="incentivizedAdButtonContainer"></div>\n    <div class="mapToolsContainer"></div>\n  </div>\n</div>\n';
        var buttonTemplate = '\n<a id="toggleFullscreenButton" href="javascript:void(0);">Fullscreen</a>\n';
        _Fimod2.default.define({
            name: "fullscreenmode",
            label: "Fullscreen Mode",
            description: "Rearranges layout and enabled full-screen toggle"
        }, ["game/Game", "ui/MainUi", "ui/FactoryUi", "ui/factory/MapUi", "ui/factory/MenuUi"], function(Game, MainUi, FactoryUi, MapUi, MenuUi) {
            (0, _utility.insertStyle)(style);
            _Fimod2.default.wrap(MainUi, "display", function(supr) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key]
                }
                supr.apply(undefined, args);
                var $main = $("#main");
                var $adArea = $('<div id="adArea" class="ad_box"></div>');
                var $ads = $(".adsbygoogle").parent();
                if ($ads.length) {
                    $adArea.append($ads);
                    $ads.last().remove();
                    $main.prepend($adArea)
                }
                $("> br", $main).remove();
                $main.removeClass("main mainWithAdd")
            });
            _Fimod2.default.wrap(MapUi, "display", function(supr) {
                var _this = this;
                for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    args[_key2 - 1] = arguments[_key2]
                }
                supr.apply(undefined, args);
                this._resize = function() {
                    var reset = {
                        width: 1,
                        height: 1
                    };
                    _this.container.css(reset);
                    _this.overlay.css(reset);
                    var size = {
                        width: _this.container.parent().width(),
                        height: _this.container.parent().height()
                    };
                    _this.container.css(size);
                    _this.overlay.css(size)
                };
                this._resize();
                window.addEventListener("resize", this._resize);
                setTimeout(function() {
                    return _this._resize()
                }, 1)
            });
            _Fimod2.default.wrap(MapUi, "destroy", function(supr) {
                supr();
                window.removeEventListener("resize", this._resize)
            });
            FactoryUi.prototype.display = function(container) {
                var _this2 = this;
                this.container = container;
                this.container.html(factoryTemplate);
                var uis = ["menu", "map", "components", "info", "controls", "overview", "incentivizedAdButton", "mapTools"];
                uis.map(function(ui) {
                    return _this2[ui + "Ui"].display(_this2.container.find("." + ui + "Container"))
                })
            };
            _Fimod2.default.wrap(MenuUi, "display", function(supr) {
                for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                    args[_key3 - 1] = arguments[_key3]
                }
                supr.apply(undefined, args);
                var $box = $(".menuBox", this.container);
                var $button = $(buttonTemplate);
                $button.click(function() {
                    document.toggleFullScreen()
                });
                $box.append($button)
            })
        })
    }, {
        "../Fimod": 1,
        "../lib/utility": 6
    }],
    11: [function(require, module, exports) {
        "use strict";
        require("./settings");
        require("./resetgame");
        require("./mapnavigation");
        require("./fullscreenmode");
        require("./togglebackground");
        require("./clearfactories");
        require("./showefficiency");
        require("./clearcloud")
    }, {
        "./clearcloud": 8,
        "./clearfactories": 9,
        "./fullscreenmode": 10,
        "./mapnavigation": 12,
        "./resetgame": 13,
        "./settings": 14,
        "./showefficiency": 15,
        "./togglebackground": 16
    }],
    12: [function(require, module, exports) {
        "use strict";
        var _Fimod = require("../Fimod");
        var _Fimod2 = _interopRequireDefault(_Fimod);
        var _utility = require("../lib/utility");
        var _common = require("../lib/common");

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                "default": obj
            }
        }
        var css = "canvas { image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: -o-crisp-edges; image-rendering: pixelated; -ms-interpolation-mode: nearest-neighbor; } \n#gameArea .mapContainer > div {\n  position: relative;\n}\n\n#gameArea .mapContainer > div > div {\n  position: absolute !important;\n  transform-origin: 0 0;\n}\n";
        var ZOOM_MIN = .5;
        var ZOOM_MAX = 3;
        var ZOOM_STEPS = 25;
        var ZOOM_LOG_MIN = Math.log(ZOOM_MIN);
        var ZOOM_LOG_MAX = Math.log(ZOOM_MAX);
        var ZOOM_LOG_STEP = (ZOOM_LOG_MAX - ZOOM_LOG_MIN) / ZOOM_STEPS;
        var zoomAt = function zoomAt(l) {
            return Math.pow(Math.E, ZOOM_LOG_MIN + ZOOM_LOG_STEP * (ZOOM_STEPS - l))
        };
        var FACTORY_MOUSE_DOWN = "FACTORY_MOUSE_DOWN";
        var FACTORY_MOUSE_UP = "FACTORY_MOUSE_UP";
        var FACTORY_MOUSE_MOVE = "FACTORY_MOUSE_MOVE";
        var FACTORY_MOUSE_OUT = "FACTORY_MOUSE_OUT";
        var FACTORY_SCROLL_END = "FACTORY_SCROLL_END";
        var FACTORY_SCROLL_START = "FACTORY_SCROLL_START";
        var COMPONENT_META_SELECTED = "COMPONENT_META_SELECTED";

        function constrainTo(point, coords) {
            return {
                top: (0, _common.clamp)(coords.top, point.top - coords.height, point.top),
                left: (0, _common.clamp)(coords.left, point.left - coords.width, point.left)
            }
        }
        _Fimod2.default.define({
            name: "mapnavigation",
            label: "Improved Map Navigation",
            description: "Keyboard movement, zooming, and more flexible map movement"
        }, ["ui/factory/MapUi", "ui/factory/mapLayers/MouseLayer"], function(MapUi, MouseLayer) {
            (0, _utility.insertStyle)(css);
            var namespace = "FactoryMapUi";
            MapUi.prototype.setupMapDragging = function() {
                var _this = this;
                var $body = $("body");
                var $element = this.element;
                var componentBlocks = false;
                var componentSelected = function componentSelected(componentId) {
                    var meta = _this.game.getMeta().componentsById[componentId];
                    componentBlocks = !!meta && meta.buildByDragging
                };
                this.factory.getEventManager().addListener(namespace, COMPONENT_META_SELECTED, componentSelected);
                var startDragging = function startDragging(event) {
                    if (!(event.buttons & 1) || event.shiftKey || event.altKey || componentBlocks) return;
                    var offset = $element.position();
                    var origin = {
                        top: offset.top,
                        left: offset.left
                    };
                    var point = {
                        top: event.pageY,
                        left: event.pageX
                    };
                    var handleDragging = function handleDragging(event) {
                        var container = _this.container.parent().get(0);
                        var containerRect = container.getBoundingClientRect();
                        var mapRect = $element.get(0).getBoundingClientRect();
                        var coords = constrainTo({
                            top: containerRect.height / 2,
                            left: containerRect.width / 2
                        }, {
                            top: origin.top + (event.pageY - point.top),
                            left: origin.left + (event.pageX - point.left),
                            width: mapRect.width,
                            height: mapRect.height
                        });
                        $element.get(0).style.top = coords.top + "px";
                        $element.get(0).style.left = coords.left + "px";
                        _this.factory.getEventManager().invokeEvent(FACTORY_SCROLL_START)
                    };
                    var stopDragging = function stopDragging(_event) {
                        $body.off("mouseup", stopDragging).off("mouseleave", stopDragging).off("mousemove", handleDragging);
                        _this.factory.getEventManager().invokeEvent(FACTORY_SCROLL_END)
                    };
                    $body.on("mouseup", stopDragging).on("mouseleave", stopDragging).on("mousemove", handleDragging)
                };
                this.element.get(0).addEventListener("mousedown", startDragging)
            };
            MouseLayer.prototype._setupNativeMouseEvents = function() {
                var _this2 = this;
                var container = this.container.parent().parent().get(0);
                var map = this.container.get(0);
                var element = this.element.get(0);
                var em = this.factory.getEventManager();
                var scale = 1;
                var level = 15;
                var lastEvent = void 0;
                element.addEventListener("mouseout", function(event) {
                    em.invokeEvent(FACTORY_MOUSE_OUT, event);
                    lastEvent = null
                }, false);
                element.addEventListener("mousemove", function(event) {
                    var size = {
                        width: 1,
                        height: 1
                    };
                    if (_this2.selectedComponentMetaId) {
                        size = _this2.game.getMeta().componentsById[_this2.selectedComponentMetaId]
                    }
                    var rect = element.getBoundingClientRect();
                    var x = (event.clientX - rect.left) / scale - _this2.tileSize * size.width / 2;
                    var y = (event.clientY - rect.top) / scale - _this2.tileSize * size.height / 2;
                    var newEvent = {
                        x: (0, _common.clamp)(Math.round(x / _this2.tileSize), 0, _this2.tilesX - size.width),
                        y: (0, _common.clamp)(Math.round(y / _this2.tileSize), 0, _this2.tilesY - size.height),
                        leftMouseDown: event.buttons & 1,
                        rightMouseDown: event.buttons & 2,
                        shiftKeyDown: event.shiftKey,
                        altKeyDown: event.altKey
                    };
                    if (!lastEvent || lastEvent.x != newEvent.x || lastEvent.y != newEvent.y) {
                        em.invokeEvent(FACTORY_MOUSE_MOVE, newEvent);
                        lastEvent = newEvent
                    }
                }, false);
                element.addEventListener("mousedown", function(event) {
                    em.invokeEvent(FACTORY_MOUSE_DOWN, {
                        x: lastEvent.x,
                        y: lastEvent.y,
                        leftMouseDown: event.buttons & 1,
                        rightMouseDown: event.buttons & 2,
                        shiftKeyDown: event.shiftKey,
                        altKeyDown: event.altKey
                    })
                }, false);
                element.addEventListener("mouseup", function(_event) {
                    em.invokeEvent(FACTORY_MOUSE_UP, lastEvent)
                }, false);
                var zoom = function zoom(event) {
                    var delta = void 0;
                    if (event.detail) delta = (event.detail > 0) - (event.detail < 0);
                    else delta = (event.wheelDelta < 0) - (event.wheelDelta > 0);
                    level = (0, _common.clamp)(level + delta, 0, ZOOM_STEPS - 1);
                    scale = zoomAt(level).toFixed(2);
                    if (level == 15) scale = 1;
                    var before = map.getBoundingClientRect();
                    var x = event.clientX - before.left;
                    var y = event.clientY - before.top;
                    var px = x / before.width;
                    var py = y / before.height;
                    map.style.transform = "scale(" + scale + ")";
                    var after = map.getBoundingClientRect();
                    var width = before.width - after.width;
                    var height = before.height - after.height;
                    var dx = width * px;
                    var dy = height * py;
                    var containerRect = container.getBoundingClientRect();
                    var coords = constrainTo({
                        top: containerRect.height / 2,
                        left: containerRect.width / 2
                    }, {
                        top: after.top - containerRect.top + dy,
                        left: after.left - containerRect.left + dx,
                        width: after.width,
                        height: after.height
                    });
                    map.style.top = coords.top + "px";
                    map.style.left = coords.left + "px";
                    event.preventDefault()
                };
                container.addEventListener("mousewheel", zoom, false);
                container.addEventListener("DOMMouseScroll", zoom, false);
                container.addEventListener("mousedown", function(event) {
                    if (!(event.buttons & 4)) return;
                    event.preventDefault();
                    level = 14;
                    zoom(event)
                }, false)
            };
            _Fimod2.default.wrap(MouseLayer, "display", function(supr) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key]
                }
                supr.apply(undefined, args);
                this.setupKeyboardListener()
            });
            MouseLayer.prototype.setupKeyboardListener = function() {
                var _this3 = this;
                var moveTimer = void 0;
                var resizeTimer = void 0;
                var delay = 5;
                var speed = 5;
                var moving = [];
                var movements = {
                    UP: {
                        top: 1,
                        left: 0
                    },
                    LEFT: {
                        top: 0,
                        left: 1
                    },
                    DOWN: {
                        top: -1,
                        left: 0
                    },
                    RIGHT: {
                        top: 0,
                        left: -1
                    }
                };
                var directions = {
                    87: "UP",
                    65: "LEFT",
                    83: "DOWN",
                    68: "RIGHT",
                    38: "UP",
                    37: "LEFT",
                    40: "DOWN",
                    39: "RIGHT"
                };
                var applyMovement = function applyMovement() {
                    var add = function add(a, b) {
                        return {
                            top: a.top + b.top,
                            left: a.left + b.left
                        }
                    };
                    var movement = {
                        top: 0,
                        left: 0
                    };
                    moving.map(function(direction) {
                        return movement = add(movement, movements[direction])
                    });
                    var container = _this3.container.parent().get(0);
                    var map = _this3.container.get(0);
                    var containerRect = container.getBoundingClientRect();
                    var mapRect = map.getBoundingClientRect();
                    var dy = movement.top * speed;
                    var dx = movement.left * speed;
                    var coords = constrainTo({
                        top: containerRect.height / 2,
                        left: containerRect.width / 2
                    }, {
                        top: mapRect.top - containerRect.top + dy,
                        left: mapRect.left - containerRect.left + dx,
                        width: mapRect.width,
                        height: mapRect.height
                    });
                    map.style.top = coords.top + "px";
                    map.style.left = coords.left + "px"
                };
                this._handleKeyboard = function(event) {
                    if (!(event.keyCode in directions)) return;
                    var direction = directions[event.keyCode];
                    if (moving.indexOf(direction) != -1) return;
                    moving.push(direction);
                    event.preventDefault();
                    if (moveTimer === undefined) moveTimer = setInterval(applyMovement, delay);
                    var stopMovement = function stopMovement(event) {
                        if (!(event.keyCode in directions)) return;
                        if (directions[event.keyCode] != direction) return;
                        var index = moving.indexOf(direction);
                        if (index == -1) return;
                        moving.splice(index, 1);
                        if (moving.length === 0) moveTimer = clearInterval(moveTimer)
                    };
                    document.body.addEventListener("keyup", stopMovement)
                };
                this._handleResize = function() {
                    if (resizeTimer !== undefined) clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(function() {
                        return applyMovement()
                    }, 100)
                };
                document.body.addEventListener("keydown", this._handleKeyboard);
                window.addEventListener("resize", this._handleResize)
            };
            _Fimod2.default.wrap(MouseLayer, "destroy", function(supr) {
                supr();
                document.body.removeEventListener("keydown", this._handleKeyboard);
                window.removeEventListener("resize", this._handleResize)
            })
        })
    }, {
        "../Fimod": 1,
        "../lib/common": 3,
        "../lib/utility": 6
    }],
    13: [function(require, module, exports) {
        "use strict";
        var _fimod = require("../fimod");
        var _fimod2 = _interopRequireDefault(_fimod);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                "default": obj
            }
        }
        _fimod2.default.define({
            name: "resetgame",
            system: true
        }, ["ui/SettingsUi", "ui/helper/ConfirmUi"], function(SettingsUi, ConfirmUi) {
            _fimod2.default.wrap(SettingsUi, "_display", function(supr) {
                var _this = this;
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key]
                }
                supr.apply(undefined, args);
                var $resetButton = $("#resetGame");
                $resetButton.off("click");
                $resetButton.click(function() {
                    new ConfirmUi("Reset game", "Are you sure you want to reset the game?").setCancelTitle("Yes, RESET GAME").setOkTitle("Nooooo!!!").setCancelCallback(function() {
                        _fimod2.default.MainInstance.destroy();
                        _fimod2.default.MainInstance.init(true);
                        _this.destroy()
                    }).display()
                })
            })
        })
    }, {
        "../fimod": 1
    }],
    14: [function(require, module, exports) {
        "use strict";
        var _fimod = require("../fimod");
        var _fimod2 = _interopRequireDefault(_fimod);
        var _utility = require("../lib/utility");

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                "default": obj
            }
        }
        var style = '\n#fimodButton {\n  background: rgba(255, 128, 255, 0.2);\n}\n\n#fimodButton:hover {\n  background: rgba(255, 128, 255, 0.5);\n}\n\n.fullscreen-container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n\n.fullscreen-background {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  opacity: 0.7;\n}\n\n.fullscreen-window {\n  width: 500px;\n  top: 10px;\n  padding: 15px;\n  border: 1px solid rgb(225, 225, 232);\n  border-radius: 8px;\n  background-color: black;\n  font-size: 0.9em;\n  position: relative;\n  margin: 0 auto;\n}\n\n.fullscreen-window__close {\n  color: white;\n  font-weight: bold;\n  float: right;\n}\n\n.fullscreen-window__title {\n  font-size: 1.2em;\n  color: lightblue;\n}\n\n.toggle {\n  border-top: 2px solid rgba(255, 255, 255, 0.7);\n  padding: 1em 0;\n  clear: both;\n}\n\n.toggle__name {\n  font-size: 1.3em;\n  font-weight: bold;\n  padding: 0 0 0.4em;\n}\n\n.toggle__description {\n  opacity: 0.9;\n  font-size: 0.9em;\n}\n\n.toggle__control {\n  float: right;\n  padding: 0.5em 0 0;\n}\n\n.toggle__label {\n  position: relative;\n  display: block;\n  width: 100px;\n  height: 2em;\n  border-radius: 3px;\n}\n\n.toggle__label:before {\n  content: "";\n  display: block;\n  width: 40%;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  background: lightgray;\n  border-radius: 3px;\n  border: 3px solid red;\n}\n\n.toggle__input {\n  display: none;\n}\n\n.toggle__input + .toggle__label {\n  background: gray;\n}\n\n.toggle__input:checked + .toggle__label {\n  background: lightgray;\n}\n\n.toggle__input:checked + .toggle__label:before {\n  right: 0;\n  border-color: green;\n  background-color: greenyellow;\n}\n';
        var containerTemplate = function containerTemplate(version) {
            return '\n<div class="fullscreen-container">\n  <div class="fullscreen-background"></div>\n  <div id="fimod-settings" class="fullscreen-window">\n    <a class="fullscreen-window__close" href="javascript:void(0);" style="float:right; display: block;">Close</a>\n    <b class="fullscreen-window__title">fimod <em>' + version + '</em></b>\n    <p>Toggle modules below. Refresh to load changes.</p>\n    <div class="options"></div>\n  </div>\n</div>\n'
        };
        var inputTemplate = function inputTemplate(module) {
            return '\n<div class="toggle">\n  <div class="toggle__control">\n    <input type="checkbox" class="toggle__input" id="fimod-' + module.name + '">\n    <label for="fimod-' + module.name + '" class="toggle__label"></label>\n  </div>\n  <div class="toggle__info">\n    <div class="toggle__name">' + module.label + '</div>\n    <div class="toggle__description">' + module.description + "</div>\n  </div>\n</div>\n"
        };
        var buttonTemplate = '\n<a id="fimodButton" href="javascript:void(0);">fimod</a>\n';
        _fimod2.default.define({
            name: "settings",
            system: true,
            weight: -1
        }, ["ui/factory/MenuUi", "ui/FactoryUi"], function(MenuUi, FactoryUi) {
            (0, _utility.insertStyle)(style);

            function showFimodMenu() {
                var $container = $(containerTemplate(_fimod2.default.version));
                var $window = $(".fullscreen-window", $container);
                var $close = $(".fullscreen-window__close", $window);
                var $options = $(".options", $window);
                _fimod2.default.mods.filter(function(m) {
                    return !m.system
                }).map(function(module) {
                    var $element = $(inputTemplate(module));
                    var $input = $("input", $element);
                    $input.attr("checked", module.enabled);
                    $input.change(function(event) {
                        module.toggle(event.target.checked)
                    });
                    $options.append($element)
                });

                function closeFimodMenu() {
                    $container.remove()
                }
                $window.click(function(e) {
                    return e.stopPropagation()
                });
                $container.click(closeFimodMenu);
                $close.click(closeFimodMenu);
                $("body").append($container)
            }
            _fimod2.default.wrap(MenuUi, "display", function(supr) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key]
                }
                supr.apply(undefined, args);
                var $settings = $("#settingsButton");
                var $button = $(buttonTemplate);
                $button.click(showFimodMenu);
                $settings.after($button)
            })
        })
    }, {
        "../fimod": 1,
        "../lib/utility": 6
    }],
    15: [function(require, module, exports) {
        "use strict";
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor)
                }
            }
            return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor
            }
        }();
        var _Fimod = require("../Fimod");
        var _Fimod2 = _interopRequireDefault(_Fimod);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                "default": obj
            }
        }

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function")
            }
        }
        var FACTORY_TICK = "FACTORY_TICK";
        var FACTORY_COMPONENTS_CHANGED = "FACTORY_COMPONENTS_CHANGED";
        var REVERSE_EFFICIENCIES = ["sorterVertical", "sorterHorizontal", "garbageCollector"];
        _Fimod2.default.define({
            name: "showefficiency",
            label: "Show Building Efficiency",
            description: "Puts an colored icon on each building to show its efficiency"
        }, ["ui/factory/MapUi"], function(MapUi) {
            var colors = ["#FF0000", "#FF8000", "#FFC000", "#FFFF00", "#C0FF00", "#00FF00"];
            var namespace = "LayerEfficiency";
            var EfficiencyLayer = function() {
                function EfficiencyLayer(imageMap, factory, meta) {
                    _classCallCheck(this, EfficiencyLayer);
                    this.imageMap = imageMap;
                    this.factory = factory;
                    this.game = factory.getGame();
                    this.tileSize = meta.tileSize;
                    this.tilesX = factory.getMeta().tilesX;
                    this.tilesY = factory.getMeta().tilesY;
                    this.canvas = null;
                    this.cache = []
                }
                _createClass(EfficiencyLayer, [{
                    key: "getCanvas",
                    value: function getCanvas() {
                        return this.canvas
                    }
                }, {
                    key: "display",
                    value: function display(container) {
                        var _this = this;
                        this.container = container;
                        this.canvas = document.createElement("canvas");
                        this.canvas.style.position = "absolute";
                        this.canvas.width = this.tilesX * this.tileSize;
                        this.canvas.height = this.tilesY * this.tileSize;
                        this.canvas.style.pointerEvents = "none";
                        container.append(this.canvas);
                        this.buildCache();
                        this.redraw();
                        this.factory.getEventManager().addListener(namespace, FACTORY_TICK, function() {
                            if (_this.game.getTicker().getIsFocused()) {
                                _this.redraw()
                            }
                        });
                        this.factory.getEventManager().addListener(namespace, FACTORY_COMPONENTS_CHANGED, function() {
                            _this.buildCache();
                            _this.clear();
                            _this.redraw()
                        })
                    }
                }, {
                    key: "buildCache",
                    value: function buildCache() {
                        this.cache = this.factory.getTiles().filter(function(tile) {
                            return tile.isMainComponentContainer()
                        }).map(function(tile) {
                            return {
                                last: -1,
                                component: tile.getComponent()
                            }
                        })
                    }
                }, {
                    key: "clear",
                    value: function clear() {
                        var context = this.canvas.getContext("2d");
                        context.clearRect(0, 0, this.canvas.width, this.canvas.height)
                    }
                }, {
                    key: "redraw",
                    value: function redraw() {
                        var _this2 = this;
                        var context = this.canvas.getContext("2d");
                        this.cache.map(function(item) {
                            var last = item.last;
                            var component = item.component;
                            var data = component.getDescriptionData();
                            var effectiveness = data.effectivenessStr;
                            if (effectiveness === undefined) return;
                            var efficiency = parseInt(effectiveness);
                            if (isNaN(efficiency)) return;
                            if (last == efficiency) return;
                            item.last = efficiency;
                            _this2.drawEfficiency(context, component, efficiency)
                        })
                    }
                }, {
                    key: "drawEfficiency",
                    value: function drawEfficiency(context, component, efficiency) {
                        var tile = component.getMainTile();
                        var meta = component.getMeta();
                        var reverse = REVERSE_EFFICIENCIES.indexOf(meta.id) !== -1;
                        if (reverse) efficiency = 100 - efficiency;
                        var size = this.tileSize;
                        var iconSize = size / 6;
                        var x = tile.getX() * size + iconSize * 1.5;
                        var y = (tile.getY() + meta.height) * size - iconSize * 1.5;
                        context.fillStyle = colors[((colors.length - 1) * (efficiency / 100)).toFixed()];
                        context.beginPath();
                        context.arc(x, y, iconSize, 0, 2 * Math.PI);
                        context.fill()
                    }
                }]);
                return EfficiencyLayer
            }();
            _Fimod2.default.wrap(MapUi, "display", function(supr) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key]
                }
                supr.apply(undefined, args);
                if (this.efficiencyLayer === undefined) {
                    this.efficiencyLayer = new EfficiencyLayer(this.imageMap, this.factory, {
                        tileSize: this.tileSize
                    })
                }
                this.efficiencyLayer.display(this.element)
            })
        })
    }, {
        "../Fimod": 1
    }],
    16: [function(require, module, exports) {
        "use strict";
        var _Fimod = require("../Fimod");
        var _Fimod2 = _interopRequireDefault(_Fimod);
        var _utility = require("../lib/utility");

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                "default": obj
            }
        }
        var START_BACKGROUND_MODE = "START_BACKGROUND_MODE";
        var STOP_BACKGROUND_MODE = "STOP_BACKGROUND_MODE";
        var BACKGROUND_MODE_STARTED = "BACKGROUND_MODE_STARTED";
        var BACKGROUND_MODE_STOPPED = "BACKGROUND_MODE_STOPPED";
        var style = "\n#togglebgButton {\n  float: right;\n}\n";
        var buttonTemplate = '\n<a id="togglebgButton" href="javascript:void(0);">Background</a>\n';
        _Fimod2.default.define({
            name: "togglebackground",
            label: "Toggle Background Mode",
            description: "Disables automatic background mode and adds a manual toggle"
        }, ["ui/MainUi", "ui/factory/MenuUi", "ui/RunningInBackgroundInfoUi", "game/Ticker"], function(MainUi, MenuUi, RunningInBackgroundInfoUi, Ticker) {
            (0, _utility.insertStyle)(style);
            _Fimod2.default.wrap(MainUi, "display", function(supr) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key]
                }
                supr.apply(undefined, args);
                this.runningInBackgroundInfoUi.play = this.play
            });
            _Fimod2.default.wrap(MenuUi, "display", function(supr) {
                var _this = this;
                for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    args[_key2 - 1] = arguments[_key2]
                }
                supr.apply(undefined, args);
                var $box = $(".menuBox", this.container);
                var $button = $(buttonTemplate);
                $button.click(function() {
                    _this.globalUiEm.invokeEvent(START_BACKGROUND_MODE)
                });
                $box.append($button)
            });
            var runningNamespace = "RunningInBackgroundInfoUi";
            RunningInBackgroundInfoUi.prototype.delayedDisplay = function() {};
            _Fimod2.default.wrap(RunningInBackgroundInfoUi, "init", function() {
                var _this2 = this;
                this.globalUiEm.addListener(runningNamespace, START_BACKGROUND_MODE, function() {
                    _this2.play.game.getEventManager().invokeEvent(BACKGROUND_MODE_STARTED);
                    _this2.display()
                });
                this.globalUiEm.addListener(runningNamespace, STOP_BACKGROUND_MODE, function() {
                    _this2.play.game.getEventManager().invokeEvent(BACKGROUND_MODE_STOPPED);
                    _this2.hide()
                })
            });
            _Fimod2.default.wrap(RunningInBackgroundInfoUi, "display", function(supr) {
                var _this3 = this;
                for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                    args[_key3 - 1] = arguments[_key3]
                }
                supr.apply(undefined, args);
                var blur = function blur() {
                    _this3.globalUiEm.invokeEvent(STOP_BACKGROUND_MODE)
                };
                this.backgroundElement.click(blur);
                this.containerElement.click(blur)
            });
            var tickerNamespace = "Ticker";
            _Fimod2.default.wrap(Ticker, "init", function(supr) {
                var _this4 = this;
                supr();
                this.game.getEventManager().addListener(tickerNamespace, BACKGROUND_MODE_STARTED, function() {
                    _this4.startBackgroundMode()
                });
                this.game.getEventManager().addListener(tickerNamespace, BACKGROUND_MODE_STOPPED, function() {
                    _this4.stopBackgroundMode()
                })
            });
            Ticker.prototype.startBackgroundModeTimer = function() {};
            Ticker.prototype.startBackgroundMode = function() {
                this.focused = false;
                this.updateInterval()
            };
            Ticker.prototype.disableBackgroundMode = function() {};
            Ticker.prototype.stopBackgroundMode = function() {
                this.focused = true;
                this.updateInterval()
            }
        })
    }, {
        "../Fimod": 1,
        "../lib/utility": 6
    }]
}, {}, [7]);