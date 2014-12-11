define(['Helper'], function(Helpers) {

    'use strict'
// TODO: this code should be optimized ASAP and all functionality is completed


    var svgNS = 'http://www.w3.org/2000/svg',
        arrowEndMarker = '<marker id="Triangle" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto">';

    var SVGElement = function(node) {
        this.svg = null;
        this.id = Helpers.generateGuid();
        this.node = node || document.createElementNS(svgNS, 'g');

        return this;
    }

    /**
      * @desc adds all attributes provided in attrs to element
      * @param Object attrs - all attributes to attach, provided by key/value pairs
      * @return void
    */
    SVGElement.prototype.addAttrs = function(attrs) {
        if (typeof attrs != 'object' || !attrs) {
            return;
        }
        for (var attr in attrs) {
            if (attr === 'id') {
                this.id = attrs[attr];
            }
            if (!attr) {
                continue;
            }
            this.node.setAttribute(attr.toString(), attrs[attr]);
        }
        return this;
    }

    /**
      * @desc applies gradient to element by provided gradient ID
      * @param string gradientId - gradient ID to be applied
      * @return void
    */
    SVGElement.prototype.applyGradient = function(gradientId) {
        this.addAttrs({
            'fill': 'url(#' + gradientId + ')'
        });

        return this;
    }

    SVGElement.prototype.getBoundingRect = function() {
        var box = this.node.getBoundingClientRect(),
            width = box.right - box.left,
            height = box.bottom - box.top;

        return {
            x: box.left - width / 4,
            y: box.top - height / 4,
            width: width * 1.5,
            height: height * 1.5
        }
    }

    SVGElement.prototype.show = function() {
        this.node.classList.remove('hidden');
    }

    SVGElement.prototype.hide = function() {
        this.node.classList.add('hidden');
    }

    var SVG = function (surfaceElem, textContainer) {
        var defs, trianglePath;

        trianglePath = new SVGElement(document.createElementNS(svgNS, 'path')).
            addAttrs({
                'd': 'M 0 0 L 10 5 L 0 10 z',
                'fill': 'black'
            });

        if (!surfaceElem) {
            surfaceElem = document.createElementNS(svgNS, 'svg');
        }
        this.surface = surfaceElem;
        if (!(defs = surfaceElem.querySelector('defs'))) {
            defs = document.createElementNS(svgNS, 'defs');
            this.surface.appendChild(defs);
        }
        this.textContainer = textContainer;
        this.defs = this.surface.querySelector('defs');
        this.elementsCollection = [];

        this.selectionRect = null;
        this.arrowEndMarker = new SVGElement(document.createElementNS(svgNS, 'marker')).
            addAttrs({
                'id': 'triangle',
                'viewBox': '0 0 10 10',
                'refX': '1',
                'refY': '5',
                'markerWidth': '8',
                'markerHeight': '8',
                'orient': 'auto'
            });
        this.arrowEndMarker.originalVals = {
            width: 8,
            height: 8
        }
        this.arrowEndMarker.node.appendChild(trianglePath.node);

        this.markerUsed = false;
    }

    SVG.prototype.scaleMarker = function(scale) {
        if (!this.arrowEndMarker) {
            return;
        }
        var vals = this.arrowEndMarker.originalVals;
        this.arrowEndMarker.addAttrs({
            'markerWidth': vals.width * scale,
            'markerHeight': vals.height * scale
        });
    }

    SVG.prototype.getMarkerHeight = function() {
        return this.arrowEndMarker && this.arrowEndMarker.originalVals.height || 0;
    }

    /**
      * @desc clears (removes all nodes of) current surface + all defs
      * @return void
    */
    SVG.prototype.clearAll = function clear() {
        var node = arguments[0] || this.surface.firstChild,
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

        this.elementsCollection = [];
    }

    /**
      * @desc clears (removes all nodes of) current surface, leaves all existing defs
      * @return void
    */
    SVG.prototype.clearSurface = function clear() {
        var node = this.surface.firstChild,
            next;

        while (node) {
            next = node.nextSibling;
            if (node.tagName != "defs") {
                node.parentNode.removeChild(node);
            }
            node = next;
        }

        node = this.textContainer.firstChild;

        while (node) {
            next = node.nextSibling;
            node.parentNode.removeChild(node);
            node = next;
        }

        this.elementsCollection = [];
    }

    /**
      * @desc clears (removes all nodes of) current surface, leaves all existing defs
      * @return void
    */
    SVG.prototype.clearDefs = function clear() {
        var node = this.defs.firstChild,
            next;

        while (node) {
            next = node.nextSibling;
            if (node.tagName != "defs") {
                node.parentNode.removeChild(node);
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
      * @desc adds new entry of linear gradient to defs element
      * @param object objExpose - object with key/value pairs to form the gradient
      * @return void
    */
    SVG.prototype.defineLinearGradient = function(objExpose) {

        function addStops(stopObj) {
            var stop;
            stop = new SVGElement(document.createElementNS(svgNS, 'stop'));
            stop.addAttrs({
                'offset': stopObj.offset,
                'stop-color': stopObj.stopColor
            });
            this.node.appendChild(stop.node);
        }

        var gradient = new SVGElement(document.createElementNS(svgNS, 'linearGradient'));
        gradient.addAttrs({
            'spreadMethod': 'pad',
            'id': objExpose.id || 'lg-default',
            'gradientTransform': 'rotate(' + (objExpose.rotationAngle || 0) + ')'
        });
        gradient.addStops = addStops;

        [].forEach.call(objExpose.stopNodes, function(stopNode) {
            gradient.addStops(stopNode);
        })

        this.defs.appendChild(gradient.node);

        return this;
    }

    SVG.prototype.defineEndMarker = function() {
        this.defs.appendChild(this.arrowEndMarker.node);
        this.markerUsed = true;

        return this;
    }

    /**
      * @desc returns SVGElement by given ID
      * @param string id - given ID
      * @return SVGElement
    */
    SVG.prototype.getElementById = function(id) {
        var element = null;
        [].forEach.call(this.elementsCollection, function(elem) {
            if (elem.id === id) {
                element = elem;
            }
        });
        return element;
    }

    /**
      * @desc moves selection rectangle to contain provided element
      * @param SVGElement/string elem - provided element
      * @return void
    */
    SVG.prototype.moveSelectionRect = function(elem) {
        var boxAttrs;

        if (typeof elem === 'string') {
            elem = this.getElementById(elem);
        }

        if (!this.selectionRect) {
            this.selectionRect = new SVGElement(document.createElementNS(svgNS, 'rect'));
            this.selectionRect.addAttrs({
                'id': 'selectionRect',
                'fill': 'none',
                'stroke': 'black',
                'stroke-width': '1',
                'stroke-dasharray':'10, 5, 5, 10'
            });
        }

        this.surface.appendChild(this.selectionRect.node);

        boxAttrs = elem.getBoundingRect();
        this.selectionRect.addAttrs(boxAttrs);
        this.showSelectionRect();
    }

    SVG.prototype.reflowSelectionRect = function() {
        if (this.selectionRect) {
            this.surface.appendChild(this.selectionRect.node);
        }
    }

    SVG.prototype.hideSelectionRect = function() {
        if (this.selectionRect) {
            this.selectionRect.hide();
        }
    }

    SVG.prototype.showSelectionRect = function() {
        if (this.selectionRect) {
            this.selectionRect.show();
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
      * @return SVGElement Created rounded rectangle
    */
    SVG.prototype.roundRect = function(x, y, w, h, rx, ry) {
        var rect = new SVGElement(document.createElementNS(svgNS, 'rect')),
            attrObj;

        attrObj = {
            'x': x,
            'y': y,
            'rx': rx,
            'ry': ry,
            'width': w,
            'height': h
        }

        rect.addAttrs(attrObj);
        //rect.svg = this.surface;

        this.elementsCollection.push(rect);

        this.surface.appendChild(rect.node);

        return rect;
    }

    SVG.prototype.group = function() {
        var group = new SVGElement(),
            self = this;

        function groupAddElement(group, elName, obj) {
            var el = new SVGElement(document.createElementNS(svgNS, elName));

            el.addAttrs(obj);

            group.node.appendChild(el.node);
            return el;
        }

        group.addPath = function (pathString, addMarker) {
            groupAddElement(this, 'path', {
                'd': pathString,
                'stroke-width': '1',
                //'shape-rendering': 'crispEdges',
                'marker-end': addMarker ? 'url(#triangle)' : ''
            })

            return this;
        }

        group.addRect = function (x, y, w, h, rx, ry) {
            self.roundRect.apply({
                surface: this.node,
                elementsCollection: this.elementsCollection || []
            }, arguments);

            return this;
        }

        group.addText = function (baseText, x, y, width, height, scale) {
            var isExisting = document.querySelector('div[data-id="' + baseText + '"]'),
                //container = document.querySelector('#textNodes'),
                textDiv = document.createElement('div'),
                textNode = document.createTextNode(baseText),
                baseStyle = [
                    'font-size: ' + scale + 'px',
                    'line-height: ' + scale + 'px',
                    'left : ' + x + 'px',
                    'top : ' + y + 'px',
                    'width: ' + width + 'px',
                    'height: ' + height + 'px;'
                ].join('; ');

            if (isExisting) {
                isExisting.setAttribute('style', baseStyle);
            } else {
                textDiv.setAttribute('data-id', baseText)
                textDiv.setAttribute('style', baseStyle);
                textDiv.setAttribute('class', 'textNode');
                textDiv.appendChild(textNode);
                self.textContainer.appendChild(textDiv);

            }

            // self.text.apply({
            //     surface: this.node,
            //     elementsCollection: this.elementsCollection || []
            // }, arguments);

            return this;
        }

        this.elementsCollection.push(group);
        this.surface.appendChild(group.node);

        return group;
    }

    SVG.prototype.text = function (baseText, x, y, maxChars, maxHeight, fontSize) {
        var text = new SVGElement(document.createElementNS(svgNS, 'text')),
            line = '', testline, lineHeight,
            tspan, ttext, counter = 0, maxCounter;

        text.addAttrs({
            'x': x,
            'y': y,
            'font-size': 10,
            'text-anchor': 'middle'
        });

        maxChars = maxChars || 10;
        lineHeight = 10;
        maxCounter = maxHeight ? maxHeight * 0.5 / lineHeight : 3;

        for (var i = 0, n = baseText.length; i < n && counter < maxCounter; i++) {

            testline = line + baseText[i];
            if (testline.length > maxChars)
            {
                tspan = new SVGElement(document.createElementNS(svgNS, 'tspan'));
                tspan.addAttrs({
                    'x': x,
                    'y': y
                });
                if (counter + 1 === maxCounter) {
                    line += '...';
                }
                ttext = document.createTextNode(line);
                tspan.node.appendChild(ttext);
                text.node.appendChild(tspan.node);

                line = baseText[i];
                y += lineHeight;
                counter++;
            }
            else {
                line = testline;
            }
        }

        if (baseText.length <= maxChars) {
            tspan = new SVGElement(document.createElementNS(svgNS, 'tspan'));
            tspan.addAttrs({
                'x': x,
                'y': y
            });

            ttext = document.createTextNode(line);
            tspan.node.appendChild(ttext);
            text.node.appendChild(tspan.node);
        }

        this.elementsCollection.push(text);
        this.surface.appendChild(text.node);

        return text;
    }


    /**
      * @desc draws line
      * @param double x1
      * @param double y1
      * @param double x2
      * @param double y2
      * @return SVGElement Created line
    */
    SVG.prototype.line = function(x1, y1, x2, y2) {
        var line = new SVGElement(document.createElementNS(svgNS, 'line'));

        line.addAttrs({
            'x1': x1,
            'y1': y1,
            'x2': x2,
            'y2': y2
        });
        //line.svg = this.surface;

        this.elementsCollection.push(line);
        this.surface.appendChild(line.node);

        return line;
    }

    /**
      * @desc draws a simple Bezier curve
      * @param double x1 - the beginning point's x value
      * @param double y1 - the beginning point's y value
      * @param double x2 - the ending point's x value
      * @param double y2 - the ending point's y value
      * @return SVGElement Created Bezier curve
    */
    SVG.prototype.simpleBezier = function(x1, y1, x2, y2) {
        var path = new SVGElement(document.createElementNS(svgNS, 'path')),
            cmd = [];

        cmd.push('M' + x1 + ',' + y1);
        cmd.push('C' + x1 + ',' + y2);
        cmd.push(x2 + ',' + (y1 + (y1 - y2) / 10));
        cmd.push(x2 + ',' + y2);
        path.addAttrs({
            'd': cmd.join(' '),
            'fill': 'none'
        });

        //path.svg = this.surface;

        this.elementsCollection.push(path);
        this.surface.appendChild(path.node);

        return path;
    }

    return SVG;
});
