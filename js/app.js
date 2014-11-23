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


    //tree.drawLogicInput();
    //tree.loopChildren();
    //tree.getMaxInputNestedLevel();

});

function applicationStart(data) {
    window.tree = new FaultTree(Snap, 'surface');
    tree.init(data);
    window.json = tree.getJsonTree();
}
