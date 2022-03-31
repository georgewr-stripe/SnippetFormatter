import formatCode from '../../lib/format';
import torchlight from '@torchlight-api/client/src/torchlight';
import Block from '@torchlight-api/client/src/block';

const token = process.env['TORCHLIGHT_TOKEN'];

export default async function handler(req, res) {
  
  let {code, language, theme} = req.body;

  torchlight.init({
    token: token.replace(/\r?\n|\r/g, ''), // stupid Node
  })
  torchlight.logger.silence()

  // Make it pretty
  code = await formatCode(code, language);

  const config = {
    language: language,
    code: code,
    theme: theme
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