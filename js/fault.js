(function() {

    'use strict'

    var Helpers = {
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

        generateGuid: function() {
            return 1;
        }
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
        addChild: function(node) {
            this.nodeChildren.push(node);
        },

        getLeftSibling: function() {
            if (this.number !== 0) {
                return this.nodeParent.nodeChildren[this.number - 1];
            }
            return null;
        },

        getRightSibling: function() {
            var pNode = this.nodeParent;

            if (this.number !== pNode.getChildrenCount() - 1) {
                return pNode.nodeChildren[this.number + 1];
            }
            return null;
        },

        getLefmostSibling: function() {
            if (this.number !== 0) {
                return this.nodeParent.nodeChildren[0];
            }
            return null;
        },

        getSiblings: function() {
            var arr = Array.prototype.slice.call(this.nodeParent.nodeChildren, 0);
                i = 0, n = this.nodeParent.nodeChildren.length;

            for (; i < n; i++) {
                if (arr[i].number === this.number) {
                    arr.pop(i);
                    break;
                }
            }

            return arr;
        },

        getChildrenCount: function() {
            return this.nodeChildren ? this.nodeChildren.length : 0;
        },

        getChild: function(k) {
            return this.nodeChildren && this.nodeChildren[k];
        },

        getFirstChild: function() {
            return this.getChild(0);
        },

        getLastChild: function() {
            return this.getChild(this.getChildrenCount() - 1);
        },

        getLeftmostChild: function() {
            return this.getFirstChild();
        },

        getRightmostChild: function() {
            return this.getLastChild();
        },

        getChildrenCenter: function() {
            var leftmost = this.getFirstChild(),
                rightmost = this.getLastChild();

            return (leftmost.prelim + rightmost.prelim) / 2;
        },

        nextLeft: function() {
            if (this.getChildrenCount()) {
                return this.getLeftmostChild();
            }
            return this.thread;
        },

        nextRight: function() {
            if (this.getChildrenCount()) {
                return this.getRightmostChild();
            }
            return this.thread;
        },

        drawNode: function() {

        }
    }


    var FaultTree = function(jsonStruct, snap, surfaceId, configs) {
        this.jsonTree = jsonStruct || {};
        this.nodesCollection = [];

        this.snap = snap;
        this.surface = snap('#' + surfaceId)
        this.config = {
             siblingSeparation : 40,
             treeTop: 80,
             treeLeft: 500,
             logicInputRadius: 15,
             r: 30,
        }

        this.apexNode = null;

        Helpers.extend(this.config, configs);
    };

    FaultTree.prototype = {
        init: function() {
            this.treeLayout();
            this.initHandlers();
        },

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

                    node = new TreeNode({ _id: root.id, _pid: root.pid, depth: depth });
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

        treeLayout: function() {
            var root = this;

            this.initNodes();

            Array.prototype.forEach.call(root.nodesCollection, function(node) {
                node.mod = 0;
                node.thread = 0;
                node.ancestor = node;
            });

            this.firstWalk(this.apexNode, 1);
            this.secondWalk(this.apexNode, -this.apexNode.prelim);

            this.drawAllNodes();
        },

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

        executeShifts: function(node) {
            var shift = 0, change = 0,
                child = null,
                i, n;

            for (i = 0, n = node.getChildrenCount(); i < n; i++) {
                child = node.getChild(i);
                child.prelim += shift;
                child.mod += shift;
                change += child.change;
                shift += child.shift + change;
            }
        },

        ancestor: function(vim, v, defaultAncestor) {
            var sibling,
                pNode = v.nodeParent,
                i, n;

            for (i = 0, n = pNode.getChildrenCount(); i < n; i++) {
                if (vim.ancestor == pNode.nodeChildren[i]) {
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

            drawConnections(this.apexNode, 0);

            Array.prototype.forEach.call(self.nodesCollection, function(node) {
                self.drawLogicInput(x + node.x * k, y + node.depth * 50, node._id);
                self.surface.text(x + node.x * k - 5, y + node.depth * 50 + 5, node._id);
            });

            function drawConnections(root, depth) {
                Array.prototype.forEach.call(root.nodeChildren, function(node) {
                    if (node) {
                        path = svg.path();
                        cmd.push('M' + (x + root.x * k) + ',' + (y + depth * 50));
                        cmd.push('C' + (x + root.x * k) + ',' + (y + (depth + 1) * 50));
                        cmd.push((x + node.x * k) + ',' + (y + depth * 50 + 25));
                        cmd.push((x + node.x * k) + ',' + (y + (depth + 1) * 50));
                        path.node.setAttribute('d', cmd.join(' '));
                        cmd = [];
                        //self.snap.paper.line(x + root.x * k, y + depth * 50, x + node.x * k, y + (depth + 1) * 50);
                        drawConnections(node, depth + 1);
                    }
                });
            }


        }
    }

    window.FaultTree = FaultTree;
})()