// https://aws.amazon.com/blogs/compute/scripting-languages-for-aws-lambda-running-ngs-ruby-and-go/

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

const spawn = require('child_process').spawn;

exports.handler = function(event, context) {

    var ngs = spawn('ngs', ['-e', 'echo("aa")']);
    var output = "";

    //send the input event json as string via STDIN to ngs process
    ngs.stdin.write(JSON.stringify(event));

    //close the ngs stream to unblock ngs process
    ngs.stdin.end();

    //dynamically collect ngs output
    ngs.stdout.on('data', function(data) {
          output+=data;
    });

    //react to potential errors
    ngs.stderr.on('data', function(data) {
            console.log("STDERR: "+data);
    });

    //finalize when ngs process is done.
    ngs.on('close', function(code) {
            context.succeed(JSON.parse(output));
    });
}
