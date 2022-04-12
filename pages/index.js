import {useState, useEffect} from 'react'
import { useDebounce } from 'use-debounce';
import createPersistedState from 'use-persisted-state';
import Head from 'next/head'
import Image from 'next/image'
import languages from '../lib/languages.json'
import themes from '../lib/themes.json'
import CodeHighlighter from '../components/CodeHighlighter'
import { ChevronDownIcon } from '@heroicons/react/solid'
import copyToClipboard from '../components/copyToClipboard'

import dynamic from "next/dynamic";

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
);


export default function Home() {

  // Persistant States
  const useLanguageState = createPersistedState('language');
  const useThemeState = createPersistedState('theme');
  const useCodeState = createPersistedState('code');

  const [language, setLanguage] = useLanguageState(languages.JavaScript)
  const [theme, setTheme] = useThemeState(themes.Dracula)
  const [_code, setCode] = useCodeState('');
  const [code] = useDebounce(_code, 500);

  return (
    <>
    <Head>
      <link rel="shortcut icon" href="/favicons/favicon.ico" />
    <title>Snippet Formatter</title>
    </Head>
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:flex lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Snippet Formatter
          </h2>
          <p className="mt-5 text-l text-gray-500">
            Sick of pasting badly formatted code in emails and documents? 
          </p>
    <p className="mt-5 text-xl text-gray-600">
            Simply paste your code and you can copy beautifully formatted snippets into Google Docs or Gmail
          </p>
          <p className="text-xs text-gray-600">
            <pre>Partly powered by 
              <a className="text-gray-500" href="https://torchlight.dev/"> Torchlight.dev</a>
            </pre>
          </p>
        </div>
        <div className="mt-10 w-full max-w-xs">
          <label htmlFor="language" className="block text-base font-medium text-gray-500">
            Language
          </label>
          <div className="mt-1.5 relative">
            <select
              id="language"
              name="language"
              className="appearance-none block w-full bg-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-base text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => setLanguage(e.target.value)}
                value={language}
            >
                {Object.entries(languages).map(([k, v], i) => 
                  <option key={i} value={v}>{k}</option>
                )}
                
            </select>
                
            <div className="pointer-events-none absolute inset-y-0 right-0 px-2 flex items-center">
              <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
          </div>
        </div>
              <div className="mt-10 w-full max-w-xs">
          <label htmlFor="theme" className="block text-base font-medium text-gray-500">
            Theme
          </label>
          <div className="mt-1.5 relative">
            <select
              id="theme"
              name="theme"
              className="appearance-none block w-full bg-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-base text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => setTheme(e.target.value)}
                value={theme}
            >
                {Object.entries(themes).map(([k, v]) => 
                  <option value={v}>{k}</option>
                )}
                
            </select>
                
            <div className="pointer-events-none absolute inset-y-0 right-0 px-2 flex items-center">
              <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
<div>
              <div className="2xl:w-5/6 mx-auto grid grid-cols-1 md:grid-cols-2 flex items-stretch">
              <div className="m-4 sm-12 md-6">
      <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
        Paste your code here
      </label>
        
                <CodeEditor
                  value={_code}
                  name="code"
                  id="code"
                  language={language}
                  onChange={(e) => setCode(e.target.value)}
                  padding={15}
                  className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-black rounded-md bg-gray-700 text-white box-border p-2"
                  style={{
                    fontSize: 12,
                    backgroundColor: "#f5f5f5",
                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                  }}
                 />
            </div>
            <div className="sm-12 md-6 md:pt-6">
            <CodeHighlighter code={code} language={language} theme={theme} setCode={setCode}/>
            </div>
            </div>    
            </div>

            </>

  )
}

export async function getServerSideProps(context) {
  
  return {
    props: {}, 
  }
}
