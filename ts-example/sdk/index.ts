type AutomationContext = {
	dev_oid: string;
	automation_id: string;
};

type ExecutionMetadata = {
};

type InputData = {
	global_values: Record<string, string>;
	event_sources: Record<string, string>;
	keyrings: Record<string, string>;
};

// Automation event sent to our app.
type AutomationEvent = {
	payload: Record<string, any>;
	context: AutomationContext;
	execution_metadata: ExecutionMetadata;
	input_data: InputData;
};

type AutomationEventBatch = {
	automation_events: AutomationEvent[];
}

// Type to capture automation metadata.
type AutomationMetadata = {
	name: string;
	version: string;
};

// Interface implemented by our app for executing automations.
export interface AutomationInterface {
	GetMetadata(): AutomationMetadata;
	Run(events: AutomationEvent[]): void;
};

export { AutomationMetadata, AutomationEvent, AutomationEventBatch };
