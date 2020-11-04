const utils = require('./utils')

const parseErrorMsg = '[Unable to parse]'

function parseCompanyOutlook(serverResp) {
    const requiredResponse = {}
    if (typeof serverResp === 'object' && !Array.isArray(serverResp)) {
        requiredResponse['parsing'] = true
        requiredResponse['Company Name'] = serverResp['name'] || parseErrorMsg
        requiredResponse['Stock Ticker Symbol'] = serverResp['ticker'] || parseErrorMsg
        requiredResponse['Stock Exchange Code'] = serverResp['exchangeCode'] || parseErrorMsg
        requiredResponse['Company Start Date'] = serverResp['startDate'] || parseErrorMsg
        requiredResponse['Description'] = serverResp['description'] || parseErrorMsg
    } else {
        requiredResponse['parsing'] = false
    }
    return requiredResponse
}

function parseStockSummary(serverResp) {
    const requiredResponse = {}
    if (typeof serverResp === 'object' && !Array.isArray(serverResp)) {
        requiredResponse['parsing'] = true
        requiredResponse['Stock Ticker Symbol'] = serverResp['ticker'] || parseErrorMsg
        requiredResponse['Timestamp'] = serverResp['timestamp'] || parseErrorMsg
        requiredResponse['Last Price'] = serverResp['last'] || parseErrorMsg
        requiredResponse['Previous Closing Price'] = serverResp['prevClose'] || parseErrorMsg
        requiredResponse['Opening Price'] = serverResp['open'] || parseErrorMsg
        requiredResponse['High Price'] = serverResp['high'] || parseErrorMsg
        requiredResponse['Low Price'] = serverResp['low'] || parseErrorMsg
        requiredResponse['Number of Shares Traded'] = serverResp['volume'] || parseErrorMsg

        // only available when market is available
        requiredResponse['Bid Size'] = 'bidSize' in serverResp ? serverResp['bidSize'] : parseErrorMsg
        requiredResponse['Bid Price'] = 'bidPrice' in serverResp ? serverResp['bidPrice'] : parseErrorMsg
        requiredResponse['Ask Size'] = 'askSize' in serverResp ? serverResp['askSize'] : parseErrorMsg
        requiredResponse['Ask Price'] = 'askPrice' in serverResp ? serverResp['askPrice'] : parseErrorMsg
            // can be null even when market is open
        requiredResponse['Mid Price'] = 'mid' in serverResp ? serverResp['mid'] : parseErrorMsg
    } else {
        requiredResponse['parsing'] = false
    }
    return requiredResponse
}

function parseStockInfo(serverResp) {
    const requiredResponse = {}
    if (Array.isArray(serverResp) && serverResp.length > 0) {
        requiredResponse['parsing'] = true
        requiredResponse['data'] = []
        for (let i = 0; i < serverResp.length; i++) {
            historical_data = {}
            historical_data['Date'] = serverResp[i]['date'] || parseErrorMsg
            historical_data['Open'] = serverResp[i]['open'] || parseErrorMsg
            historical_data['High'] = serverResp[i]['high'] || parseErrorMsg
            historical_data['Low'] = serverResp[i]['low'] || parseErrorMsg
            historical_data['Close'] = serverResp[i]['close'] || parseErrorMsg
            historical_data['Volume'] = serverResp[i]['volume'] || parseErrorMsg
            requiredResponse['data'].push(historical_data)
        }
    } else {
        requiredResponse['parsing'] = false
    }
    return requiredResponse
}

function parseSearch(serverResp) {
    const requiredResponse = {}
    if (Array.isArray(serverResp)) {
        requiredResponse['parsing'] = true
        requiredResponse['data'] = []
        for (let i = 0; i < serverResp.length; i++) {
            suggestion = {}
            suggestion['Ticker'] = serverResp[i]['ticker'] || parseErrorMsg
            suggestion['Name'] = serverResp[i]['name'] || parseErrorMsg
            requiredResponse['data'].push(suggestion)
        }
    } else {
        requiredResponse['parsing'] = false
    }
    return requiredResponse
}

function parseNews(serverResp) {
    const requiredResponse = {}
    if (typeof serverResp === 'object' && !Array.isArray(serverResp)) {
        requiredResponse['parsing'] = true
        requiredResponse['articles'] = []
        for (let i = 0; i < serverResp['articles'].length; i++) {
            if (utils.isValidArticle(serverResp['articles'][i])) {
                article = {}
                article['Title'] = serverResp['articles'][i]['title']
                article['Article Url'] = serverResp['articles'][i]['url']
                article['Image Url'] = serverResp['articles'][i]['urlToImage']
                article['Description'] = serverResp['articles'][i]['description']
                article['Date'] = serverResp['articles'][i]['publishedAt']
                article['Source'] = serverResp['articles'][i]['source']['name']
                requiredResponse['articles'].push(article)
            }
        }
    } else {
        requiredResponse['parsing'] = false
    }
    return requiredResponse
}

module.exports = {
    parseCompanyOutlook: parseCompanyOutlook,
    parseStockSummary: parseStockSummary,
    parseStockInfo: parseStockInfo,
    parseSearch: parseSearch,
    parseNews: parseNews
}