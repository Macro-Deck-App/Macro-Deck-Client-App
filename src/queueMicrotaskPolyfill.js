if (typeof queueMicrotask === 'undefined') {
  window.queueMicrotask = function (callback) {
    Promise.resolve()
      .then(callback)
      .catch(function (err) {
        setTimeout(function () {
          throw err;
        }, 0);
      });
  };
}
