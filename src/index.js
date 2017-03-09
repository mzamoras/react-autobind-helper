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

const lifecycleMethods = {
    constructor              : 1,
    render                   : 1,
    shouldComponentUpdate    : 1,
    componentWillMount       : 1,
    componentDidMount        : 1,
    componentWillReceiveProps: 1,
    componentWillUpdate      : 1,
    componentDidUpdate       : 1,
    componentWillUnmount     : 1
};

function autobind( object, filter, filterLifecycle = true, bindSetState = true ) {

    const proto            = object.constructor.prototype;
    const filterIsFunction = typeof filter === 'function';
    const filterIsObject   = !!filter && typeof filter === 'object';
    const filterIsString   = typeof filter === 'string';
    const methods          = Object.getOwnPropertyNames( proto );

    const defaultFilter = function ( key ) {
        return typeof proto[key] === 'function' && ( filterLifecycle ? !lifecycleMethods[key] : true);
    };

    const givenMethodsToFilter = function ( key ) {
        const isFunction    = typeof proto[key] === 'function';
        const isConstructor = key === 'constructor';
        const isIncludable  = isConstructor ? !filterLifecycle : !!filter[key];
        const isLifecycle   = !!lifecycleMethods[key];

        if ( filterLifecycle ) {
            return isFunction && isIncludable;
        }
        return !isLifecycle ? isIncludable : typeof filter[key] === 'undefined' ? true : !!filter[key];
    };

    const filterPrefix = function ( key ) {
        const isFunction   = typeof proto[key] === 'function';
        const hasPrefix    = key.indexOf( filter ) === 0;
        const isIncludable = filterLifecycle ? !lifecycleMethods[key] : true;
        return isFunction && hasPrefix && isIncludable;
    };

    const SelectedFilter = filterIsFunction
        ? filter
        : filterIsObject ? givenMethodsToFilter :
            filterIsString
                ? filterPrefix
                : defaultFilter;

    const names = methods.filter( SelectedFilter );
    if ( bindSetState ) names.push( 'setState' );

    names.forEach( function ( key ) {
        object[key] = object[key].bind( object );
    } );

    return object;
}

export default autobind;