window.onload = function() {

    window.tree = new FaultTree(jsondata, Snap, 'surface');
    //tree.drawLogicInput();
    //tree.loopChildren();
    //tree.getMaxInputNestedLevel();
    tree.init();
}
