module.exports = link
link.peek = linkPeek

var toString = require('mdast-util-to-string')
var checkQuote = require('../util/check-quote')
var formatLinkAsAutolink = require('../util/format-link-as-autolink')
var phrasing = require('../util/container-phrasing')
var safe = require('../util/safe')

function link(node, _, context) {
  var quote = checkQuote(context)
  var suffix = quote === '"' ? 'Quote' : 'Apostrophe'
  var url = node.url || ''
  var title = node.title || ''
  var exit
  var value
  var subexit
  var currentStack

  if (formatLinkAsAutolink(node)) {
    // Hide the fact that we’re in phrasing, because escapes don’t work.
    currentStack = context.stack
    context.stack = []
    exit = context.enter('autolink')
    value = '<' + toString(node) + '>'
    exit()
    context.stack = currentStack
    return value
  }

  exit = context.enter('link')
  subexit = context.enter('label')
  value = '[' + phrasing(node, context, {before: '[', after: ']'}) + ']('
  subexit()

  if (
    // If there’s no url but there is a title…
    (!url && title) ||
    // Or if there’s markdown whitespace or an eol, enclose.
    /[ \t\r\n]/.test(url)
  ) {
    subexit = context.enter('destinationLiteral')
    value += '<' + safe(context, url, {before: '<', after: '>'}) + '>'
  } else {
    // No whitespace, raw is prettier.
    subexit = context.enter('destinationRaw')
    value += safe(context, url, {before: ' ', after: ' '})
  }

  subexit()

  if (title) {
    subexit = context.enter('title' + suffix)
    value +=
      ' ' + quote + safe(context, title, {before: quote, after: quote}) + quote
    subexit()
  }

  value += ')'

  exit()
  return value
}

function linkPeek(node) {
  return formatLinkAsAutolink(node) ? '<' : '['
}
