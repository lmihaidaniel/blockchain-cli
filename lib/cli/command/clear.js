module.exports = function (vorpal) {
vorpal
    .command('clear', "Clear screen")
    .action(function(args, callback) {
        process.stdout.write("\u001B[2J\u001B[0;0f");
        callback();
    })
}