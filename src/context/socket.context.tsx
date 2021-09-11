import { createContext, useContext, useEffect, useState } from 'react'
import io, {Socket} from 'socket.io-client'
import { SOCKET_URL } from '../config/default'
import EVENTS from '../config/events'

interface Context {
  socket: Socket;
  username?: string;
  setUsername: Function;
  userColor: string;
  // messages?: {message: string, time: string, username: string}[];
  // setMessages: Function;
  userId?: string;
  users: any[];

}

const socket = io(SOCKET_URL)

const SocketContext = createContext<Context>({
  socket,
  setUsername: () => false,
  userColor: 'ff0000',
  // setMessages: () => false,
  // messages: [],
  users: []
})

function SocketsProvider(props: any) {
  const [username, setUsername] = useState("")
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])

  useEffect(() => {
    window.onfocus = () => {
      document.title = 'Multi 🎉'
    }
  }, [])

  socket.on(EVENTS.SERVER.USERS, (value) => {
    setUsers(value)
  })

  // socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
  //   setRoomId(value)
  //   setMessages([])
  // })

  // socket.on(EVENTS.SERVER.MESSAGE, ({message, username, time}) => {
  //   // If tab is not active, we want to dsiplat new msg as the title
  //   if (!document.hasFocus()) {
  //     document.title = '🎉🎉🎉🎉'
  //   }

  //   setMessages([
  //     ...messages,
  //     {
  //       message,
  //       username,
  //       time
  //     }
  //   ])
  // })

  return (
    <SocketContext.Provider 
      value={{socket, username, setUsername, users, messages, setMessages}}  
      {...props}
    />
     
   
  )
}

// export a way to use our SocketsProvider:
export const useSockets = () => useContext(SocketContext)

// export the actual SocketsProvider:
export default SocketsProvider 