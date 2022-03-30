
const babel = require("@babel/parser");
const prettier = require("prettier");

const catchAll = async (code) => {
  return prettier.format(code, {
    semi: false,
    parser: babel.parse,
  });
};

const python = async (code) => {
  const url = process.env['PYTHON_FORMATTER_URL'];
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code: code })
  });
  return await resp.body()
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