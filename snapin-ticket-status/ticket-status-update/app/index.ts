import fetch from "node-fetch"
import {
	AutomationEvent,
	AutomationInterface,
	AutomationMetadata
} from "../sdk"


const API_BASE = 'https://api.dev.devrev-eng.ai/';


export class App implements AutomationInterface {

	GetMetadata(): AutomationMetadata {
		return {
			name: "E2E SnapIn to Notify Part Owner",
			version: "0.1"
		}
	}

	async Run(events: AutomationEvent[]) {
		console.log("E2E SnapIn to Notify Part Owner");
		await this.EventListener(events[0]);
	}

	async createTimelineEntry(method: string, data: object, authorization: string) {
		const url = API_BASE + method;
		const resp = await fetch(url, {
			method: 'POST',
			headers: {
				authorization,
				"content-type": "application/json",
			},
			body: JSON.stringify(data),
		});
		return resp;
	}

	async getPartOwners(method: string, partID: string, token: string) {

		var requestOptions = {
			method: 'GET',
			headers: {
				Authorization: token
			},
			//redirect: 'follow'
		};

		let params = {
			"id": partID,
		};

		let query = Object.keys(params)
			.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
			.join('&');

		let url = API_BASE + method + '?' + query;

		const owner_string = await fetch(url, requestOptions)
			.then((response) => (response.json()))
			.then((result) => {
				let str = "";
				str = str + "@" + result.part.owned_by[0].display_name;
				for (let i = 1; i < (result.part.owned_by).length; i++) {
					str = str + ", @" + result.part.owned_by[i].display_name;
				}
				return str;
			})
			.catch(error => console.log('error', error));

		return owner_string;

	}

	async EventListener(event: AutomationEvent) {

		const s = JSON.stringify(event.payload);
		console.log(`Checking and creating (if needed) a timeline entry for work updation event!`, s);

		// Current and Previous Work payloads
		const oldStatus = event.payload.work_updated.old_work.stage.name;
		const currStatus = event.payload.work_updated.work.stage.name;

		// To get the Work Type
		const workType = event.payload.work_updated.work.type;

		// IDs
		const part_id = event.payload.work_updated.work.applies_to_part.id;
		const ticket_id = event.payload.work_updated.work.id;

		// Routes
		const partDetailsAPIMethodPath = 'parts.get';
		const timelineEntryAPIMethodPath = 'timeline-entries.create';

		const devrevToken = event.input_data.keyrings["devrev"];
		let owners_string;

		//Fetching Part Owner Details using Part ID
		try {
			owners_string = await this.getPartOwners(partDetailsAPIMethodPath, part_id, devrevToken);

		} catch (error) {
			console.error('Error', error);
		}

		try {
			// Data for Entry Request API
			const timelineEntryJSON = {
				object: ticket_id,
				type: "timeline_comment",
				body: "Hey, " + owners_string + ", this ticket moved to Product Assist stage and may need your attention. You are being notified because you are the part owner of this ticket."
			}

			// Checking status change and creating timeline entry request if required.

			if (currStatus == "awaiting_product_assist" && oldStatus != "awaiting_product_assist" && workType == "ticket") {
				const resp = await this.createTimelineEntry(timelineEntryAPIMethodPath, timelineEntryJSON, devrevToken);

				if (resp.ok) {
					console.log("Successfully created timeline entry.");
				} else {
					let body = await resp.text();
					console.error("Error while creating timeline entry: ", resp.status, body);
				}
			}
		} catch (error) {
			console.error('Error: ', error);
		}
	}
}