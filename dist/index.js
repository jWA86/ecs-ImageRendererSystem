(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("ecs-framework"));
	else if(typeof define === 'function' && define.amd)
		define(["ecs-framework"], factory);
	else if(typeof exports === 'object')
		exports["ecs-imagerenderersystem"] = factory(require("ecs-framework"));
	else
		root["ecs-imagerenderersystem"] = factory(root["ecs-framework"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_5__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var asset_1 = __webpack_require__(2);
exports.ImageAtlas = asset_1.ImageAtlas;
var ImageComponent_1 = __webpack_require__(3);
exports.ImageComponent = ImageComponent_1.ImageComponent;
var ImageRendererSystem_1 = __webpack_require__(4);
exports.ImageRendererSystem = ImageRendererSystem_1.ImageRendererSystem;


/***/ }),
/* 2 */
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ImageComponent = /** @class */ (function () {
    function ImageComponent(entityId, active, image, sourcePosition, sourceSize, destPosition, destSize, rotation, zIndex) {
        if (rotation === void 0) { rotation = 0; }
        if (zIndex === void 0) { zIndex = 0; }
        this.entityId = entityId;
        this.active = active;
        this.image = image;
        this.sourcePosition = sourcePosition;
        this.sourceSize = sourceSize;
        this.destPosition = destPosition;
        this.destSize = destSize;
        this.rotation = rotation;
        this.zIndex = zIndex;
    }
    return ImageComponent;
}());
exports.ImageComponent = ImageComponent;


/***/ }),
/* 4 */
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
var ecs_framework_1 = __webpack_require__(5);
var ImageRendererSystem = /** @class */ (function (_super) {
    __extends(ImageRendererSystem, _super);
    function ImageRendererSystem(context) {
        var _this = _super.call(this) || this;
        _this.context = context;
        return _this;
    }
    ImageRendererSystem.prototype.process = function (args) {
        _super.prototype.process.call(this, args);
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    };
    ImageRendererSystem.prototype.execute = function (imgC, sourcePositionC, sourceSizeC, destPositionC, destSizeC, rotationC) {
        var imgCenterX = destSizeC.destSize[0] / 2;
        var imgCenterY = destSizeC.destSize[1] / 2;
        this.context.setTransform(1, 0, 0, 1, imgCenterX, imgCenterY);
        this.context.rotate(rotationC.rotation);
        this.context.drawImage(imgC.image, sourcePositionC.sourcePosition[0], sourcePositionC.sourcePosition[1], sourceSizeC.sourceSize[0], sourceSizeC.sourceSize[1], destPositionC.destPosition[0] - imgCenterX, destPositionC.destPosition[1] - imgCenterY, destSizeC.destSize[0], destSizeC.destSize[1]);
    };
    return ImageRendererSystem;
}(ecs_framework_1.System));
exports.ImageRendererSystem = ImageRendererSystem;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ })
/******/ ]);
});