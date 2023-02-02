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

	async doDevrevPostAPICall(method: string, data: object, authorization: string) {
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
			redirect: 'follow'
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

		const devrevPATforAuth = "eyJhbGciOiJSUzI1NiIsImlzcyI6Imh0dHBzOi8vYXV0aC10b2tlbi5kZXYuZGV2cmV2LWVuZy5haS8iLCJraWQiOiJzdHNfa2lkX3JzYSIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiamFudXMiXSwiZXhwIjoxNzY5ODU2MDk1LCJodHRwOi8vZGV2cmV2LmFpL2F1dGgwX3VzZXJfaWQiOiJnb29nbGUtb2F1dGgyfDExMDI1NjYxMDUwNDQ4NDU0MTg2NCIsImh0dHA6Ly9kZXZyZXYuYWkvZGV2b19kb24iOiJkb246aWRlbnRpdHk6ZHZydi11cy0xOmRldm8vOG00NmNwN1IiLCJodHRwOi8vZGV2cmV2LmFpL2Rldm9pZCI6IkRFVi04bTQ2Y3A3UiIsImh0dHA6Ly9kZXZyZXYuYWkvZGV2dWlkIjoiREVWVS0xIiwiaHR0cDovL2RldnJldi5haS9kaXNwbGF5bmFtZSI6ImktdmVkYW5zaC1zcml2YXN0YXZhIiwiaHR0cDovL2RldnJldi5haS9lbWFpbCI6ImktdmVkYW5zaC5zcml2YXN0YXZhQGRldnJldi5haSIsImh0dHA6Ly9kZXZyZXYuYWkvZnVsbG5hbWUiOiJWZWRhbnNoIFNyaXZhc3RhdmEiLCJodHRwOi8vZGV2cmV2LmFpL3Rva2VudHlwZSI6InVybjpkZXZyZXY6cGFyYW1zOm9hdXRoOnRva2VuLXR5cGU6cGF0IiwiaWF0IjoxNjc1MjQ4MDk1LCJpc3MiOiJodHRwczovL2F1dGgtdG9rZW4uZGV2LmRldnJldi1lbmcuYWkvIiwianRpIjoiZG9uOmlkZW50aXR5OmR2cnYtdXMtMTpkZXZvLzhtNDZjcDdSOnRva2VuLzR0Wm1qTG15Iiwib3JnX2lkIjoib3JnX1duUHhwR200NWVlRmFWWngiLCJzdWIiOiJkb246aWRlbnRpdHk6ZHZydi11cy0xOmRldm8vOG00NmNwN1I6ZGV2dS8xIn0.rXkX9CK80zfbamoGprZMpHeEYfWPHEZ4oj-5x6MQB9CrjO_fQaVVGZf7Br-6B6A3nyaWfdUkIKVkx4D6_7BagUZwgJaX76G45I0MRQCD-aX8i0dY5TkccInM0_3gDGw57nGtgA1jjIvQMyxs-T6I8fH6cF4SdbCx8Kj4bk2in8xv-_tlh72mNHdhZQE6laE8_JEG0uWCw8w0w1kfRLogMwrxFajD3pwBocqOGNxU0AgXDTeRT0fZ7PvBee3-fJBpo3InZXcO00CxMBJqg6MkQo0Hipk5QE0gqKSulb7Vglu0G6VNtxdiei19ncFlMhGine_hqle2Sbr8WY3W4d4yBw"

		let owners_string;

		//Fetching Part Owner Details using Part ID
		try {
			owners_string = await this.getPartOwners(partDetailsAPIMethodPath, part_id, devrevPATforAuth);

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
				const resp = await this.doDevrevPostAPICall(timelineEntryAPIMethodPath, timelineEntryJSON, devrevPATforAuth);

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