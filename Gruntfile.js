module.exports = function(grunt) {

// Project configuration
grunt.initConfig({
   pkg: grunt.file.readJSON('package.json'),
   watch: {
      html: {
         files: ['**.html', '**.md', 'js/**.js', '**/**.template', '**/**.json'],
         tasks: ['default'],
         options: {
            livereload: true,
            spawn: false,
         }
      }
   },
   md2html: {
      options: {
         layout: 'layout.html'
      },
      index: {
         src: ['README.md'],
         dest: 'index.html'
      },
   },
});

// Load all the plugins!
grunt.loadNpmTasks('grunt-md2html');
grunt.loadNpmTasks('grunt-contrib-watch');

// Tasks
grunt.registerTask('default', ['md2html', 'watch']);

};
