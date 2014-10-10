# Cards

Task management for software development sprints.

## Getting Started

### Install Tools and Dependencies

  1. Install [nodejs](http://nodejs.org/)
  1. ``npm install``

### Building the Application

Run ``npm run build`` from the project root. The application will be compiled
into the ``dist`` directory.

### Developing with LiveReload

Run ``npm run live`` from the project root, then browse to
http://localhost:4000. Changes to the html, js, and jsx files will be
detected, triggering the source bundle to compiled, triggering a
notification to the livereload server, triggering the browser to
refresh.

### Other build tasks

``npm run server``

Compile the bundle and start an express server on
http://localhost:4000.


``npm run undead``

Runs the same LiveReload setup as ``npm run live`` but will restart
  the proccess if it exits (for instance, if there is a JS syntax
  error). This is extremely tenacious and you will likely need to ``ps
  aux | grep gulp`` to find the process ID in order to kill it.

## Frameworks

  * [ReactJS](http://facebook.github.io/react/)
  * [PouchDB](http://pouchdb.com/)
