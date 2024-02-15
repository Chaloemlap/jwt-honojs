import { serve } from '@hono/node-server'
import { Hono, Context } from 'hono'
import { sign, jwt } from 'hono/jwt'

const app = new Hono()

const user = {
  'username': 'test@gmail.com',
  'password': '1234'
}

const SECRET = 'Test' // plain text for example, not recomended for production
const ALGORITHM = 'HS512'

app.post('/login', async (c: Context) => {
  const body = await c.req.parseBody()
  if (body['username'] == user.username && body['password'] == user.password) {
    let payload = {
      sub: user.username
    } // no iat, exp check
    const token = await sign(payload, SECRET, ALGORITHM)
    return c.json({ 'access_token': token })
  } else {
    c.status(401)
    return c.json({ 'errors': 'Please check username or password.' })
  }
})

app.get('/profile', jwt({secret: SECRET, alg: ALGORITHM}), (c: Context) => {
  return c.json({'result': `Hello ${user.username}`})
})

const port: number = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
