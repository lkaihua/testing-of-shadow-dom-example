/**
 * A simple helper to replace `switch`.
 * @param key
 * @param obj
 * @example
 *
 * // return matching branch
 * switcher({ one: "yi", two: "er", three: "san"}).case('one') === "yi";
 *
 * // return default branch
 * switcher({ one: "yi", two: "er", three: "san", default: "Chinese"}).case('x') === "Chinese";
 * switcher({ one: "yi", two: "er", three: "san", default: "Chinese"}).default() === "Chinese";
 *
 * // if no default defined, return first branch
 * switcher({ one: "yi", two: "er", three: "san"}).case('x') === "yi";
 */

function Switcher(obj) {
  this.obj = obj;
  this.keys = Object.keys(obj);
}

Switcher.prototype.case = function (key) {
  if (this.keys.indexOf(key) !== -1) {
    return this.obj[key];
  }

  if (this.keys.indexOf('default') !== -1) {
    return this.obj.default;
  }

  return this.obj[this.keys[0]];
};

Switcher.prototype.default = function () {
  return this.case('default');
};

exports.switcher = function (obj) {
  return new Switcher(obj);
};
