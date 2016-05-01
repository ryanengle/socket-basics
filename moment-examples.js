var moment = require('moment');

// get current time in an object
var now = moment();
console.log(now.format() + '\n');
console.log(now.format("ddd, MMM Do YYYY, hh:mm:ssa") + '\n');

now.subtract(1, 'year');
console.log(now.format("ddd, MMM Do YYYY, hh:mm:ssa") + '\n');

now.add(1, 'year');
console.log(now.format("ddd, MMM Do YYYY, hh:mm:ssa") + '\n');

console.log(now.format("ddd, YYYY-MM-DD HH:mm:ss") + '\n');

// Unix time
console.log(now.format('X')); 

// Unit time plus milliseconds (javascript)
console.log(now.format('x'));

var timeStamp = 1462056020091;
var timeStampMoment = moment.utc(timeStamp);


console.log('Example ' + timeStampMoment.local().format('ddd, YYYY-MM-DD HH:mm:ss'));