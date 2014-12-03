require(['snap', 'FaultTree', 'defaults', 'ElementsEnhancement'], function(Snap, FaultTree, defaultData, $) {

    'use strict'

    var data = defaultData[2],
        treeListContainer = $.one('#treeContainer'),
        tree = new FaultTree(Snap, 'surface');

    tree.init(data);
    treeListContainer.innerHTML =
        tree.generateTreeList(
            { tag: 'ul', class: 'parent' },
            { tag: 'li', class: 'child' },
            { tag: 'span', class: 'displayInfo' }
        );
    closeHandlersInit();
    resizersInit();
    initExpandibility();
    higlightNodesBySearch();


    function closeHandlersInit() {
        var leftbar = $.one('#leftbar'),
            bottombar = $.one('#rightbottombar');

        $.one('#hideLeft').addEventListener('click', function(e) {
            leftbar.toggleClass('shrinkedHorizontal');
        });

        $.one('#hideBottom').addEventListener('click', function(e) {
            bottombar.toggleClass('shrinkedVertical');
        });
    }

    function resizersInit() {
        var resizers = $.all('.resizer'),
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

    function initExpandibility () {
        var icons = $.all('.icon.expandible');

        [].forEach.call(icons, function(button) {
            button.addEventListener('mousedown', function(e) {
                var ul = button.parentNode.parentNode.querySelector('ul');
                ul.toggleClass('hidden');
                this.toggleClass('collapsed');
            });
        });
    }

// TODO: implement scrolling to first entry;
//  implement clear search
    function higlightNodesBySearch() {
        var input = $.one('#searchField');

        var searchNode = function() {
            var query = this.value,
                oldHiglightedElements = $.all('span.displayInfo.highlighted'),
                searchElements = $.all('span[data-id^="' + query + '"]' );

            [].forEach.call(oldHiglightedElements, function(el) {
                el.removeClass('highlighted');
            });

            [].forEach.call(searchElements, function(el) {
                el.addClass('highlighted');
            });
        }

        input.addEventListener('keyup', searchNode);
    }
});
