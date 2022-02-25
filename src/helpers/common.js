const Message = require('./constant');

// page meta
const pageMeta = (total, page = 1, limit = 10) => {
  let metadata = {};
  metadata.current = page;
  metadata.next = page * limit < total ? page + 1 : 0;
  metadata.limit = limit;
  metadata.total_items = total;
  metadata.total_page = total > 0 ? Math.ceil(total / limit) : 0;
  return metadata;
};

module.exports = {
  pageMeta,
};
