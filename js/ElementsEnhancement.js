define([], function() {

    'use strict'

    /**
      * @desc query selector to one element
      * @param string - string selector
      * @return HTMLElement - first element that satisfies query
    */
    function $() {
        var qs = document.querySelector;
        return qs.apply(document, [].slice.apply(arguments));
    }

    /**
      * @desc query selector to all elements
      * @param string - string selector
      * @return HTMLElement - all elements that satisfy query
    */
    function $all() {
        var qs = document.querySelectorAll;
        return qs.apply(document, [].slice.apply(arguments));
    }

    function hasClass(target, className) {
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
    }

    HTMLElement.prototype.hasClass = function(className) {
        return hasClass(this, className);
    }

    HTMLElement.prototype.addClass = function(className) {
        this.classList.add(className);
    }

    HTMLElement.prototype.removeClass = function(className) {
        this.classList.remove(className);
    }

    HTMLElement.prototype.toggleClass = function(className) {
        this.classList.toggle(className);
    }

    HTMLElement.prototype.getNumericStyle = function(styleName) {
        return +window.getComputedStyle(this, null).getPropertyValue(styleName).replace(/[^\d]+/, '');
    }

    return {
        one: $,
        all: $all
    }

});
