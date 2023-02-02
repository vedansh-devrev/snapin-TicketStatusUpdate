# Snap-in to notify the Part Owner of a ticket if the status transitions to “Awaiting Product Assist”

Tickets are stalling out in the “Awaiting Product Assist” stage because Part Owners are not being notified. This automation creates a timeline entry to notify the part owner(s) when the ticket status transitions to “Awaiting Product Assist”. 

## Steps to run the snap-in:

[Refer this Documentation for basic requirements and setup](https://docs.google.com/document/d/1U7_6TgE9P18NGkz_9Zb9bQiukQ0-KdjayvOxG28H4qU/edit#heading=h.ufym6jrip4vw)

-Only Devrev-PAT Connection is required for this snap in to install and deploy.
-Implement the Automation Interface, to receive webhook events.
-Use Datadog and Cloudwatch logs for debugging purposes.
	
For a demo snap-in code (automation which creates a notification on github branch creation), refer to this repository.
[Let's go to the repository](https://github.com/devrev/flow-lambda-poc)

Since there is no dedicated documentation for web-hook events payload, use Cloudwatch logs (with JSON.stringify()) to view the JSON structure of the incoming event payloads.
