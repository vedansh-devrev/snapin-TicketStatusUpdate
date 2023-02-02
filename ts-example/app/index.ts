import fetch from "node-fetch"
import { AutomationEvent, AutomationInterface, AutomationMetadata } from "../sdk"

export class App implements AutomationInterface {
	GetMetadata(): AutomationMetadata {
		return { name: "Flow POC App", version: "0.1" }
	}

	async Run(events: AutomationEvent[]) {
		console.log("Running flow POC app");
		console.log("Logging input events...");
		for (var event of events) {
			console.log(event);
		}

		await this.PostToTimeline(events[0]);
	}

	async PostToTimeline(event: AutomationEvent) {
		console.log("Posting to timeline... ", event)
		try {
			const baseURL = 'https://api.dev.devrev-eng.ai/works/'
			const workID = event.payload["work_created"]["work"]["id_v1"]
			const partName = event.payload["work_created"]["work"]["applies_to_part"]["name"]
			const newPriority = event.payload["work_created"]["work"]
			const url = baseURL + workID + '/comments';
			const resp = await fetch(url, {
				method: 'POST',
				headers: {
					"authorization": event.input_data.keyrings["devrev_token"],
					"content-type": "application/json",
					"accept": "application/json, text/plain, */*",
				},
				body: JSON.stringify({
					artifactIds: [],
					body: "Created work on part name: " + partName,
				}),
			});

			if (resp.ok) {
				console.log("Posted successfully.");
			} else {
				let body = await resp.text();
				console.log("Error while posting: ", resp.status, body);
			}
		} catch (error) {
			console.log('Error: ', error);
		}
	}
}
