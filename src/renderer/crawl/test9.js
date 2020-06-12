var amqp = require('amqplib');

var url = 'amqp://admin:Ybkk1027@47.105.63.7:5672';

function testHello() {
    amqp.connect(url).then(function (conn) {
        return conn.createChannel().then(function (ch) {
            var q = 'hello';
            var msg = 'Hello World!';

            var ok = ch.assertQueue(q, {durable: false});

            return ok.then(function (_qok) {
                // NB: `sentToQueue` and `publish` both return a boolean
                // indicating whether it's OK to send again straight away, or
                // (when `false`) that you should wait for the event `'drain'`
                // to fire before writing again. We're just doing the one write,
                // so we'll ignore it.
                ch.sendToQueue(q, Buffer.from(msg));
                console.log(" [x] Sent '%s'", msg);
                return ch.close();
            });
        }).finally(function () {
            conn.close();
        });
    }).catch(console.warn);


// var amqp = require('amqplib');

    amqp.connect(url).then(function (conn) {
        process.once('SIGINT', function () {
            conn.close();
        });
        return conn.createChannel().then(function (ch) {

            var ok = ch.assertQueue('hello', {durable: false});

            ok = ok.then(function (_qok) {
                return ch.consume('hello', function (msg) {
                    console.log(" [x] Received '%s'", msg.content.toString());
                }, {noAck: true});
            });

            return ok.then(function (_consumeOk) {
                console.log(' [*] Waiting for messages. To exit press CTRL+C');

            });
        });
    }).catch(console.warn);
}


function testTask() {
    amqp.connect(url).then(function (conn) {
        return conn.createChannel().then(function (ch) {
            var q = 'task_queue';
            var ok = ch.assertQueue(q, {durable: true});

            return ok.then(function () {
                var msg = process.argv.slice(2).join(' ') || "Hello World!";
                ch.sendToQueue(q, Buffer.from(msg), {deliveryMode: true});
                console.log(" [x] Sent '%s'", msg);
                return ch.close();
            });
        }).finally(function () {
            conn.close();
        });
    }).catch(console.warn);


    amqp.connect(url).then(function (conn) {
        process.once('SIGINT', function () {
            conn.close();
        });
        return conn.createChannel().then(function (ch) {
            var ok = ch.assertQueue('task_queue', {durable: true});
            ok = ok.then(function () {
                ch.prefetch(1);
            });
            ok = ok.then(function () {
                ch.consume('task_queue', doWork, {noAck: false});
                console.log(" [*] Waiting for messages. To exit press CTRL+C");
            });
            return ok;

            function doWork(msg) {
                var body = msg.content.toString();
                console.log(" [x] Received '%s'", body);
                var secs = body.split('').length - 1;
                //console.log(" [x] Task takes %d seconds", secs);
                setTimeout(function () {
                    console.log(" [x] Done");
                    ch.ack(msg);
                }, secs * 100);
            }
        });
    }).catch(console.warn);



    amqp.connect(url).then(function (conn) {
        process.once('SIGINT', function () {
            conn.close();
        });
        return conn.createChannel().then(function (ch) {
            var ok = ch.assertQueue('task_queue', {durable: true});
            ok = ok.then(function () {
                ch.prefetch(1);
            });
            ok = ok.then(function () {
                ch.consume('task_queue', doWork, {noAck: false});
                console.log(" [*] 2Waiting for messages. To exit press CTRL+C");
            });
            return ok;

            function doWork(msg) {
                var body = msg.content.toString();
                console.log(" [x] 2Received '%s'", body);
                var secs = body.split('').length - 1;
                //console.log(" [x] Task takes %d seconds", secs);
                setTimeout(function () {
                    console.log(" [x] 2Done");
                    ch.ack(msg);
                }, secs * 1100);
            }
        });
    }).catch(console.warn);
}



// testHello();

testTask();
