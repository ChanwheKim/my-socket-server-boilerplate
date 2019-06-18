const uniqid = require('uniqid');

const userIds = {};
const noop = () => {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    let id;

    socket.on('init', () => {
      id = uniqid();
      userIds[id] = socket;
      socket.emit('init', { id });
    });

    socket.on('request', (data) => {
      sendTo(data.to, to => to.emit('request', { from: id }));
    });

    socket.on('call', (data) => {
      sendTo(
        data.to,
        to => to.emit('call', { ...data, from: id }),
        () => socket.emit('failed')
      );
    });

    socket.on('end', (data) => {
      sendTo(data.to, to => to.emit('end'));
    });

    socket.on('disconnect', () => {
      delete userIds[id];
      console.log(id, 'disconnected');
    });
  });
};

function sendTo(to, done, fail) {
  const receiver = userIds[to];

  if (receiver) {
    const next = typeof done === 'function' ? done : noop;
    next(receiver);
  } else {
    const next = typeof fail === 'function' ? fail : noop;
    next();
  }
}
