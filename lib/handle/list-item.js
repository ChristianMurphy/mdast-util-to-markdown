import repeat from 'repeat-string'
import {checkBullet} from '../util/check-bullet.js'
import {checkListItemIndent} from '../util/check-list-item-indent.js'
import {containerFlow} from '../util/container-flow.js'
import {indentLines} from '../util/indent-lines.js'

export function listItem(node, parent, context) {
  const listItemIndent = checkListItemIndent(context)
  let bullet = checkBullet(context)

  if (parent && parent.ordered) {
    bullet =
      (parent.start > -1 ? parent.start : 1) +
      (context.options.incrementListMarker === false
        ? 0
        : parent.children.indexOf(node)) +
      '.'
  }

  let size = bullet.length + 1

  if (
    listItemIndent === 'tab' ||
    (listItemIndent === 'mixed' && ((parent && parent.spread) || node.spread))
  ) {
    size = Math.ceil(size / 4) * 4
  }

  const exit = context.enter('listItem')
  const value = indentLines(containerFlow(node, context), map)
  exit()

  return value

  function map(line, index, blank) {
    if (index) {
      return (blank ? '' : repeat(' ', size)) + line
    }

    return (blank ? bullet : bullet + repeat(' ', size - bullet.length)) + line
  }
}
