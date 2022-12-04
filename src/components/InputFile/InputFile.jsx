import React from 'react'

function InputFile({readFile, accept}) {
  return (
    <input type="file" onChange={readFile} accept={accept.join(', ')}/>
  )
}

export default InputFile