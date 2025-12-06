import server from "./app"
import config from "./config"


const port = config.port
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })