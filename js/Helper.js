define([], function() {

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
        },

        /**
          * @desc gives easy way to provide templates in project
          * @param string templateStr - string definition of a template
          * @param object objExpose - object with provided parameters to replace templateStr entities with
          * @return string - new string with changed entities
        */
        template: function(templateStr, objExpose) {
            var index, exceededIndexes,
                // regexp to split string into attributes
                attributeReg = /\s|\/?\>|\<\/?/,
                // regexp to find entities like ${entity}
                entityReg = /\$\{.*\}/;

            for (index in objExpose) {
                templateStr = templateStr.replace('${' + index + '}', objExpose[index]);
            }

            exceededIndexes = templateStr.split(attributeReg);

            Array.prototype.forEach.call(exceededIndexes, function(elem, index) {
                if (elem.match(entityReg)) {
                    templateStr = templateStr.replace(elem, '');
                }
            });

            return templateStr;
        }

    }

    return Helpers;

});
