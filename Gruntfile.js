module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            files: ['src/**/*.ts'],
            tasks: ['typescript']
        },
        clean: ["dist"]
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('typescript', 'Compile TypeScript files', function () {
        var done = this.async();
        grunt.util.spawn({
            cmd: 'npx',
            args: ['tsc', '--project', 'tsconfig.json']
        }, function (error, result, code) {
            if (code !== 0) {
                grunt.log.error(result.stderr || result.stdout);
                done(false);
            } else {
                grunt.log.ok('TypeScript compiled successfully.');
                done();
            }
        });
    });

    // build
    grunt.registerTask('build', ['clean', 'typescript']);
    grunt.registerTask('default', ['build']);

};
