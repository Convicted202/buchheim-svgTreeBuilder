define(['Helper'], function(Helpers) {

    'use strict'

    var TreeNode = function(configs) {
        this._id = 0;
        this._pid = 0;

        this.logicInputRadius = 5;
        this.surface = null;

        this.guid = Helpers.generateGuid();

        Helpers.extend(this, configs);

        this.x = 0;
        this.y = 0;

        this.addToX = null;

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

        attachSurface: function(surface) {
            this.surface = surface;
        },

        checkAddToY: function() {
            if (this.y - this.begY > this.x - this.begX) {
                this.addToX = 1;
            } else {
                this.addToX = -1;
            }
        },

        draw: function(x, y, w, h, r) {
            // if (!this.surface) {
            //     return false;
            // }
            // if (!this)
            // if (!this.begX && !this.begY) {

                //this.surface.circle(x, y, r).attr({id: this._id});
                this.surface.roundRect(x, y, w, h, r, r, this._id);
            //     return false;
            // }
            // if (!this.addToX) {
            //     this.checkAddToY();
            // }
            // if (this.addToX + 1) {
            //     if (this.y - this.begY < 0.001) {
            //         return false;
            //     }
            //     this.currentX = (this.currentY - this.begY) * (this.x - this.begX) / (this.y - this.begY) + this.begX;
            //     this.begX = this.currentX;
            //     return true;
            // } else {
            //     if (this.x - this.begX < 0.001) {
            //         return false;
            //     }
            //     this.currentY = (this.currentX - this.begX) * (this.y - this.begY) / (this.x - this.begX) + this.begY;
            //     this.begY = this.currentY;
            // }
        }
    }

    return TreeNode;
});
