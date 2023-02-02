import { SQSEvent, SQSRecord } from 'aws-lambda';

import { AutomationMetadata, AutomationEvent, AutomationEventBatch } from "../sdk"

export class Runtime {
    _appMeta: AutomationMetadata
    _event: SQSEvent;

    constructor(appMeta: AutomationMetadata, event: SQSEvent) {
        this._appMeta = appMeta;
        this._event = event;
    }

    GetEvents(): AutomationEvent[] {
        console.log("Called GetEvents for automations")
        let res: AutomationEvent[] = [];
        const records: SQSRecord[] = this._event.Records;
        for (var rec of records) {
            let eventBatch: AutomationEventBatch = JSON.parse(rec.body)
            for (var x of eventBatch.automation_events){
                res.push(x)
            }
        }
        console.log("Result of GetEvents ", res)
        return res
    }

    PreRun(): void {
        console.log("PreRun")
        console.log("Logging sqs records..")
        const records: SQSRecord[] = this._event.Records;
        for (var rec of records) {
            console.log(rec);
        }
    }

    PostRun(): void {
        console.log("PostRun")
    }
}
