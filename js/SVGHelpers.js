define([], function() {

    // TODO: implement element entity

    'use strict'
    var SVG = function (surfaceElem) {
        this.svgNS = 'http://www.w3.org/2000/svg';
        if (!surfaceElem) {
            surfaceElem = document.createElementNS(this.svgNS, 'svg');
        }
        this.surface = surfaceElem;
        this.bufferNode = surfaceElem;
    }

    /**
      * @desc clears (removes all nodes of) current surface
      * @return void
    */
    SVG.prototype.clearSurface = function clear() {
        var node = this.bufferNode.firstChild,
            next;

        while (node) {
            next = node.nextSibling;
            if (node.tagName != "defs") {
                node.parentNode.removeChild(node);
            } else {
                clear.call({ bufferNode: node });
            }
            node = next;
        }
    }

    /**
      * @desc makes possible to attach events to surface by adding them to SVG object
      * @param [] arguments - all arguments that can be provided in default addEventListener
      * @return void
    */
    SVG.prototype.addEventListener = function() {
        document.addEventListener.apply(this.surface, arguments);
    }

    /**
      * @desc makes possible to detach events from surface by removing them from SVG object
      * @param [] arguments - all arguments that can be provided in default removeEventListener
      * @return void
    */
    SVG.prototype.removeEventListener = function() {
        document.removeEventListener.apply(this.surface, arguments);
    }

    /**
      * @desc adds all attributes provided in attrs to element provided in elem
      * @param Element/HTMLElement elem - element to attach attrs to
      * @param Object attrs - all attributes to attach, provided by key/value pairs
      * @return void
    */
    SVG.prototype.addAttrs = function(elem, attrs) {
        if (typeof attrs != 'object') {
            return;
        }
        for (var attr in attrs) {
            elem.setAttribute(attr.toString(), attrs[attr]);
        }
    }

    /**
      * @desc draws round rect
      * @param double x - left coord
      * @param double y - top coord
      * @param double w - width
      * @param double h - height
      * @param double rx - x of border radius
      * @param double ry - y of border radius
      * @return void
    */
    SVG.prototype.roundRect = function(x, y, w, h, rx, ry, id) {
        var rect = document.createElementNS(this.svgNS, 'rect');

        this.addAttrs(rect, {
            'x': x,
            'y': y,
            'rx': rx,
            'ry': ry,
            'width': w,
            'height': h,
            'id': id
        });

        this.surface.appendChild(rect);
    }

    /**
      * @desc draws line
      * @param double x1
      * @param double y1
      * @param double x2
      * @param double y2
      * @return void
    */
    SVG.prototype.line = function(x1, y1, x2, y2) {
        var line = document.createElementNS(this.svgNS, 'line');

        this.addAttrs(line, {
            'x1': x1,
            'y1': y1,
            'x2': x2,
            'y2': y2
        });

        this.surface.appendChild(line);
    }

    /**
      * @desc draws a simple Bezier curve
      * @param double x1 - the beginning point's x value
      * @param double y1 - the beginning point's y value
      * @param double x2 - the ending point's x value
      * @param double y2 - the ending point's y value
      * @return void
    */
    SVG.prototype.simpleBezier = function(x1, y1, x2, y2) {
        var path = document.createElementNS(this.svgNS, 'path'),
            cmd = [];

        cmd.push('M' + x1 + ',' + y1);
        cmd.push('C' + x1 + ',' + y2);
        cmd.push(x2 + ',' + (y1 + (y1 - y2) / 10));
        cmd.push(x2 + ',' + y2);
        path.setAttribute('d', cmd.join(' '));
        this.surface.appendChild(path);
    }

    return SVG;
});
