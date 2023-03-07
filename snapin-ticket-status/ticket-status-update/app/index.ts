import {
	AutomationEvent,
	AutomationInterface,
	AutomationMetadata
} from "../sdk"

import {
	DevrevAPIRequest,
	getPartOwners
} from "./utils"

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

	async EventListener(event: AutomationEvent) {
		const oldStatus = event.payload.work_updated.old_work.stage.name;
		const currStatus = event.payload.work_updated.work.stage.name;
		const workItemType = event.payload.work_updated.work.type;
		const partID = event.payload.work_updated.work.applies_to_part.id;
		const ticketID = event.payload.work_updated.work.id;
		// Endpoints
		const partDetailsAPIMethodPath = 'parts.get';
		const timelineEntryAPIMethodPath = 'timeline-entries.create';
		// Secrets
		const devrevPATToken = event.input_data.keyrings["devrev"];
		//Fetching Part Owner Details using Part ID
		// Appending GET parameters on the endpoint
		let partOwners = await getPartOwners(partDetailsAPIMethodPath+`?id=${partID}`, devrevPATToken);
		try {
			if (partOwners != "") {
				const timelineEntryData = {
					object: ticketID,
					type: "timeline_comment",
					body: "Hey " + partOwners + ", this ticket moved to Product Assist stage and may need your attention. You are being notified because you are the part owner of this ticket."
				}
				// Checking status change and creating timeline entry request (if required).
				if (currStatus == "awaiting_product_assist" && oldStatus != "awaiting_product_assist" && workItemType == "ticket") {
					await DevrevAPIRequest(timelineEntryAPIMethodPath, {
						method: "POST",
						body: timelineEntryData,
					}, devrevPATToken);
				}
			}
			else
				console.log("No part owners to notify regarding the status change");
		} catch (error) {
			console.error('Error: ', error);
		}
	}
}