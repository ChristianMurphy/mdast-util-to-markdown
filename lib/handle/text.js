module.exports = text

var safe = require('../util/safe.js')

function text(node, parent, context, safeOptions) {
  return safe(context, node.value, safeOptions)
}
