import React, {useState, useEffect} from 'react';


const copyToClipboard = (content, callback) => (e) => {
  
  function listener(e) {
    e.clipboardData.setData("text/html", content);
    e.clipboardData.setData("text/plain", content);
    e.preventDefault();
  }
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);

  if (callback) {
    callback()
  } 
}

export default copyToClipboard