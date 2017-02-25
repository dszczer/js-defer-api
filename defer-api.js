/**
 * Js Defer API.
 * @author Damian Szczerbiński
 * @license MIT
 * @version 1.1
 * @description This simple tricky API helps to defer script in specified order to load after HTML DOM is loaded.
 * I have idea about async and defer script tags, but not all browsers support them.
 * This API works fine on almost every browser.
 */

/**
 * Defer Render Chain. Better do not touch.
 * @type {Array}
 * @private
 */
var _DRC;

/**
 * Call specified function or load external script when executing defer chain.
 * @param s Function to call or external script to load.
 */
function DeferReady(s) {
  _DRC = _DRC || [];
  (s && s.constructor === Array) ? _DRC = _DRC.concat(s) : _DRC.push(s);
}

/**
 * Load specified scripts in order.
 * This function respect dependency chain loading, eg. load jQuery then his minions like jQuery UI.
 * @param {Array} s Array of path to external scripts or functions to call.
 */
function DeferRenderScriptSequence(s) {
  var a = (s && s.constructor === Array) ? s : (_DRC || []), c = [];
  for (var m = a.length - 1; m >= 0; m--) {
    c.push(
      (function (n) {
        return typeof a[n] === "function"
          ? function () {
            a[n]();
            var p = c.pop();
            typeof p === "function" ? p() : "";
          }
          : function () {DeferRenderScriptTag(a[n], c.pop());};
      })(m)
    );
  }
  c.pop().call();
}

/**
 * Append specified external script to the document's body.
 * @param s Web-relative path to external script.
 * @param o Optional function to call when script is loaded.
 */
function DeferRenderScriptTag(s, o) {
  var c = document.createElement("script");
  c.src = s;
  c.type = "text/javascript";
  typeof o === "function" ? c.onload = o : "";
  document.body.appendChild(c);
}