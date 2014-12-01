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
        }
    };

    req.send(null);
});

function applicationStart(data) {
    window.tree = new FaultTree(Snap, 'surface');
    tree.init(data);
    window.json = tree.getJsonTree();
    closeHandlersInit();
}

function $() {
    var qs = document.querySelector.bind(document);
    return qs.apply(this, [].slice.apply(arguments));
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
