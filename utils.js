const fs = require('fs')

function readSecret(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8')
        return data
    } catch (err) {
        console.log(`Unable to read secret from: ${filename}`)
        console.error(err)
        process.exit(-1)
        return
    }
}

function isValidTicker(ticker) {
    return (typeof ticker === 'string' && ticker.match(/^[a-z0-9]+$/i))
}

function isValidArticle(article) {
    keys = ['title', 'url', 'urlToImage', 'publishedAt', 'description']
    for (let i = 0;i < keys.length;i++) {
        key = keys[i]
        if ((!(key in article)) || typeof article[key] !== 'string' || article[key] === '') {
            return false
        }
    }
    // check for source property in article object
    if ((!('source' in article)) || typeof article['source'] !== 'object') {
        return false
    }
    // check for name property in source object (nested in article)
    if ((!('name' in article['source'])) || typeof article['source']['name'] !== 'string' || article['source']['name'] === '') {
        return false
    }
    return true
}

module.exports = {
    readSecret: readSecret,
    isValidTicker: isValidTicker,
    isValidArticle: isValidArticle
}