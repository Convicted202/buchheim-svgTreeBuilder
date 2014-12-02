window.addEventListener('load', function() {

    var req = new XMLHttpRequest(),
        dataUrl = 'js/default4-data.json',
        data;

    req.open("GET", dataUrl, true);

    req.onreadystatechange = function ()
    {
        try {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    data = req.responseText;
                    applicationStart(JSON.parse(data));
                } else {
                    console.error('Unable to retrieve data. ' + req.statusText);
                }
            }
        }
        catch( e ) {
            console.log(e);
        }
    };

    req.send(null);
});

function applicationStart(data) {
    var treeListContainer = $('#treeList');
    window.tree = new FaultTree(Snap, 'surface');
    tree.init(data);
    treeListContainer.innerHTML =
        tree.generateTreeList(
            { tag: 'ul', class: 'parent' },
            { tag: 'li', class: 'child' },
            { tag: 'span', class: 'displayInfo' }
        );
    window.json = tree.getJsonTree();
    closeHandlersInit();
    resizersInit();
}

function $() {
    var qs = document.querySelector;
    return qs.apply(document, [].slice.apply(arguments));
}

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

HTMLElement.prototype.toggleClass = function(className) {
    if (this.hasClass(className)) {
        this.className = this.className.replace(className, '');
    } else {
        if (this.className) {
            this.className += ' ';
        }
        this.className += className;
    }
}

HTMLElement.prototype.getNumericStyle = function(styleName) {
    return +window.getComputedStyle(this, null).getPropertyValue(styleName).replace(/[^\d]+/, '');
}

function closeHandlersInit() {
    var leftbar = $('#leftbar'),
        bottombar = $('#rightbottombar');

    $('#hideLeft').addEventListener('click', function(e) {
        leftbar.toggleClass('shrinkedHorizontal');
    });

    $('#hideBottom').addEventListener('click', function(e) {
        bottombar.toggleClass('shrinkedVertical');
    });
}

function resizersInit() {
    var resizers = $all('.resizer'),
        currentElement = null;

    var onMouseMove = function (e) {
        var value, temp,
            isVert = currentElement.hasClass('vertical');

        if (!currentElement.resizersVal) {
            return;
        }

        if (isVert) {
            value = e.clientX;
        } else {
            value = e.clientY;
        }

        temp = value;
        value -= currentElement.resizersVal;
        currentElement.resizersVal = temp;
        if (isVert) {
            currentElement.parentNode.style.width = currentElement.parentNode.getNumericStyle('width') + value + 'px';
        } else {
            currentElement.parentNode.style.height = currentElement.parentNode.getNumericStyle('height') - value + 'px';
        }

    };

    var onMouseUp = function(e) {
        currentElement.parentNode.toggleClass('fasttransition');
        currentElement.resizersVal = null;
        currentElement = null;

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    [].forEach.call(resizers, function(resizer) {
        resizer.addEventListener('mousedown', function(e) {
            e.preventDefault();
            currentElement = this;

            this.parentNode.toggleClass('fasttransition');

            if (this.hasClass('vertical')) {
                currentElement.resizersVal = e.clientX;
            } else {
                currentElement.resizersVal = e.clientY;
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });
}
