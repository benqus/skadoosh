skadoosh
========

DOM generator utility - JavaScript

Not surprisingly, skadoosh generates a hierarchy of DOM elements

### Usage:

    (function (ska) {
        
        var dom = ska.section(
            ska.header,
            ska.article([
                ska.p("Random content one..."),
                ska.p("Random content two...")
                ska.p("Random content three...")
            ]),
            ska.footer
        );
        
    }(skadoosh));

## API:

### skadoosh.DOM_ELEMENT( arg, [content] )

`arg` - {Object|String|Function|Node|Array}

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

Array of any type mentioned above:

    ska.ul([
        ska.li,
        ska.li,
        ska.li
    ]);

`content` - optional

Any String, Node, or DOM generator Function

### skadoosh.registerGenerator( name, [generator] )

Registers a custom generator. If no generator method is specified, name will be used to create the Element.

    var derp, herp;
    
    // derp
    ska.registerGenerator("derp");
    
    derp = ska.derp(); // <derp></derp>

    // herp
    ska.registerGenerator("herp", function () {
        // custom logic
        return ska.p("Herps");
    });
    
    herp = ska.herp(); // <p>Herps</p>

### skadoosh.createFragment( [content] )

Creates a DocumentFragment with optional content.

### License

MIT
