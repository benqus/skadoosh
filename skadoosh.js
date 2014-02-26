/**
 * Skadoosh - 0.2.0
 * 
 * Author: Bence Kormos <https://github.com/benqus>
 * License: MIT <https://github.com/benqus/skadoosh/blob/master/LICENSE>
 */
(function (root, factory) {
    // UMD
    
    /**
     * @namespace
     */
    var exports = (typeof exports === "object" ? exports : {});
    
    if (typeof define === "function" && define.amd) {
        define("skadoosh", [], function () {
            return factory(exports);
        });
    } else {
        factory(exports);
        
        if (typeof Window === "function") {
            root.skadoosh = exports;
        }
    }
}((function () {
    return this;
}()), function (skadoosh) {
    var slice = Array.prototype.slice;
    
    // list of HTML5 elements
    // source: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/HTML5_element_list
    var tags = skadoosh.tags = [
        "html",
        
        "head",
        "title",
        "base",
        "meta",
        "style",
        
        "script",
        "noscript", // this makes no sense but let's be precise...
        
        "body",
        "section",
        "nav",
        "article",
        "aside",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "header",
        "footer",
        "address",
        "main",
        
        // this is not part of HTML5 spec anymore
        // source: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hgroup
        "hgroup",
        
        "p",
        "hr",
        "pre",
        "blockquote",
        "ul",
        "ol",
        "li",
        "dl",
        "dt",
        "dd",
        "figure",
        "figcaption",
        "div",
        
        "a",
        "em",
        "strong",
        "small",
        "s",
        "cite",
        "q",
        "dfn",
        "abbr",
        "data",
        "time",
        "code",
        "var",
        "samp",
        "kbd",
        "sub",
        "sup",
        "i",
        "b",
        "u",
        "mark",
        "ruby",
        "rt",
        "rp",
        "bdi",
        "bdo",
        "span",
        "br",
        "wbr",
        
        "ins",
        "del",
        
        "img",
        "iframe",
        "embed",
        "object",
        "param",
        "video",
        "audio",
        "source",
        "track",
        "canvas",
        "map",
        "area",
        "svg",
        "math",
        
        "table",
        "caption",
        "colgroup",
        "col",
        "tbody",
        "thead",
        "tfoot",
        "tr",
        "td",
        "th",
        
        "form",
        "fieldset",
        "legend",
        "label",
        "input",
        "button",
        "select",
        "datalist",
        "optgroup",
        "option",
        "textarea",
        "keygen",
        "output",
        "progress",
        "meter",
        
        "details",
        "summary",
        "menuitem",
        "menu"
    ];
    
    
    
    /**
     * Resolves the provided argument to a Node fi it is a function or a string.
     * @param {Function|String|*} node
     * @returns {Node|*}
     */
    var ensureNode = function (node) {
        switch (typeof node) {
            case "function": return node();
            case "string": return document.createTextNode(node);
            default: return node;
        }
    };
    
    
    
    /**
     * Appends the content to the parent.
     * @param {Node} parent - element to append to
     * @param {Node|String|Array} content - congtent to append
     */
    var append = skadoosh.append = function (parent, content) {
        var i, l;
        
        if (content) {
            if (typeof content === "object" && content instanceof Array) {
                for (i = 0, l = content.length; i < l; i++) {
                    append(parent, content[i]);
                }
            } else {
                content = ensureNode(content);
            }
            
            // if (typeof content === "function") {
            //     append(parent, content());
            // } else if (typeof content === "object" && content instanceof Array) {
            //     for (i = 0, l = content.length; i < l; i++) {
            //         append(parent, content[i]);
            //     }
            // } else if (typeof content === "string") {
            //     content = document.createTextNode(content);
            // }
            
            // 1: ELEMENT_NODE
            // 3: TEXT_NODE
            if (typeof content === "object" && [1,3].indexOf(content.nodeType) > -1) {
                parent.appendChild(content);
            }
        }
    };
    
    
    
    /**
     * Short-hand, convenice method to create a
     * DocumentFragment intance with children
     * @arguments
     * @returns {DocumentFragment}
     */
    var fragment = skadoosh.fragment = function () {
        var fragment = document.createDocumentFragment();
        var content = slice.call(arguments, 0);
        append(fragment, content);
        return fragment;
    };
    
    
    
    /**
     * Creates (memoizes) a generator for the provided tag.
     * @param {String} tag - tag to create the generator for
     * @param {Object} [namespace] - namespace to register the factory on
     */
    var generateDOMFactory = skadoosh.generateDOMFactory =
        function (tag, namespace) {
            /**
             * DOM Node factory.
             * @param {Array|Function|Node|String} arg - attributes or content
             * @arguments
             */
            var factory = function (arg) {
                var element = document.createElement(tag);
                var content = slice.call(arguments, 1);
                
                if (typeof arg === "object" &&
                    !(arg instanceof Node) &&
                    !(arg instanceof Array))
                {
                    setAttributes(element, arg);
                } else {
                    append(element, arg);
                }
                
                append(element, content);
                
                return element;
            };
            
            // register DOM factory to the procided namespace
            if (namespace && !namespace.hasOwnProperty(tag)) {
                namespace[tag] = factory;
            }
            
            return factory;
        };
    
    
    
    /**
     * Sets the attributes for the provided Element.
     * Recursive
     * @private
     * @static
     * @param {Element} element
     * @param {Object} [attributes] - attributes to set on the element
     * @param {String} [prefix] - eg: "data-"
     */
    var setAttributes = skadoosh.setAttributes =
        function _setAttributes(element, attributes, prefix) {
            var data, className, i;
            
            if (attributes) {
                data = attributes.data;
                className = attributes.className;
                prefix = (prefix || "");
                
                if (className) {
                    element.setAttribute("class", className)
                }
                
                delete attributes.data;
                delete attributes.className;
                
                for (i in attributes) {
                    if (attributes.hasOwnProperty(i)) {
                        element.setAttribute(i, (prefix + attributes[i]));
                    }
                }
                
                _setAttributes(element, data, "data-");
            }
        };
    
    
    
    /**
     * Replaces an element with another.
     * @param {Node} oldElement - element to replace
     * @param {Node} newElement - element for replacement
     */
    var replace = skadoosh.replace = function (oldElement, newElement) {
        var parent = oldElement.parentNode;
        
        newElement = ensureNode(newElement);
        
        if (parent && newElement) {
            parent.replaceChild(newElement, oldElement);
        }
    };
    
    
    
    // expose
    var i = 0;
    var l = tags.length;
    
    while (i < l) {
        generateDOMFactory(tags[i++], skadoosh);
    }
}));