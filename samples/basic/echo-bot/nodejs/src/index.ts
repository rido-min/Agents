// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import express, { Response } from 'express'
import { Request, CloudAdapter, authorizeJWT, AuthConfiguration, loadAuthConfigFromEnv } from '@microsoft/agents-bot-hosting'
import { version } from '@microsoft/agents-bot-hosting/package.json'
import { EchoBot } from './bot'

const authConfig: AuthConfiguration = loadAuthConfigFromEnv()

const adapter = new CloudAdapter(authConfig)
const myBot = new EchoBot()

const app = express()

app.use(express.json())
app.use(authorizeJWT(authConfig))

app.post('/api/messages', async (req: Request, res: Response) => {
  await adapter.process(req, res, async (context) => await myBot.run(context))
})

const port = process.env.PORT || 3978
app.listen(port, () => {
  console.log(`\nEcho Bot listening on ::${port} \n appId ${authConfig.clientId} \n debug ${process.env.DEBUG} \n sdk version ${version}`)
}).on('error', console.error)
