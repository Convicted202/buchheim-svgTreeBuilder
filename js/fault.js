(function() {

    'use strict'

    var Helpers = {
        /**
          * @desc extends target object with source object
          * @param object target - object to be extended
          * @param object source - extension object
          * @return object - extended target object
        */
        extend: function (target, source) {
            target = target || {};
            for (var prop in source) {
                if (typeof source[prop] === 'object') {
                    target[prop] = this.extend(target[prop], source[prop]);
                } else {
                    target[prop] = source[prop];
                }
            }
            return target;
        },

        /**
          * @desc generates random integer from the range
          * @param int min - minimum number of the range; equals 0 if not provided
          * @param int max - maximum number of the range
          * @return int - integer from the range; 0 if min and max not provided
        */
        getRandomInt: function(min, max) {
            if (!arguments.length) {
                return 0;
            }
            if (arguments.length === 1) {
                min = 0;
            }
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        /**
          * @desc generates random JSON structure
          * @param int depth - depth of JSON tree
          * @param int maxChild - maximum sibling amount on each level
          * @return object - random JSON object
        */
        generateJson: function(depth, maxChild) {
            var jsonObj = {},
                self = this;

            jsonObj = {
                id: 'root',
                children: []
            };

            function createChildren(root, depth) {
                var childrenCount = self.getRandomInt(0, maxChild),
                    child, i;

                depth--;

                for (i = childrenCount; i >= 0; i--) {
                    child = {
                        id: self.generateGuid(),
                        pid: root.id,
                        children: []
                    };
                    //console.log(child.id, root.id);
                    root.children.push(child);
                    if (depth > 0) {
                        createChildren(child, depth);
                    }
                }
            }

            createChildren(jsonObj, depth);
            return jsonObj;
        },

        /**
          * @desc generates GUID in format '[8]-[4]-[4]-[4]-[12]'
          * @return string - generated GUID
        */
        generateGuid: function() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                       .toString(16)
                       .substring(1);
            }

            return  s4() + s4() + '-' +
                    s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
        }
    }

    var ConnectionType = {
        STRAIGHT: 0,
        BEZIER: 1,
        POLYGONAL: 2
    }


    var TreeNode = function(configs) {
        this._id = 0;
        this._pid = 0;

        this.guid = Helpers.generateGuid();

        Helpers.extend(this, configs);

        this.x = 0;
        this.y = 0;
        this.prelim = 0;
        this.nodeParent = null;
        this.nodeChildren = [];
        this.depth = 0;
        this.mod = 0;
        this.thread = null;
        this.ancestor = this;
        this.change = 0;
        this.shift = 0;
        // current number in sibling group
        this.number = 0;
    }

    TreeNode.prototype = {
        /**
          * @desc adds child to nodeChildren collection
          * @param TreeNode node - node to push
          * @return void
        */
        addChild: function(node) {
            this.nodeChildren.push(node);
        },

        /**
          * @desc returns left sibling of current node
          * @return TreeNode
        */
        getLeftSibling: function() {
            if (this.number !== 0) {
                return this.nodeParent.nodeChildren[this.number - 1];
            }
            return null;
        },

        /**
          * @desc returns right sibling of current node
          * @return TreeNode
        */
        getRightSibling: function() {
            var pNode = this.nodeParent;

            if (this.number !== pNode.getChildrenCount() - 1) {
                return pNode.nodeChildren[this.number + 1];
            }
            return null;
        },

        /**
          * @desc returns the very left sibling on the same level with current node
          * @return TreeNode
        */
        getLefmostSibling: function() {
            if (this.number !== 0) {
                return this.nodeParent.nodeChildren[0];
            }
            return null;
        },

        /**
          * @desc returns the list of siblings of current node
          * @return array
        */
        getSiblings: function() {
            var arr = Array.prototype.slice.call(this.nodeParent.nodeChildren, 0),
                i = 0, n = this.nodeParent.nodeChildren.length;

            for (; i < n; i++) {
                if (arr[i].number === this.number) {
                    arr.pop(i);
                    break;
                }
            }

            return arr;
        },

        /**
          * @desc returns length of children
          * @return int
        */
        getChildrenCount: function() {
            return this.nodeChildren ? this.nodeChildren.length : 0;
        },

        /**
          * @desc returns node on k-th position
          * @param int k - position of node to return
          * @return TreeNode
        */
        getChild: function(k) {
            return this.nodeChildren && this.nodeChildren[k];
        },

        /**
          * @desc returns the very left child of current node
          * @return TreeNode
        */
        getFirstChild: function() {
            return this.getChild(0);
        },

        /**
          * @desc returns the very last child of current node
          * @return TreeNode
        */
        getLastChild: function() {
            return this.getChild(this.getChildrenCount() - 1);
        },

        /**
          * @desc returns the very left child of current node
          * @return TreeNode
        */
        getLeftmostChild: function() {
            return this.getFirstChild();
        },

        /**
          * @desc returns the very last child of current node
          * @return TreeNode
        */
        getRightmostChild: function() {
            return this.getLastChild();
        },

        /**
          * @desc returns the center of children position
          * @return int
        */
        getChildrenCenter: function() {
            var leftmost = this.getFirstChild(),
                rightmost = this.getLastChild();

            return (leftmost.prelim + rightmost.prelim) / 2;
        },

        /**
          * @desc returns the very first child or thread if node is a leaf
          * @return TreeNode
        */
        nextLeft: function() {
            if (this.getChildrenCount()) {
                return this.getLeftmostChild();
            }
            return this.thread;
        },

        /**
          * @desc returns the very last child or thread if node is a leaf
          * @return TreeNode
        */
        nextRight: function() {
            if (this.getChildrenCount()) {
                return this.getRightmostChild();
            }
            return this.thread;
        },

        drawNode: function() {

        }
    }

    var FaultTree = function(snap, surfaceId, configs) {
        this.jsonTree = {};
        this.nodesCollection = [];

        this.snap = snap;
        this.surface = snap('#' + surfaceId)
        this.config = {
             siblingSeparation : 40,
             treeTop: 80,
             treeLeft: 950,
             logicInputRadius: 5,
             r: 10,
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
            this.jsonTree = data;
            this.treeLayout();
            this.initHandlers();
        },

        /**
          * @desc retuns working tree in JSON to String
          * @return string
        */
        getJsonTree: function() {
            return JSON.stringify(this.jsonTree);
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
                receiver = null;
            this.snap.mousedown(function(e) {
                //console.log(e.target);
                if (e.target.nodeName === 'circle') {
                    var id = e.target.id, el = null, pIds = [];
                    for (var i = 0; i < self.nodesCollection.length; i++) {
                        if (id === self.nodesCollection[i]._id) {
                            el = self.nodesCollection[i];
                            break;
                        }
                    }
                    pIds.push(el._id);
                    while (el = el.nodeParent) {
                        pIds.push(el._id);
                    }
                    console.log(pIds);

                    receiver = self.jsonTree
                    for (var i = pIds.length - 2; i >= 0; i--) {
                        for (var j = 0; j < receiver.children.length; j++) {
                            if (receiver.children[j].id === pIds[i]) {
                                if (i === 0) {
                                    console.log(receiver.children[j]);
                                    receiver.children.pop(j);
                                } else {
                                    receiver = receiver.children[j];
                                }
                                break;
                            }
                        }
                    }
                    self.treeLayout();
                }
            });
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
            //this.logNodesBy(['x', 'prelim']);
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

        drawLogicInput: function(x, y, id) {
            this.surface.circle(x, y, this.config.logicInputRadius).attr({'id': id});
            //this.snap.rect(x - 20, y, 40, 20);
        },

        drawAllNodes: function() {
            var self = this,
                k = this.config.logicInputRadius * 2 + 20,
                x = this.config.treeLeft,
                y = this.config.treeTop,
                svg = self.surface.paper, path, cmd = [];
            self.surface.paper.clear();

            drawConnections(this.apexNode, 0, ConnectionType.STRAIGHT);

            Array.prototype.forEach.call(self.nodesCollection, function(node) {
                self.drawLogicInput(x + node.x * k, y + node.depth * 50, node._id);
                // self.surface.text(x + node.x * k - 5, y + node.depth * 50 + 5, node.x);
            });

            function drawConnections(root, depth, conType) {
                Array.prototype.forEach.call(root.nodeChildren, function(node) {
                    if (node) {
                        if (conType === ConnectionType.BEZIER) {
                            path = svg.path();
                            cmd.push('M' + (x + root.x * k) + ',' + (y + depth * 50));
                            cmd.push('C' + (x + root.x * k) + ',' + (y + (depth + 1) * 50));
                            cmd.push((x + node.x * k) + ',' + (y + depth * 50 + 25));
                            cmd.push((x + node.x * k) + ',' + (y + (depth + 1) * 50));
                            path.node.setAttribute('d', cmd.join(' '));
                            cmd = [];
                        } else if (conType === ConnectionType.STRAIGHT) {
                            svg.line(x + root.x * k, y + depth * 50, x + node.x * k, y + (depth + 1) * 50);
                        }

                        drawConnections(node, depth + 1, conType);
                    }
                });
            }


        }
    }

    window.FaultTree = FaultTree;
})()
