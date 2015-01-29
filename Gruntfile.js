module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        coffeelint: {
            files: ['src/**/*.coffee']
        },
        watch: {
            files: ['<%= coffeelint.files %>'],
            tasks: ['coffeelint', 'coffee']
        },
        coffee: {
            glob_to_multiple: {
                expand: true,
                flatten: false,
                cwd: 'src/',
                src: ['**/*.coffee'],
                dest: 'dist/',
                ext: '.js'
            }
        },
        clean: ["dist"]
    });

    require('load-grunt-tasks')(grunt);

    // build
    grunt.registerTask('build', ['clean', 'coffeelint', 'coffee']);
    grunt.registerTask('default', ['build']);

};
