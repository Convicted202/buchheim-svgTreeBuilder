define(['Helper', 'Animator', 'TreeNode', 'SVGHelpers', 'ElementsEnhancement'], function(Helpers, Animator, TreeNode, SVG, $) {

    'use strict'

    var ConnectionType = {
        STRAIGHT: 0,
        BEZIER: 1,
        POLYGONAL: 2
    }

    var FaultTree = function(surface, textContainer, configs) {
        this.jsonTree = {};

        this.jsonList = {};
        this.nodesCollection = [];
        this.svgSurface = new SVG(surface, textContainer);

        this.svgSurface.defineLinearGradient({
            id: 'LinearGradient1',
            rotationAngle: '45',
            stopNodes: [{
                offset: '0%',
                stopColor: '#85B5C7'
            },
            {
                offset: '100%',
                stopColor: '#f0f0f0'
            }]
        }).defineEndMarker();

        this.config = {
             siblingSeparation : 40,
             treeTop: 80,
             treeLeft: document.body.clientWidth - surface.parentNode.clientWidth / 2,
             logicInputRadius: 50,
             r: 10,
             inputHeight: 70,
             inputWidth: 90,

             currentScale: 1,
             offsetX: 0,
             offsetY: 0
        }

        this.apexNode = null;

        Helpers.extend(this.config, configs);
    };

    FaultTree.prototype = {
        /**
          * @desc applies json data, runs algorithm and initializes svg handlers
          * @param obj data - JSON data to be processed; authomatically generated if not provided
          * @return void
        */
        init: function(data) {
            if (!data) {
                data = Helpers.generateJson(5, 2);
            }
            this.svgSurface.clearSurface();
            this.jsonTree = data;
            this.jsonList = Helpers.extend({}, data);
            this.treeLayout();
            this.initHandlers();
            this.displayTreeData();
        },

        /**
          * @desc retuns working tree in JSON to String
          * @return string
        */
        getJsonTree: function() {
            return JSON.stringify(this.jsonTree);
        },

        /**
          * @desc displays common tree data
          * @return void
        */
        displayTreeData: function() {
            var container = $.one('#treeDisplayContainer'),
                self = this,
                divs = [
                    { name: 'Tree Name', value: 'Basic Tree' },
                    { name: 'Nodes count', value: self.nodesCollection.length },
                    { name: 'Root node ID', value: self.apexNode._id },
                    { name: 'Max depth', value: self.getMaxDepth() }
                ],
                template = [
                    '<div>',
                        '<strong>${name} : </strong>',
                        '${value}',
                    '</div>'
                ].join(''),
                html = '';

            container.innerHTML = '';

            [].forEach.call(divs, function(divObj) {
                html += Helpers.template(template, divObj);
            });

            container.innerHTML = html;
        },

        /**
          * @desc returns maximal depth of a tree
          * @return int
        */
        getMaxDepth: function() {
            var depth = 0;

            [].forEach.call(this.nodesCollection, function(node) {
                if (node.depth > depth) {
                    depth = node.depth;
                }
            });
            return depth + 1;
        },

        /**
          * @desc creates TreeNode collection based on provided JSON
          * @return void
        */
        initNodes: function() {
            var json = this.jsonTree,
                self = this,
                node = null, pnode = null;

            self.nodesCollection = [];
            self.apexNode = null;
            json.pid = 0;

            function findParentNode(node) {
                var pnode = null,
                    i, n = self.nodesCollection.length;

                if (node._pid === -1) {
                    return null;
                }
                for (i = 0; i < n; i++) {
                    if (self.nodesCollection[i]._id === node._pid) {
                        pnode = self.nodesCollection[i];
                        break;
                    }
                }
                return pnode;
            }

            function loop(root) {
                var isApex = false,
                    depth = 0;

                if (root) {
                    // Creating a tree node here
                    if (!root.pid) {
                        pnode = null;
                        root.pid = -1;
                        isApex = true;
                    }

                    node = new TreeNode({
                        _id: root.id,
                        _pid: root.pid,
                        depth: depth
                    });

                    if (isApex) {
                        self.apexNode = node;
                    }
                    pnode = findParentNode(node);
                    node.nodeParent = pnode;
                    if (pnode) {
                        pnode.nodeChildren.push(node);
                        node.number = pnode.nodeChildren.length - 1;
                        node.depth = pnode.depth + 1;
                    }
                    node.attachSurface(self.svgSurface);
                    self.nodesCollection.push(node);
                } else {
                    return;
                }
                if (!(root.children instanceof Array)) {
                    console.warn('Seems that you forgot to wrap ' + root.id + '\'s children with a []')
                    return;
                }

                Array.prototype.forEach.call(root.children, function(el) {
                    if (el) {
                        loop(el);
                    }
                });
            }
            loop(json);
        },

        /**
          * @desc initializes all major svg handlers
          * @return void
        */
        initHandlers: function() {
            var self = this,
                receiver = null,
                offsetStart = {},
                downFlag = false;

            var removeNode = function(e) {
                if (e.target.getAttribute('data-id')) {
                    var id = e.target.getAttribute('data-id'), el = null, pIds = [],
                        container = $.one('#nodeDisplayContainer');

                    for (var i = 0; i < self.nodesCollection.length; i++) {
                        if (id === self.nodesCollection[i]._id) {
                            el = self.nodesCollection[i];
                            break;
                        }
                    }

                    el.displayData(container);

                    self.svgSurface.moveSelectionRect(el._id)

                    // pIds.push(el._id);
                    // while (el = el.nodeParent) {
                    //     pIds.push(el._id);
                    // }
                    // //console.log(pIds);

                    // receiver = self.jsonTree;
                    // for (var i = pIds.length - 2; i >= 0; i--) {
                    //     for (var j = 0; j < receiver.children.length; j++) {
                    //         if (receiver.children[j].id === pIds[i]) {
                    //             if (i === 0) {
                    //                 //console.log(receiver.children[j]);
                    //                 receiver.children.pop(j);
                    //             } else {
                    //                 receiver = receiver.children[j];
                    //             }
                    //             break;
                    //         }
                    //     }
                    // }
                    // self.treeLayout();

                } else {
                    self.svgSurface.hideSelectionRect();
                }
            }

            var onWheelScroll = function(e) {
                var delta = (e.deltaY) < 0 ? -0.5 : 0.5;
                if (self.config.currentScale <= 1 && delta < 0) {
                    self.config.currentScale /= 2;
                } else {
                    if (self.config.currentScale < 1 && delta >= 0) {
                        self.config.currentScale *= 2;
                    } else {
                        self.config.currentScale += delta;
                    }
                }
                self.svgSurface.scaleMarker(self.config.currentScale);
                self.drawAllNodes();
            }

            var canvasDrag = {
                mousedown: function(e) {
                    downFlag = true;
                    if (e.touches) {
                        offsetStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                    } else {
                        offsetStart = { x: e.clientX, y: e.clientY };
                    }
                },
                mousemove: function(e) {
                    if (downFlag) {
                        if (e.touches) {
                            self.config.offsetX += e.touches[0].clientX - offsetStart.x;
                            self.config.offsetY += e.touches[0].clientY - offsetStart.y;

                            offsetStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                        } else {
                            self.config.offsetX += e.clientX - offsetStart.x;
                            self.config.offsetY += e.clientY - offsetStart.y;

                            offsetStart = { x: e.clientX, y: e.clientY };
                        }
                        self.drawAllNodes();
                    }
                },
                mouseup: function(e) {
                    downFlag = false;
                }
            }

            this.svgSurface.surface.parentNode.addEventListener('mousedown', removeNode);
            this.svgSurface.addEventListener('wheel', onWheelScroll);

            this.svgSurface.addEventListener('mousedown', canvasDrag.mousedown);
            this.svgSurface.addEventListener('mousemove', canvasDrag.mousemove);
            this.svgSurface.addEventListener('mouseup', canvasDrag.mouseup);

            this.svgSurface.addEventListener('touchstart', canvasDrag.mousedown);
            this.svgSurface.addEventListener('touchmove', canvasDrag.mousemove);
            this.svgSurface.addEventListener('touchend', canvasDrag.mouseup);

            this.removeListeners = function() {
                this.svgSurface.surface.parentNode.removeEventListener('mousedown', removeNode);
                this.svgSurface.removeEventListener('wheel', onWheelScroll);

                this.svgSurface.removeEventListener('mousedown', canvasDrag.mousedown);
                this.svgSurface.removeEventListener('mousemove', canvasDrag.mousemove);
                this.svgSurface.removeEventListener('mouseup', canvasDrag.mouseup);

                this.svgSurface.removeEventListener('touchstart', canvasDrag.mousedown);
                this.svgSurface.removeEventListener('touchmove', canvasDrag.mousemove);
                this.svgSurface.removeEventListener('touchend', canvasDrag.mouseup);
            }
        },

        /**
          * @desc generates TreeList view from given previously initialized jsonList
          * @param object parent - parent wrapper containing tag and class
          * @param object child - child wrapper containing tag and class
          * @param object text - text wrapper containing tag and class
          * @param boolean forceRegenerate - generates tree list no matter if we have one already
          * @return void
        */
        generateTreeList: function(parent, child, text, forceGegenerate) {
            var tag = '';

            if (!forceGegenerate && this.treeListTagged) {
                return this.treeListTagged;
            }

            parent.tag = parent.tag || 'ul';
            parent.class = parent.class || '';
            child.tag = child.tag || 'li';
            child.class = child.class || '';
            text.tag = text.tag || 'span';
            text.class = text.class || '';

            var template = {
                start: '<${tag} class="${class} ${root}" data-id="${dataId}">',
                end: '</${tag}>'
            }

            function startTag(tag, first, dataId) {
                Helpers.extend(tag, {
                    root: (first ? 'root' : ''),
                    dataId: (dataId ? dataId : '')
                });
                return Helpers.template(template.start, tag);
            }
            function endTag(tag) {
                return Helpers.template(template.end, tag);
            }

            function loop(root) {
                var innerTag = '',
                    children = root.children,
                    classList = '';
                innerTag += startTag(child);
                if (children && children.length) {
                    classList = ' expandible collapsed';
                }
                innerTag += startTag(text, false, root.id) + startTag({tag: 'span', class: 'icon' + classList }) + endTag({ tag: 'span' }) + root.id + endTag(text);
                if (children && children.length) {
                    innerTag += startTag(parent);
                    [].forEach.call(children, function(node) {
                        innerTag += loop(node);
                    });
                    innerTag += endTag(parent);
                }
                innerTag += endTag(child);
                return innerTag;
            }

            tag += startTag(parent, true);
            tag += loop(this.jsonTree);
            tag += endTag(parent);

            this.treeListTagged = tag;
            return tag;
        },

        /**
          * @desc logs all nodes properties specified by provided config array
          * @param string[] configsArray - array of properties
          * @return void
        */
        logNodesBy: function(configsArray) {
            console.log('=============== Logging Start ===============');
            Array.prototype.forEach.call(this.nodesCollection, function(node) {
                var props = Array.prototype.map.call(configsArray, function(config) {
                    return node[config];
                });
                console.log(node._id, props.join(' '));
            });
            console.log('================ Logging End ================');
        },

        /**
          * @desc initializes all nodes, runs algorithm, draws all nodes
          * @return void
        */
        treeLayout: function() {
            var root = this;

            this.initNodes();

            this.firstWalk(this.apexNode, 1);
            this.secondWalk(this.apexNode, -this.apexNode.prelim);
            this.drawAllNodes();
        },

        /**
          * @desc post-order traversal of algorithm
          * @param TreeNode node - node as a root of a current subtree
          * @param int distance - distance between two nodes; use 1 for best practice
          * @return void
        */
        firstWalk: function (node, distance) {
            var defaultAncestor = null,
                child = null, leftSibling = null,
                midPoint = 0,
                i, n;

            if (!node.getChildrenCount()) {
                if (node.getLeftSibling()) {
                    node.prelim = node.getLeftSibling().prelim + distance;
                } else {
                    node.prelim = 0;
                }
            } else {
                defaultAncestor = node.getLeftmostChild();

                for (i = 0, n = node.getChildrenCount(); i < n; i++) {
                    child = node.getChild(i);
                    this.firstWalk(child, distance);
                    defaultAncestor = this.apportion(child, defaultAncestor, distance);
                }

                this.executeShifts(node);

                midPoint = node.getChildrenCenter();

                leftSibling = node.getLeftSibling();
                if (leftSibling != null) {
                    node.prelim = leftSibling.prelim + distance;
                    node.mod = node.prelim - midPoint;
                } else {
                    node.prelim = midPoint;
                }
            }
        },

        /**
          * @desc contour traversal, summing modifiers for each node
          * @param TreeNode node - currently processed node
          * @param double m - current node's precision
          * @return void
        */
        secondWalk: function(node, m) {
            var child = null,
                i, n;

            node.x = node.prelim + m;
            node.y = node.depth;

            for (i = 0, n = node.getChildrenCount(); i < n; i++) {
                child = node.getChild(i);
                this.secondWalk(child, m + node.mod);
            }
        },

        /**
          * @desc moves current subtree with node as a root if some nodes are conflicting in space
          * @param TreeNode node - node as a root of current subtree
          * @param TreeNode defaultAncestor - default node's ancestor
          * @param int distance - distance of between-the-nodes spacing; 1 as best practice
          * @return TreeNode - new default ancestor based on intersection
        */
        apportion: function(node, defaultAncestor, distance) {
            var leftSibling = node.getLeftSibling(),
                v, w, shift,
                vop, vip, vim, vom,
                sop, sip, sim, som;

            // node - v
            // i - inner, o - outer
            // p - '+', m - '-'
            v = node;
            w = leftSibling;

            if (w) {
                vop = v;
                vip = v;
                vim = w;
                vom = vip.getLefmostSibling();
                sip = vip.mod;
                sop = vop.mod;
                sim = vim.mod;
                som = vom.mod;
                while (vim.nextRight() && vip.nextLeft()) {
                    vim = vim.nextRight();
                    vip = vip.nextLeft();
                    vom = vom.nextLeft();
                    vop = vop.nextRight();
                    vop.ancestor = v;
                    shift = (vim.prelim + sim) - (vip.prelim + sip) + distance;
                    if (shift > 0) {
                        this.moveSubtree(this.ancestor(vim, v, defaultAncestor), v, shift);
                        sip += shift;
                        sop += shift;
                    }
                    sim += vim.mod;
                    sip += vip.mod;
                    som += vom.mod;
                    sop += vop.mod;
                }
                if (vim.nextRight() && !vop.nextRight()) {
                    vop.thread = vim.nextRight();
                    vop.mod += sim - sop;
                } else {
                    if (vip.nextLeft() && !vom.nextLeft()) {
                        vom.thread = vip.nextLeft();
                        vom.mod += sip - som;
                    }
                    defaultAncestor = v;
                }
            }

            return defaultAncestor;
        },

        /**
          * @desc moving subtree if needed; figured out in apportion
          * @param TreeNode wm - left uncommon ancestor
          * @param TreeNode wp - right uncommon ancestor
          * @param double shift - space to shift wp to the right; calculated in apportion
          * @return void
        */
        moveSubtree: function(wm, wp, shift) {
            var subtrees = 0,
                ratio = 0;

            subtrees = wp.number - wm.number;
            ratio = shift / subtrees;
            wp.change -= ratio;
            wp.shift += shift;
            wm.change += ratio;
            wp.prelim += shift;
            wp.mod += shift;
        },

        /**
          * @desc moves children nodes if modeSubtree was called
          * @param TreeNode node - root node of current subtree
          * @return void
        */
        executeShifts: function(node) {
            var shift = 0, change = 0,
                child = null, i;

            for (i = node.getChildrenCount() - 1; i >= 0; i--) {
                child = node.getChild(i);
                child.prelim += shift;
                child.mod += shift;
                change += child.change;
                shift += child.shift + change;
            }
        },

        /**
          * @desc finds the second uncommon ancestor assuming that first one is v
          * @param TreeNode vim - left sibling, ancestor of which is searching
          * @param TreeNode v - right uncommon ancestor
          * @param TreeNode defaultAncestor - very left sibling of v
          * @return TreeNode - new uncommon ancestor
        */
        ancestor: function(vim, v, defaultAncestor) {
            var sibling,
                pNode = v.nodeParent,
                ancestors = v.getSiblings(),
                i, n;

            for (i = 0, n = ancestors.length; i < n; i++) {
                if (vim.ancestor == ancestors[i]) {
                    return vim.ancestor;
                }
            }
            return defaultAncestor;
        },


        /**
          * @desc return center coordinates of the node
          * @param TreeNode node - given node
          * @return Object - x, y pair of provided center
        */
        getNodeCenter: function(node) {
            var treeCenterX = this.config.treeLeft + this.config.offsetX,
                treeCenterY = this.config.treeTop + this.config.offsetY,
                nodeWidthScaled = (this.config.inputWidth * 2) * this.config.currentScale,
                nodeHeightScaled = (this.config.inputHeight * 2) * this.config.currentScale;

            return {
                        x: treeCenterX + node.x * nodeWidthScaled,
                        y: treeCenterY + node.depth * nodeHeightScaled
                    }
        },

        /**
          * @desc draws all nodes on attached surface
          * @return void
        */
        drawAllNodes: function() {
            var self = this,
                path, cmd = [],
                markerHeight = this.svgSurface.getMarkerHeight();

            self.svgSurface.clearSurface();

            drawConnections(this.apexNode, ConnectionType.POLYGONAL);

            Array.prototype.forEach.call(self.nodesCollection, function(node) {
                var center = self.getNodeCenter(node);

                node.draw(  center.x - self.config.inputWidth * self.config.currentScale / 2,
                            center.y - self.config.inputHeight * self.config.currentScale / 2,
                            self.config.inputWidth * self.config.currentScale,
                            self.config.inputHeight * self.config.currentScale,
                            5,
                            self.config.currentScale,
                            'LinearGradient1');
            });

            //self.svgSurface.reflowSelectionRect();

            function drawConnections(root, conType) {
                var rootCenter = self.getNodeCenter(root),
                    rootBottomCenterY, group;

                if (conType === ConnectionType.POLYGONAL && root.getChildrenCount()) {
                    rootBottomCenterY = rootCenter.y + self.config.inputHeight * self.config.currentScale / 2;

                    group = self.svgSurface.group().addPath([
                        'M' + rootCenter.x + ',' + rootBottomCenterY,
                        'L' + rootCenter.x + ',' + (rootBottomCenterY + self.config.inputHeight * self.config.currentScale / 2)
                    ].join(' ')).addPath([
                        'M' + self.getNodeCenter(root.getLeftmostChild()).x + ',' + (rootBottomCenterY + self.config.inputHeight * self.config.currentScale / 2),
                        'L' + self.getNodeCenter(root.getRightmostChild()).x + ',' + (rootBottomCenterY + self.config.inputHeight * self.config.currentScale / 2)
                    ].join(' '));
                }

                Array.prototype.forEach.call(root.nodeChildren, function(node) {
                    if (node) {
                        var nodeCenter = self.getNodeCenter(node);
                        if (conType === ConnectionType.BEZIER) {
                            self.svgSurface.simpleBezier(rootCenter.x, rootCenter.y, nodeCenter.x, nodeCenter.y);
                        } else if (conType === ConnectionType.STRAIGHT) {
                            self.svgSurface.line(rootCenter.x, rootCenter.y, nodeCenter.x, nodeCenter.y);
                        } else if (conType === ConnectionType.POLYGONAL) {
                            group.addPath([
                                'M' + nodeCenter.x + ',' + (rootBottomCenterY + self.config.inputHeight * self.config.currentScale / 2),
                                'L' + nodeCenter.x + ',' + (rootBottomCenterY + self.config.inputHeight * self.config.currentScale - markerHeight * self.config.currentScale)
                            ].join(' '), true);
                        }

                        drawConnections(node, conType);
                    }
                });
            }


        }
    }

    return FaultTree;
});
