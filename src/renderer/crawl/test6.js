const delay = require('delay');
const PQueue = require('p-queue');

const queue = new PQueue({concurrency: 2});

let count = 0;
queue.on('active', () => {
    console.log(`Working on item #${++count}.  Size: ${queue.size}  Pending: ${queue.pending}`);
});

queue.add(() => Promise.resolve('sdf1')).then((a) => console.log(a));
queue.add(() => delay(2000));
queue.add(() => Promise.resolve('sdf2')).then((a) => console.log(a));
queue.add(() => Promise.resolve('sdf3')).then((a) => console.log(a));
queue.add(() => delay(500));

queue.start();
