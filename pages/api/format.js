
const babel = require("@babel/parser");
const prettier = require("prettier");

const pythonURL = process.env['PYTHON_FORMATTER_URL'].replace(/\r?\n|\r/g, '');

const catchAll = async (code) => {
  return prettier.format(code, {
    semi: false,
    parser: babel.parse,
  });
};

const python = async (code) => {
  
  const resp = await fetch(pythonURL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code: code })
  });
  const text = await resp.text()
  console.log(text)
  return text
};

const formatCode = async (code, language) => {
  // Our trusty friend JavaScript
  let parser = catchAll;

  // Can we do better?
  switch (language) {
    case 'python':
      parser = python;
  }

  // Make the code pretty
  try {
    code = await parser(code);
    console.log('Made it prettier')
  } catch (e) {
    console.log('Failed to make it prettier:')
    console.log(e)
  }
  return code
}

export default formatCode