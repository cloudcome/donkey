/**
 * object
 * @author ydr.me
 * @create 2015-07-17 13:12
 */


define(function (require, exports, module) {
    'use strict';


// ES5 15.2.3.14 Object.keys ( O )
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
        Object.keys = function (o) {
            if (o !== Object(o)) {
                throw TypeError('Object.keys called on non-object');
            }
            var ret = [], p;
            for (p in o) {
                if (Object.prototype.hasOwnProperty.call(o, p)) {
                    ret.push(p);
                }
            }
            return ret;
        };
    }


    // ES5 15.2.3.2 Object.getPrototypeOf ( O )
// From http://ejohn.org/blog/objectgetprototypeof/
// NOTE: won't work for typical function T() {}; T.prototype = {}; new T; case
// since the constructor property is destroyed.
    if (!Object.getPrototypeOf) {
        Object.getPrototypeOf = function (o) {
            if (o !== Object(o)) {
                throw TypeError("Object.getPrototypeOf called on non-object");
            }
            return o.__proto__ || o.constructor.prototype || Object.prototype;
        };
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
    if (!Object.create) {
        // Production steps of ECMA-262, Edition 5, 15.2.3.5
        // Reference: http://es5.github.io/#x15.2.3.5
        Object.create = (function() {
            // To save on memory, use a shared constructor
            function Temp() {}

            // make a safe reference to Object.prototype.hasOwnProperty
            var hasOwn = Object.prototype.hasOwnProperty;

            return function (O) {
                // 1. If Type(O) is not Object or Null throw a TypeError exception.
                if (typeof O != 'object') {
                    throw TypeError('Object prototype may only be an Object or null');
                }

                // 2. Let obj be the result of creating a new object as if by the
                //    expression new Object() where Object is the standard built-in
                //    constructor with that name
                // 3. Set the [[Prototype]] internal property of obj to O.
                Temp.prototype = O;
                var obj = new Temp();
                Temp.prototype = null; // Let's not keep a stray reference to O...

                // 4. If the argument Properties is present and not undefined, add
                //    own properties to obj as if by calling the standard built-in
                //    function Object.defineProperties with arguments obj and
                //    Properties.
                if (arguments.length > 1) {
                    // Object.defineProperties does ToObject on its first argument.
                    var Properties = Object(arguments[1]);
                    for (var prop in Properties) {
                        if (hasOwn.call(Properties, prop)) {
                            obj[prop] = Properties[prop];
                        }
                    }
                }

                // 5. Return obj
                return obj;
            };
        })();
    }


    // ES 15.2.3.6 Object.defineProperty ( O, P, Attributes )
// Partial support for most common case - getters, setters, and values
    (function() {
        if (!Object.defineProperty ||
            !(function () { try { Object.defineProperty({}, 'x', {}); return true; } catch (e) { return false; } } ())) {
            var orig = Object.defineProperty;
            Object.defineProperty = function (o, prop, desc) {
                // In IE8 try built-in implementation for defining properties on DOM prototypes.
                if (orig) { try { return orig(o, prop, desc); } catch (e) {} }

                if (o !== Object(o)) { throw TypeError("Object.defineProperty called on non-object"); }
                if (Object.prototype.__defineGetter__ && ('get' in desc)) {
                    Object.prototype.__defineGetter__.call(o, prop, desc.get);
                }
                if (Object.prototype.__defineSetter__ && ('set' in desc)) {
                    Object.prototype.__defineSetter__.call(o, prop, desc.set);
                }
                if ('value' in desc) {
                    o[prop] = desc.value;
                }
                return o;
            };
        }
    }());
});