import fetch from "node-fetch"

function parseDonV2(donV2: string) {
	const DON_SERVICE_TYPES = ['identity', 'core', 'integration', 'commerce'];
	interface ComponentsMap {
		[key: string]: string;
	}
	const donV2Parts = donV2.split(':');
	if (donV2Parts.length < 4) {
		throw new Error(`Must have at least 4 parts: ${donV2}`);
	}
	if (donV2Parts[0] !== 'don') {
		throw new Error(`Must have a valid don prefix: ${donV2}`);
	}
	if (!DON_SERVICE_TYPES.includes(donV2Parts[1])) {
		throw new Error(`Must have a valid service map: ${donV2}`);
	}
	if (donV2Parts[2] !== 'dvrv-us-1') {
		throw new Error(`Must have a valid partition: ${donV2}`);
	}
	const components = donV2Parts.slice(3);
	return components.reduce((componentsMap: ComponentsMap, component: string) => {
		const componentParts = component.split('/');
		componentsMap[componentParts[0]] = componentParts[1];
		return componentsMap;
	}, {});
}

export async function DevrevAPIRequest(endpoint, options, DEVREV_PAT) {
	// Append endpoint to root DevRev API URL
	const url = 'https://api.dev.devrev-eng.ai/' + endpoint;
	// Stringify payloads
	if (options.body) options.body = JSON.stringify(options.body);
	// Use node-fetch to make requests
	const res = await fetch(url, {
		headers: {
			Authorization: DEVREV_PAT,
			'Content-Type': 'application/json; charset=UTF-8',
		},
		...options
	})
	// Throw API errors
	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(JSON.stringify(errorData));
	}
	return await res.json();
}

export async function getPartOwners(endpoint: string, devrevPATToken: string) {
	let resp = await DevrevAPIRequest(endpoint, {
		method: "GET",
	}, devrevPATToken);
	// Making a string of part owners
	let partOwnersString = "";
	if ((resp.part.owned_by).length == 0)
		return partOwnersString;
	let { devo, devu } = parseDonV2(resp.part.owned_by[0].id);
	let mentionUser = `don:DEV-${devo}:dev_user:DEVU-${devu}`;
	partOwnersString = partOwnersString + "<" + mentionUser + ">";
	for (let i = 1; i < (resp.part.owned_by).length; i++) {
		let { devo, devu } = parseDonV2(resp.part.owned_by[i].id);
		let mentionUser = `don:DEV-${devo}:dev_user:DEVU-${devu}`;
		partOwnersString = partOwnersString + ", <" + mentionUser + ">";
	}
	return partOwnersString;
}