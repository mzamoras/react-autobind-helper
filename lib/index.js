'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 The MIT License (MIT)

 Copyright (c) 2017 Miguel Zamora Serrano

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

var lifecycleMethods = {
    constructor: 1,
    render: 1,
    shouldComponentUpdate: 1,
    componentWillMount: 1,
    componentDidMount: 1,
    componentWillReceiveProps: 1,
    componentWillUpdate: 1,
    componentDidUpdate: 1,
    componentWillUnmount: 1
};

function autobind(object, filter) {
    var filterLifecycle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var bindSetState = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;


    var proto = object.constructor.prototype;
    var filterIsFunction = typeof filter === 'function';
    var filterIsObject = !!filter && (typeof filter === 'undefined' ? 'undefined' : _typeof(filter)) === 'object';
    var filterIsString = typeof filter === 'string';
    var methods = Object.getOwnPropertyNames(proto);

    var defaultFilter = function defaultFilter(key) {
        return typeof proto[key] === 'function' && (filterLifecycle ? !lifecycleMethods[key] : true);
    };

    var givenMethodsToFilter = function givenMethodsToFilter(key) {
        var isFunction = typeof proto[key] === 'function';
        var isConstructor = key === 'constructor';
        var isIncludable = isConstructor ? !filterLifecycle : !!filter[key];
        var isLifecycle = !!lifecycleMethods[key];

        if (filterLifecycle) {
            return isFunction && isIncludable;
        }
        return !isLifecycle ? isIncludable : typeof filter[key] === 'undefined' ? true : !!filter[key];
    };

    var filterPrefix = function filterPrefix(key) {
        var isFunction = typeof proto[key] === 'function';
        var hasPrefix = key.indexOf(filter) === 0;
        var isIncludable = filterLifecycle ? !lifecycleMethods[key] : true;
        return isFunction && hasPrefix && isIncludable;
    };

    var SelectedFilter = filterIsFunction ? filter : filterIsObject ? givenMethodsToFilter : filterIsString ? filterPrefix : defaultFilter;

    var names = methods.filter(SelectedFilter);
    if (bindSetState) names.push('setState');

    names.forEach(function (key) {
        object[key] = object[key].bind(object);
    });

    return object;
}

exports.default = autobind;