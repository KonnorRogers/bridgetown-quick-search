import lunr from "lunr"

class SearchEngine {
  static endpoint = "/bridgetown_quick_search/index.json"
  static async fetchAndGenerateIndex (endpoint = this.endpoint) {
    const response = await fetch(endpoint)
    const searchIndex = await response.json()
    const searchEngine = new this()
    searchEngine.generateIndex(searchIndex)

    return {
      searchIndex,
      searchEngine
    }
  }
  async generateIndex(indexData) {
    this.index = lunr(function () {
      this.ref("id");
      this.field("id", { boost: 1000 });
      this.field("title", { boost: 100 });
      this.field("categories", { boost: 10 });
      this.field("tags", { boost: 10 });
      this.field("url", { boost: 100 });
      this.field("content", { boost: 1 });

      indexData.forEach(item => {
        if (item.content) {
          this.add(item);
        }
      })
    })

    this.indexData = indexData
  }

  /**
   * @param {string} query
   * @param {number} [snippetLength=300]
   * @param {boolean} [highlight=true] - if true, will add `<mark>` around elements.
   */
  performSearch(query, snippetLength = 300, highlight = true) {
    if (highlight == null) { highlight = true }
    console.log(highlight)

    if (this.index) {
      this.query = query
      const hasQuery = query.trim().length > 0;
      const searchTokens = query
        .split(' ')
        .map((term, index, arr) => `${term}${index === arr.length - 1 ? `* ${term}~1` : '~1'}`)
        .join(' ');
      const matches = hasQuery ? this.index.search(`${query} ${searchTokens}`) : [];

      const hasResults = matches?.length > 0;

      if (hasResults) {
        return matches.map(result => {
          const item = this.indexData.find(item => item.id == result.ref)

          const contentPreview = this.previewTemplate(item.content, snippetLength, highlight)
          let titlePreview = this.previewTemplate(item.title, snippetLength, highlight)

          if (highlight === true) { titlePreview += `<!-- (${result.score}) -->` }

          return {
            id: item.id.trim(),
            score: result.score,
            title: item.title.trim(),
            collection: item.collection,
            content: item.content.trim(),
            categories: item.categories,
            url: item.url.trim(),
            heading: titlePreview,
            preview: contentPreview
          }
        })
      } else {
        return []
      }
    } else {
      throw new Error("Search index hasn't yet loaded. Run the generateIndex function")
    }
  }

  /**
   * @param {string} text
   * @param {number} [length=300]
   * @param {boolean} [highlight=true]
   */
  previewTemplate(text, length = 300, highlight = true) {
    if (length == null) { length = 300 }
    const padding = length / 2
    let output

    if (length) {
      // Get sorted locations of all the words in the search query
      const textToSearch = text.toLowerCase()
      const wordLocations = this.query.toLowerCase().split(" ").map(word => {
        return textToSearch.indexOf(word)
      }).filter(location => location != -1).sort((a,b) => { return a-b })

      // Grab the first location and back up a bit
      // Then go past second location or just use the length
      if (wordLocations[1]) {
        length = Math.min(wordLocations[1] - wordLocations[0], length)
      }

      output = text.substr(Math.max(0, wordLocations[0] - padding), length + padding)
    } else {
      output = text
    }

    if (!text.startsWith(output)) {
      output = "…" + output
    }
    if (!text.endsWith(output)) {
      output = output + "…"
    }

    if (highlight) {
      this.query.toLowerCase().split(" ").forEach(word => {
        if (word != "") {
          output = output.replace(
            new RegExp(`(${word.replace(/[\.\*\+\(\)]/g, "")})`, "ig"),
            `<strong>$1</strong>`
          )
        }
      })
    }

    return output
  }
}

export default SearchEngine
