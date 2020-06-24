exports.stripHTMLTags = function (content) {
  return content.replace(/<[^>]*>?/gm, '')
}
