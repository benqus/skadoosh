(function (document, Node) {
    /**
     * @namespace skadoosh
     * @type {Object}
     */
    var skadoosh = this.skadoosh = {};
    
    // list of HTML5 elements
    // source: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/HTML5_element_list
    var tags = [
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
     * Sets the attributes for the provided Element.
     * Recursive
     * @private
     * @static
     * @param {Element} element
     * @param {Object} [attributes] - attributes to set on the element
     * @param {String} [prefix] - eg: "data-"
     */
    var setAttributes = function _setAttributes(element, attributes, prefix) {
        var data, className, i;
        
        if (attributes) {
            data = attributes.data;
            className = (attributes.className || attributes["class"]);
            prefix = (prefix || "");
            
            if (className) {
                element.setAttribute("class", className)
            }
            
            delete attributes.data;
            delete attributes.className;
            delete attributes["class"];
            
            for (i in attributes) {
                if (attributes.hasOwnProperty(i)) {
                    element.setAttribute(i, (prefix + attributes[i]));
                }
            }
            
            _setAttributes(element, data, "data-");
        }
    };
    
    /**
     * Appends the provided children to the element.
     * @private
     * @static
     * @param {Element} element - element to append the children to
     * @param {Array} [children] - children to append
     */
    var appendChildren = function (element, children) {
        var i = 0;
        var child, l;
        
        if (children && (l = children.length) > 0) {
            while (i < l) {
                child = children[i++];
                
                if (typeof child === "string") {
                    child = document.createTextNode(child);
                } else if (typeof child === "function") {
                    child = child();
                }
                
                element.appendChild(child);
            }
        }
    };
    
    /**
     * Proxy to restrict to content to an array.
     * @private
     * @static
     * @param {Node} element - the node to append the content into
     * @param {Array|Node}
     */
    var appendContent = function (element, content) {
        var arg = content;
        
        if (!(content instanceof Array)) {
            if (typeof content === "object") {
                arg = [content];
            } else {
                arg = [document.createTextNode(content || "")];
            }
        }
        
        appendChildren(element, arg);
    };
    
    /**
     * Creates (memoizes) a generator for the provided tag.
     * @private
     * @static
     * @param {String} tag - tag to create the generator for
     */
    var domGeneratorFactory = function (tag) {
        return function (arg, content) {
            var element = document.createElement(tag);
            var isArray = arg instanceof Array;
            
            if (arg) {
                // 1: ELELMENT_NODE
                // 3: TEXT_NODE
                // 9: DOCUMENT_NODE
                // 11: DOCUMENT_FRAGMENT_NODE
                if (!isArray && [1, 3, 9, 11].indexOf(arg.nodeType) > -1) {
                    appendContent(element, arg);
                } else if (!isArray && typeof arg === "object") {
                    setAttributes(element, arg);
                    appendContent(element, content)
                } else if (typeof arg === "function") {
                    appendContent(element, arg());
                } else {
                    appendContent(element, arg);
                }
            }
            
            return element;
        }
    };
    
    var tag;
    while (tags.length > 0) {
        tag = tags.shift();
        skadoosh[tag] = domGeneratorFactory(tag);
    }
    
    /**
     * Slight idea to allow custom (context bound, if required) 
     * or to support XML stuff which this isn't a serious idea...
     * @param {String} tag - new tag to register in the supported tags array
     * @param {Function} [generator]
     */
    skadoosh.registerGenerator = function (tag, generator) {
        if (tags.indexOf(tag) < 0) {
            tags.push(tag);
            
            if (typeof generator === "function") {
                skadoosh[tag] = function (arg, content) {
                    return generator(arg, content);
                };
            } else {
                skadoosh[tag] = domGeneratorFactory(tag);
            }
        }
    };
    
    /**
     * In case your conventions restrict the usage of certain elements.
     * This isn't a serious idea either...
     * @param {String} tag - tag to remove
     */
    skadoosh.removeGenerator = function (tag) {
        var index = tags.indexOf(tag);
        
        if (index > -1) {
            tags.splice(index, 1);
            delete skadoosh[tag];
        }
    };
    
    /**
     * Short-hand, convenice method to create a
     * DocumentFragment intance with children
     * @param {Node} [content] - content
     * @returns {DocumentFragment}
     */
    skadoosh.createFragment = function (content) {
        var fragment = document.createDocumentFragment();
        
        if (content) {
            appendContent(fragment, content);
        }
        
        return fragment;
    }
    
    /**
     * @type {Array}
     */
    skadoosh.tags = tags; // to support testing
    
}.call(this, document, Node));