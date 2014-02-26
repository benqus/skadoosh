Skadoosh
========

DOM generator utility - JavaScript

Skadoosh generates a hierarchy of DOM elements in a smart and compact way.

---

### Example:

    (function (ska) {
        var dom = ska.section(
            ska.header,
            ska.article(
                ska.p("Random content one..."),
                ska.p("Random content two...")
                ska.p("Random content three...")
            ),
            ska.footer
        );
    }(skadoosh));

## API

#### skadoosh.DOM_ELEMENT( arg [, content1 [, content2 [, ... [, contentN]]]] )

`arg` :: `Object`, `String`, `Function`, `Node`, `Array`

Method can be overloaded with optional arguments.

    var ska = skadoosh;
    
    // Object:
    ska.a({ href: "/some/path", class: "link" }, ... );
    
    // String
    ska.p("Hakuna matata");
    
    // Function
    ska.article(
        ska.header
    );
    
    // Node
    ska.article(
        document.createElement("header")
    );

    // Array
    ska.ul([
        ska.li,
        ska.li,
        ska.li
    ]);

    // arguments
    ska.aside(
        ska.nav,
        ska.article,
        ska.footer
    );

> **note:** only the first arguments is handled as a map of options. The remaining arguments can be `String`, `Array`, `Function` or `Node`.

---

### skadoosh.generateDOMFactory( name, [generator] )

Registers a custom generator. If no generator method is specified, name will be used to create the Element.

    var derp = ska.generateDOMFactory("herp"); // > {Function} DOM factory
    
    herp(); // <herp></herp>

> **note:** for XML support

---

### skadoosh.append( parent, content )

`parent` :: `Document`, `DocumentFragment`, `Element`

`content` :: `String`, `Function`, `Node`, `Array`

Appends the `content` to the `parent`.

---

### skadoosh.replace( oldElement, newElement )

`oldElement` :: `Element`

`newElement` :: `Node`

Replaces the `oldElement` with the `newElement`.

---

### skadoosh.fragment( [content] )

Creates a DocumentFragment with optional content. Contents can be `String`, `Array`, `Function` or `Node`.

### License

MIT
