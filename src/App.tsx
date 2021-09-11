import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import { useMousePosition } from './useMousePosition'
import { useSockets } from './context/socket.context'
import EVENTS from "./config/events"



function App() {
  const {socket, username, setUsername, users} = useSockets()
  const usernameRef = useRef(null) 
  const position = useMousePosition();

  function handleSetUsername () {
    {/* @ts-expect-error */}
    const username = usernameRef.current.value
    
    if (!username) return

    //localStorage.setItem("username", value) 
    socket.emit(EVENTS.CLIENT.CREATE_USER, {username, position})
    setUsername(username)
  }

  useEffect(() => {
    console.log('sending new position to backend')
    // Everytime the position change, we want to send that back to the server
    socket.emit(EVENTS.CLIENT.UPDATE_USER_POSITION, {position})
  }, [position])

  return (
    <main className="App">
      <div 
        className="cursor" 
        style={{transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      >
        <div className="cursor-wrapper">
          <span>{username || 'guest'}</span>
        </div>
      </div>
      
      {!username && (
        <div>
          <input autoFocus placeholder="username" ref={usernameRef} />
          <button onClick={handleSetUsername}>start</button>
        </div>
      )}

      {username && (
        users && users.map((user) => {  
          if (user.id !== socket.id) {
            return (
              <div 
                key={user.id} 
                className="cursor" 
                style={{transform: `translate3d(${user.x}px, ${user.y}px, 0)` }}
              >
                <div className="cursor-wrapper" style={{backgroundColor: user.color}}>
                  <span>{user.name}</span>
                </div>
              </div>
            )
          }
        })   
      )}
    </main>
  );
}

export default App;
