const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');
const queueName = process.env.JOBS_QUEUE_NAME || 'stronic-jobs';

const queue = new Queue(queueName, { connection });

async function enqueue(name, data, opts = {}) {
  return queue.add(name, data, { removeOnComplete: true, removeOnFail: false, ...opts });
}

module.exports = { queue, enqueue };