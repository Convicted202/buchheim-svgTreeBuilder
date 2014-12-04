require(['snap', 'FaultTree', 'defaults', 'ElementsEnhancement', 'Animator'], function(Snap, FaultTree, defaultData, $, Animator) {

    'use strict'

    var data = defaultData[3],
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

// TODO: make some improvements with search;
// make scrollTop animations on query found
    function higlightNodesBySearch() {
        var input = $.one('#searchField'),
            clearBtn = $.one('#clearQuery'),
            wrapper = input.parentNode,
            treeArea = $.one('#treeContainer');

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

            renderScrollTopMovement(
                treeArea,
                searchElements.length ? searchElements[0].elementOffsetTop($.one('#leftbar')) : 0,
                10);
            //treeArea.scrollTop = searchElements.length ? searchElements[0].elementOffsetTop($.one('#leftbar')) : 0;

            if (query) {
                wrapper.addClass('filled');
            } else {
                wrapper.removeClass('filled');
            }
        }

        var activateClearBtn = function() {
            var higlightedElements = $.all('span.displayInfo.highlighted');

            [].forEach.call(higlightedElements, function(el) {
                el.removeClass('highlighted');
            });

            if (wrapper.hasClass('filled')) {
                input.value = '';
                treeArea.scrollTop = 0;
                wrapper.removeClass('filled');
            }
        }

        input.addEventListener('keyup', searchNode.bind(input));
        clearBtn.addEventListener('click', activateClearBtn.bind(clearBtn));
    }

    function renderScrollTopMovement(element, newScrollTop, time) {
        var startScrollTop = element.scrollTop,
            step = (newScrollTop - startScrollTop) / (time || 10);

        function renderStep(delta) {
            var diff = newScrollTop - startScrollTop;

            if (diff <= step) {
                element.scrollTop += diff;
                return false;
            }
            element.scrollTop = startScrollTop += step;
            return true;
        }

        Animator.animate(renderStep);

    }
});
