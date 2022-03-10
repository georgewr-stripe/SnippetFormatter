import react, {useState, useEffect} from 'react';
import { renderToString } from 'react-dom/server'
import copyToClipboard from './copyToClipboard'
import {ClipboardIcon, ClipboardCheckIcon} from '@heroicons/react/outline'


const CodeHighlighter = ({code, language, theme}) => {
  const [block, setBlock] = useState({
    highlighted: '',
    styles: {},
    classes: ''
  });

  const [copied, setCopied] = useState(false);

  useEffect(async () => {
    const resp = await fetch('/api/highlight', {
      method: 'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({code: code, language: language, theme: theme})
    })
    const hBlock = await resp.json();
    console.log(hBlock);
    setBlock(hBlock);
    setCopied(false);
  }, [code, language, theme]);


  const clipboardContent = renderToString(
    <table>
      <tr>
    <td style={{...block.styles, borderRadius: '0.25rem'}}>
    <pre style={block.styles} >
      <code className={block.classes} dangerouslySetInnerHTML={{__html: block.no_line_highlighted}} />
    </pre>
    </td>
      </tr>
    </table>
  )

    const handleCopy = copyToClipboard(clipboardContent, () => {
    setCopied(true);
      console.log(clipboardContent)
  });


  const iconStyles = "h-5 w-5 text-black-500 mr-1"

  return (
    <div>
      
    <pre className="m-4" style={block.styles}>
      <button
        type="button"
        onClick={(e) => handleCopy(e)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 float-right m-2"

      >
        {copied ? <ClipboardCheckIcon className={iconStyles} /> : <ClipboardIcon className={iconStyles} />}
        {copied ? 'Boom!' : 'Copy'}
      </button>
    <code className={block.classes} dangerouslySetInnerHTML={{__html: block.highlighted}} />
    </pre>
    </div>
  )

  
}

export default CodeHighlighter