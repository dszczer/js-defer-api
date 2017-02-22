/**
 * Js Defer API.
 * @author Damian Szczerbiński
 * @license MIT
 * @version 1.0
 * @requires vanillaJS, no external dependencies
 * @description This simple tricky API helps to defer script in specified order to load after HTML DOM is loaded.
 * I have idea about async and defer script tags, but not all browsers support them.
 * This API works fine on almost every browser.
 */

/**
 * Global defer chain. Better do not touch.
 * @type {Array}
 * @private
 */
var _DeferReadyArr = [];

/**
 * Call specified function when executing defer chain.
 * @param function func Function to call.
 */
function DeferReady(func) {
  if (typeof func === "function") {
    _DeferReadyArr.push(func);
  } else {
    console.warn("DeferReady: \"func\" is not a function");
  }
}

/**
 * Load specified scripts in order.
 * This function respect dependency chain loading, eg. load jQuery then his minions like jQuery UI.
 * @param Array srcArr List of path to external scripts or functions to call.
 */
function DeferRenderScriptSequence(srcArr) {
  if (srcArr.length > 1) {
    var chain = [];
    for (var m = srcArr.length - 1; m >= 0; m--) {
      chain.push(
        (function (n) {
          if (typeof srcArr[n] == "function") {
            return function () {
              srcArr[n].call();
              var cp = chain.pop();
              if(typeof cp == "function") {
                cp.call();
              }
            }
          } else {
            return function () {
              DeferRenderScriptTag(srcArr[n], chain.pop());
            }
          }
        })(m)
      );
    }
    chain.pop().call();
  } else {
    DeferRenderScriptTag(srcArr[0]);
  }
}

/**
 * Append specified external script to the document's body.
 * @param src Web-relative path to external script.
 * @param onload Optional function to call when script is loaded.
 */
function DeferRenderScriptTag(src, onload) {
  var script = document.createElement("script");
  script.src = src;
  script.type = "text/javascript";
  if (typeof onload === "function") {
    script.onload = onload;
  } else if (typeof onload !== "undefined") {
    console.warn("DeferRenderScriptTag: \"onload\" is not a function");
  }
  document.body.appendChild(script);
}
