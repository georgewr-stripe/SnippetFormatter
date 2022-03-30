// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import torchlight from '@torchlight-api/client/src/torchlight';
import Block from '@torchlight-api/client/src/block';

const babel = require("@babel/parser");
const pythonPlugin = require('@prettier/plugin-python');
const prettier = require("prettier");

const token = process.env['TORCHLIGHT_TOKEN'];


const parsers = {
  python: 'python',
}

export default async function handler(req, res) {
  
  let {code, language, theme} = req.body;

  torchlight.init({
    token: token.replace(/\r?\n|\r/g, ''), // stupid Node
  })
  torchlight.logger.silence()

  // Make the code pretty
  let prettyCode;
  try {
      prettyCode = prettier.format(code, {
        semi: false, 
        parser: parsers[language] || babel.parse,
        plugins: [
          pythonPlugin,
          
        ]
      });
      console.log('Made it prettier')
    } catch (e) {
      console.log('Failed to make it prettier:')
      console.log(e)
    }

  const config = {
    language: language || 'js',
    code: prettyCode || code,
    theme: theme,
  }
  
  // create the block
  const block = new Block(config);

  const hBlock = await torchlight.highlight([block])
  
  res.status(200).json({
    ...hBlock[0], 
    styles: CSSstring(hBlock[0].styles), 
    no_line_highlighted: hBlock[0].highlighted.replace(
      new RegExp('(<span[^>]*?class="line-number".*?<\/span>)+', 'g'),
      ''
    )
  })
}

function CSSstring(string) {
  const css_json = `{"${string
    .replace(/; /g, '", "')
    .replace(/: /g, '": "')
    .replace(";", "")}"}`;

  const obj = JSON.parse(css_json);

  const keyValues = Object.keys(obj).map((key) => {
    var camelCased = key.replace(/-[a-z]/g, (g) => g[1].toUpperCase());
    if (!camelCased.startsWith('-')) {
      return { [camelCased]: obj[key] };
    }
  });
  return Object.assign({}, ...keyValues);
}