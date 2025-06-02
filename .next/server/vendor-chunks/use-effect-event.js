"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/use-effect-event";
exports.ids = ["vendor-chunks/use-effect-event"];
exports.modules = {

/***/ "(ssr)/./node_modules/use-effect-event/dist/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/use-effect-event/dist/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   useEffectEvent: () => (/* binding */ useEffectEvent)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js\");\n\nfunction useEffectEvent(fn) {\n    const ref = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);\n    return (0,react__WEBPACK_IMPORTED_MODULE_0__.useInsertionEffect)(()=>{\n        ref.current = fn;\n    }, [\n        fn\n    ]), (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((...args)=>{\n        const latestFn = ref.current;\n        return latestFn(...args);\n    }, []);\n}\n //# sourceMappingURL=index.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdXNlLWVmZmVjdC1ldmVudC9kaXN0L2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQWdFO0FBQ2hFLFNBQVNHLGVBQWVDLEVBQUU7SUFDeEIsTUFBTUMsTUFBTUwsNkNBQU1BLENBQUM7SUFDbkIsT0FBT0MseURBQWtCQSxDQUFDO1FBQ3hCSSxJQUFJQyxPQUFPLEdBQUdGO0lBQ2hCLEdBQUc7UUFBQ0E7S0FBRyxHQUFHRixrREFBV0EsQ0FBQyxDQUFDLEdBQUdLO1FBQ3hCLE1BQU1DLFdBQVdILElBQUlDLE9BQU87UUFDNUIsT0FBT0UsWUFBWUQ7SUFDckIsR0FBRyxFQUFFO0FBQ1A7QUFHRSxDQUNGLGlDQUFpQyIsInNvdXJjZXMiOlsid2VicGFjazovL3BsaXBsaTktcGFyYW5vcm1hbC8uL25vZGVfbW9kdWxlcy91c2UtZWZmZWN0LWV2ZW50L2Rpc3QvaW5kZXguanM/ODZmZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VSZWYsIHVzZUluc2VydGlvbkVmZmVjdCwgdXNlQ2FsbGJhY2sgfSBmcm9tIFwicmVhY3RcIjtcbmZ1bmN0aW9uIHVzZUVmZmVjdEV2ZW50KGZuKSB7XG4gIGNvbnN0IHJlZiA9IHVzZVJlZihudWxsKTtcbiAgcmV0dXJuIHVzZUluc2VydGlvbkVmZmVjdCgoKSA9PiB7XG4gICAgcmVmLmN1cnJlbnQgPSBmbjtcbiAgfSwgW2ZuXSksIHVzZUNhbGxiYWNrKCguLi5hcmdzKSA9PiB7XG4gICAgY29uc3QgbGF0ZXN0Rm4gPSByZWYuY3VycmVudDtcbiAgICByZXR1cm4gbGF0ZXN0Rm4oLi4uYXJncyk7XG4gIH0sIFtdKTtcbn1cbmV4cG9ydCB7XG4gIHVzZUVmZmVjdEV2ZW50XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwXG4iXSwibmFtZXMiOlsidXNlUmVmIiwidXNlSW5zZXJ0aW9uRWZmZWN0IiwidXNlQ2FsbGJhY2siLCJ1c2VFZmZlY3RFdmVudCIsImZuIiwicmVmIiwiY3VycmVudCIsImFyZ3MiLCJsYXRlc3RGbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/use-effect-event/dist/index.js\n");

/***/ })

};
;