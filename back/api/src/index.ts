import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { jsend } from './utils/jsend'
import { router } from './router'

const PORT = process.env.PORT

const app = new Koa()

app.use(jsend())
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
