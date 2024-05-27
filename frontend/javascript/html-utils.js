const escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;'
}

const unescapeMap = {
  '&amp;': "&",
  '&lt;': "<",
  '&gt;': ">",
  '&#39;': "'",
  '&quot;': '"'
}

/**
  * @param {string} str
  */
export function unescapeHTML (str) {
  return str
    // Need to replace all ampsersands first.
    .replaceAll(
      /&lt;|&gt;|&#39;|&quot;/g,
      (tag) => {
      	return unescapeMap[tag] || tag
      }
    )
    .replaceAll(/&amp;/g, "&")
}

/**
  * @param {string} str
  */
export function escapeHTML (str) {
  return str
    // Need to replace all ampsersands first.
    .replaceAll(/&/g, "&amp;")
    .replaceAll(
      /<>'"/g,
      (tag) => {
      	return escapeMap[tag] || tag
      }
  )
}
