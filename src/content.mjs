import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'

const replaceNodeType = (selector, newType, doc) => {
    const list = doc.querySelectorAll(selector);
    for (const node of list) {
      const bq = doc.createElement(newType)
      bq.innerHTML = node.innerHTML
      node.replaceWith(bq)
    }
}

const fixDOMForSites = (url, doc) => {
  if (url.includes("fasterthanli.me")) {
    replaceNodeType('.dialog-text', 'blockquote', doc)
  }
}

export const parseHTML = (html, url) => {
  const doc = new JSDOM(html,{url})

  fixDOMForSites(url, doc.window.document)

  const reader = new Readability(doc.window.document)
  const article = reader.parse()

  return {
    content: article.content,
    title: article.title,
  }
}

