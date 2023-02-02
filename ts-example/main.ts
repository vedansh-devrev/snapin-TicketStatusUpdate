import { SQSHandler, SQSEvent } from 'aws-lambda';

import { AutomationInterface } from "./sdk"
import { App } from "./app"

import { Runtime } from "./runtime"

export const lambdaHandler: SQSHandler = async (event: SQSEvent) => {
  const app: AutomationInterface = new App()
  const runtime = new Runtime(app.GetMetadata(), event)

  // Any common pre processing goes here.
  runtime.PreRun()

  // Run our app.
  await app.Run(runtime.GetEvents())

  // Any common post processing goes here.
  runtime.PostRun()
}
