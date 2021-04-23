import fetch from 'node-fetch'
import Epub from 'epub-gen'

import { parseHTML } from './content.mjs'

const TITLE = 'Reading files the hard way'
const AUTHOR = 'fasterthanli.me'
const LANGUAGE = 'en'
const URLS = [
  'https://fasterthanli.me/articles/so-you-want-to-live-reload-rust',
]

const main = async (title, author, language, urls) => {
  const content = await Promise.all(
    urls.map(async (url) => {
      const req = await fetch(url)
      const text = await req.text()

      const article = parseHTML(text, url)

      return {
        title: article.title,
        data: article.content,
      }
    })
  )

  const option = {
    title,
    author,
    language,
    content,
    fonts: [
      './fonts/iosevka-ss08/iosevka-ss08-bold.ttf',
      './fonts/iosevka-ss08/iosevka-ss08-bolditalic.ttf',
      './fonts/iosevka-ss08/iosevka-ss08-regular.ttf',
      './fonts/iosevka-ss08/iosevka-ss08-italic.ttf',
    ],
    css: `
      @font-face {
        font-family: "Iosevka SS08";
        font-style: normal;
        font-weight: normal;
        src : url("./fonts/iosevka-ss08-regular.ttf");
      }

      @font-face {
        font-family: "Iosevka SS08";
        font-style: italic;
        font-weight: normal;
        src : url("./fonts/iosevka-ss08-italic.ttf");
      }

      @font-face {
        font-family: "Iosevka SS08";
        font-style: normal;
        font-weight: bold;
        src : url("./fonts/iosevka-ss08-bold.ttf");
      }

      @font-face {
        font-family: "Iosevka SS08";
        font-style: italic;
        font-weight: bold;
        src : url("./fonts/iosevka-ss08-bolditalic.ttf");
      }

      pre, code, pre *, code *, pre p {
        font-family: "Iosevka SS08" !important;
      }

      pre {
        font-size: 0.8rem !important;
        white-space: pre-wrap;
      }

      pre {
        border: 1px solid currentColor;
        border-left: 3px solid currentColor;
        padding: 0 1em;
        border-radius: 6px;
      }

      blockquote {
        border-left: 2px solid currentColor;
        margin-left: 0;
        padding-left: 1em;
        padding-top: 0.1em;
        padding-bottom: 0.1em;
      }

      img {
        width: 100%;
      }
    `,
  }

  new Epub(option, './test.epub').promise.then(
    () => console.log('Ebook Generated Successfully!'),
    (err) => console.error('Failed to generate Ebook because of ', err)
  )
}

main(TITLE, AUTHOR, LANGUAGE, URLS)
