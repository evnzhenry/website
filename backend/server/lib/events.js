const EventEmitter = require('events');

// Shared event bus for server-side notifications
// Emits: 'loan.created', 'contact.created', 'loan.reviewed'
class ServerEvents extends EventEmitter {}

const events = new ServerEvents();

module.exports = events;