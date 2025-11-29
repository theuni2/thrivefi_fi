import React from 'react'

export default function Footer() {
  return (
    <div>
        <footer className="text-white body-font bg-white">
  <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
  {/* <img className='sm:w-[10%] h-[10%] w-[20%] my-2' src='/images/logo.png' /> */}

     <a href="/" className="flex items-center">
         
          <span className="ml-3 text-2xl font-extrabold leading-tight bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 bg-clip-text text-transparent">
            ThriveFi
          </span>
        </a>

    <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">© 2025 ThriveFi 
      <a href="https://twitter.com/knyttneve" className="text-gray-600 ml-1" rel="noopener noreferrer" target="_blank"></a>
    </p>
  
  </div>
</footer>
    </div>
  )
}

