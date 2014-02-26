module.exports = function (grunt) {
    var pkg = grunt.file.readJSON("package.json");
    
    grunt.initConfig({
        mocha: {
            test: {
                src: ["test/spec-runner.html"]
            }
        }
    });
    
    grunt.loadNpmTasks("grunt-mocha");
    
    grunt.registerTask("test", ["mocha:test"]);
};