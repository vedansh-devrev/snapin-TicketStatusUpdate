build:
	npm install
	npm run build

run:
	ts-node main.ts

create: build
	aws lambda create-function --profile dev --function-name flow-poc --runtime "nodejs16.x" --role arn:aws:iam::020040093233:role/flow-poc --zip-file "fileb://dist/index.zip" --handler index.lambdaHandler

update: build
	aws lambda update-function-code --profile dev --function-name flow-poc --zip-file "fileb://dist/index.zip"
