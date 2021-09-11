import './App.css';
import { useEffect, useRef, useState } from 'react';
import { useMousePosition } from './useMousePosition'
import { useSockets } from './context/socket.context'
import EVENTS from "./config/events"
import { useHotkeys } from 'react-hotkeys-hook';

function App() {
  const {socket, username, setUsername, users} = useSockets()
  const usernameRef = useRef(null) 
  const position = useMousePosition();

  const [chat, setChat] = useState<boolean>(false);
  useHotkeys('ctrl+k', () => setChat(state => !state))
  

  function handleSetUsername () {
    {/* @ts-expect-error */}
    const username = usernameRef.current.value
    
    if (!username) return

    //localStorage.setItem("username", value) 
    socket.emit(EVENTS.CLIENT.CREATE_USER, {username, position})
    setUsername(username)
  }

  useEffect(() => {
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
          {chat && (<input className="writing" autoFocus/>)}
        </div>
      </div>
      
      {!username && (
        <div className="intro">
          <div className="intro-contents">
            <input className="input" autoFocus placeholder="username" ref={usernameRef} />
            <button className="button" onClick={handleSetUsername}>Let's start</button>
          </div>
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
