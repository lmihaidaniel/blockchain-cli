var watchDeamon = require('watch'),
    watchMonitor = {},
    noop = () => {};


// attach user callback to the process event emitter
process.on('cleanup', function() {
    if (watchMonitor['stop']) {
        watchMonitor.stop();
        watchMonitor = {};
    }
});

// do app specific cleaning before exiting
process.on('exit', function () {
    process.emit('cleanup');
});

// catch ctrl+c event and exit normally
process.on('SIGINT', function () {
    console.log('...', 'quitting');
    process.exit(2);
});

//catch uncaught exceptions, trace, then exit normally
process.on('uncaughtException', function (e) {
    console.error('Uncaught Exception...', 'quitting');
    console.error(e.stack, 'quitting');
    process.exit(99);
});

watchDeamon.createMonitor('./lib/', {
    ignoreDotFiles: true,
}, function (monitor) {
    const app = require('./lib/api/main');
    watchMonitor = monitor;

    monitor.on('changed', () => {
        app.restart();
    });

    monitor.on('removed', () => {
        app.restart();
    });

    monitor.on('created', () => {
        app.restart();
    });

    app.start();

});