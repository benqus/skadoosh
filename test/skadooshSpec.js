/* global: skadoosh, describe, beforeEach, afterEach, it, chai */
(function (ska, chai) {
    var assert = chai.assert;

    describe("DOM", function () {
        
        describe("generators", function () {
                
            it("exist and return a Node object", function () {
                var tags = ska.tags;
                var l = tags.length;
                var i = 0;
                var generator, tag;
                
                while (i < l) {
                    tag = tags[i++];
                    generator = ska[tag];
                    assert.equal(typeof generator, "function");
                    assert.ok(generator && (generator() instanceof Node), tag);
                }
            });
            
            it("can take a {String}", function () {
                // since each generator is created by the same
                // factory it is enough to test only one of them
                var div = ska.div("a");
                
                assert.equal(div.childNodes.length, 1);
                assert.equal(div.innerHTML, "a");
            });
    
            it("can take a {Node}", function () {
                // since each generator is created by the same
                // factory it is enough to test only one of them
                var div = ska.div(document.createTextNode("a"));
                
                assert.equal(div.childNodes.length, 1);
                assert.equal(div.innerHTML, "a");
            });
    
            it("can take a {Function}", function () {
                // since each generator is created by the same
                // factory it is enough to test only one of them
                var div = ska.div(ska.a);
                
                assert.equal(div.childNodes.length, 1);
                assert.equal(div.innerHTML, "<a></a>");
            });
    
            it("can take an {Array [String]}", function () {
                // since each generator is created by the same
                // factory it is enough to test only one of them
                var div = ska.div([
                    "a",
                    "b"
                ]);
                
                assert.equal(div.childNodes.length, 2);
                assert.equal(div.innerHTML, "ab");
            });
    
            it("can take an {Array [Node]}", function () {
                // since each generator is created by the same
                // factory it is enough to test only one of them
                var div = ska.div([
                    document.createTextNode("a"),
                    document.createTextNode("b")
                ]);
                
                assert.equal(div.childNodes.length, 2);
                assert.equal(div.innerHTML, "ab");
            });
    
            it("can take an {Array [Function]}", function () {
                // since each generator is created by the same
                // factory it is enough to test only one of them
                var div = ska.div([
                    ska.span,
                    ska.a
                ]);
                
                assert.equal(div.childNodes.length, 2);
                assert.equal(div.innerHTML, "<span></span><a></a>");
            });
    
            it("can take an {Array [mixed]}", function () {
                // since each generator is created by the same
                // factory it is enough to test only one of them
                var div = ska.div([
                    document.createTextNode("a"),
                    "b",
                    ska.a("c")
                ]);
                
                
                assert.equal(div.childNodes.length, 3);
                assert.equal(div.innerHTML, "ab<a>c</a>");
            });
    
            it("can take {String} argument", function () {
                // since each generator is created by the same
                // factory it is enough to test only one of them
                var div = ska.div([
                    "a",
                    "b"
                ]);
                
                assert.equal(div.childNodes.length, 2);
                assert.equal(div.innerHTML, "ab");
            });
    
            it("can take {Node} arguments", function () {
                // since each generator is created by the same
                // factory it is enough to test only one of them
                var div = ska.div(
                    document.createTextNode("a"),
                    document.createTextNode("b")
                );
                
                assert.equal(div.childNodes.length, 2);
                assert.equal(div.innerHTML, "ab");
            });
    
            it("can take {Function} arguments", function () {
                // since each generator is created by the same
                // factory it is enough to test only one of them
                var div = ska.div(
                    ska.span,
                    ska.a
                );
                
                assert.equal(div.childNodes.length, 2);
                assert.equal(div.innerHTML, "<span></span><a></a>");
            });
    
            it("can take mixed arguments", function () {
                // since each generator is created by the same
                // factory it is enough to test only one of them
                var div = ska.div(
                    document.createTextNode("a"),
                    "b",
                    ska.a("c")
                );
                
                
                assert.equal(div.childNodes.length, 3);
                assert.equal(div.innerHTML, "ab<a>c</a>");
            });
    
            it("can take an {Object} and {Array|Node|String}", function () {
                // since each generator is created by the same
                // factory it is enough to test only one of them
                var div = ska.div({
                    "id": "a",
                    "class": "b"
                });
                
                assert.equal(div.getAttribute("id"), "a");
                assert.equal(div.getAttribute("class"), "b");
            });
    
            it("can be created (custom) and removed as a tag", function () {
                var custom = ska.generateDOMFactory("custom", ska);
                var element = custom({
                    "id": "a",
                    "class": "b"
                });
                
                assert.equal(element.tagName.toLowerCase(), "custom");
                assert.equal(element.getAttribute("id"), "a");
                assert.equal(element.getAttribute("class"), "b");
                assert.equal(ska.custom, custom);
            });
    
            it("allow nesting", function () {
                var html = ska.a([
                    ska.span,
                    ska.span(
                        ska.i("italic"),
                        "content"
                    )
                ]);
                
                assert.equal(html.outerHTML, "<a><span></span><span><i>italic</i>content</span></a>");
            });
            
        });
        
        it("can create a DocumentFragment with content", function () {
            var df = ska.fragment(
                ska.a,
                ska.strong
            );
            
            assert.equal(df.childNodes.length, 2);
            assert.equal(df.childNodes[0].outerHTML, "<a></a>");
            assert.equal(df.childNodes[1].outerHTML, "<strong></strong>");
        });
        
        it("can replace elements", function () {
            var a = ska.a();
            var df = ska.fragment(a);
            
            ska.replace(a, ska.span);
            
            assert.equal(df.childNodes.length, 1);
            assert.equal(df.childNodes[0].outerHTML, "<span></span>");
        });
        
    });

}(skadoosh, chai));