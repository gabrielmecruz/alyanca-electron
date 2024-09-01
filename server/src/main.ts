import express, { Application, Request, Response } from 'express'
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'

import routes from './routers/routes.js'

const app: Application = express()

const port = process.env.PORT || 3000

const corsOptions: CorsOptions = {
  origin: "*",
  credentials: true
}

// middlewares
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors(corsOptions))
app.use(morgan('dev'))

// sayfalar

app.use('/api', routes)

app.get('/', (req: Request, res: Response) => {
  res.send({
    success: 'true',
    message: 'API Node.js + MySQL',
    version: '1.0.0'
  })
})


app.listen(port, () => console.log(`>> Aplicação executada na porta: ${port}`))

