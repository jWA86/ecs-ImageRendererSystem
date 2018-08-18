(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("ecs-framework"), require("gl-matrix"));
	else if(typeof define === 'function' && define.amd)
		define(["ecs-framework", "gl-matrix"], factory);
	else if(typeof exports === 'object')
		exports["ecs-imagerenderersystem"] = factory(require("ecs-framework"), require("gl-matrix"));
	else
		root["ecs-imagerenderersystem"] = factory(root["ecs-framework"], root["gl-matrix"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var asset_1 = __webpack_require__(4);
exports.ImageAtlas = asset_1.ImageAtlas;
var CanvasResizeSystem_1 = __webpack_require__(5);
exports.CanvasResizeSystem = CanvasResizeSystem_1.CanvasResizeSystem;
var ClearCanvasSystem_1 = __webpack_require__(6);
exports.ClearCanvasSystem = ClearCanvasSystem_1.ClearCanvasSystem;
var ImageComponent_1 = __webpack_require__(7);
exports.ImageComponent = ImageComponent_1.ImageComponent;
var ImageRendererSystem_1 = __webpack_require__(8);
exports.ImageRendererSystem = ImageRendererSystem_1.ImageRendererSystem;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ImageAtlas = /** @class */ (function () {
    function ImageAtlas() {
        this.image = new Image();
    }
    ImageAtlas.prototype.loadImg = function (url) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.image = new Image();
            _this.image.onload = function () {
                resolve(url);
            };
            _this.image.onerror = function () {
                reject(url);
            };
            _this.image.onabort = function () {
                reject(url);
            };
            _this.image.src = url;
        });
    };
    return ImageAtlas;
}());
exports.ImageAtlas = ImageAtlas;
// Factory de ImageAtlas ?


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ecs_framework_1 = __webpack_require__(0);
/** Resize the canvas when the client size change */
var CanvasResizeSystem = /** @class */ (function (_super) {
    __extends(CanvasResizeSystem, _super);
    function CanvasResizeSystem(canvas) {
        var _this = _super.call(this) || this;
        _this.canvas = canvas;
        _this.active = true;
        _this._defaultParameter = {};
        return _this;
    }
    CanvasResizeSystem.prototype.process = function () {
        var canvas = this.canvas;
        var cssToRealPixels = window.devicePixelRatio || 1;
        var displayWidth = Math.floor(canvas.clientWidth * cssToRealPixels);
        var displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);
        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }
    };
    CanvasResizeSystem.prototype.execute = function () { };
    return CanvasResizeSystem;
}(ecs_framework_1.System));
exports.CanvasResizeSystem = CanvasResizeSystem;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ecs_framework_1 = __webpack_require__(0);
var ClearCanvasSystem = /** @class */ (function (_super) {
    __extends(ClearCanvasSystem, _super);
    function ClearCanvasSystem(context, canvas) {
        var _this = _super.call(this) || this;
        _this.context = context;
        _this.canvas = canvas;
        _this.active = true;
        _this._defaultParameter = {};
        return _this;
    }
    ClearCanvasSystem.prototype.process = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    ClearCanvasSystem.prototype.execute = function () { };
    return ClearCanvasSystem;
}(ecs_framework_1.System));
exports.ClearCanvasSystem = ClearCanvasSystem;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gl_matrix_1 = __webpack_require__(1);
var ImageComponent = /** @class */ (function () {
    function ImageComponent(imageId, dimension, sourcePosition, sourceSize, center, transformation, zIndex) {
        if (dimension === void 0) { dimension = gl_matrix_1.vec3.create(); }
        if (sourcePosition === void 0) { sourcePosition = gl_matrix_1.vec2.create(); }
        if (sourceSize === void 0) { sourceSize = gl_matrix_1.vec2.create(); }
        if (center === void 0) { center = gl_matrix_1.vec3.create(); }
        if (transformation === void 0) { transformation = gl_matrix_1.mat4.create(); }
        if (zIndex === void 0) { zIndex = 1; }
        this.imageId = imageId;
        this.dimension = dimension;
        this.sourcePosition = sourcePosition;
        this.sourceSize = sourceSize;
        this.center = center;
        this.transformation = transformation;
        this.zIndex = zIndex;
        this.entityId = 0;
        this.active = true;
    }
    return ImageComponent;
}());
exports.ImageComponent = ImageComponent;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ecs_framework_1 = __webpack_require__(0);
var gl_matrix_1 = __webpack_require__(1);
var ImageRendererSystem = /** @class */ (function (_super) {
    __extends(ImageRendererSystem, _super);
    function ImageRendererSystem(context, imgAtlasManager) {
        var _this = _super.call(this) || this;
        _this.context = context;
        _this.imgAtlasManager = imgAtlasManager;
        _this._defaultParameter = {
            center: gl_matrix_1.vec3.create(),
            dimension: gl_matrix_1.vec3.create(),
            imageAtlasId: 0,
            sourcePosition: gl_matrix_1.vec2.create(),
            sourceSize: gl_matrix_1.vec2.create(),
            transformation: gl_matrix_1.mat4.create(),
            zIndex: 1,
        };
        return _this;
    }
    ImageRendererSystem.prototype.process = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        _super.prototype.process.apply(this, args);
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    };
    ImageRendererSystem.prototype.execute = function (params) {
        // // a	m11 : glM : m00 [0]
        // // b	m12 : glM : m01 [1]
        // // c	m21 : glM : m10 [4]
        // // d	m22 : glM : m11 [5]
        // // e	m41 : glM : m30 [12]
        // // f	m42 : glM : m31 [13]
        var t = params.transformation[this._k.transformation];
        this.context.setTransform(t[0], t[1], t[4], t[5], t[12], t[13]);
        var atlas = this.imgAtlasManager.get(params.imageAtlasId[this._k.imageAtlasId]);
        if (atlas === undefined) {
            return;
        }
        var image = atlas.image;
        this.context.drawImage(image, params.sourcePosition[this._k.sourcePosition][0], params.sourcePosition[this._k.sourcePosition][1], params.sourceSize[this._k.sourceSize][0], params.sourceSize[this._k.sourceSize][1], 0, 0, params.sourceSize[this._k.sourceSize][0], params.sourceSize[this._k.sourceSize][1]);
    };
    return ImageRendererSystem;
}(ecs_framework_1.System));
exports.ImageRendererSystem = ImageRendererSystem;


/***/ })
/******/ ]);
});