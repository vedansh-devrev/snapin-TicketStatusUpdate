

var requestOptions = {
  method: 'GET',
  headers: {
    Authorization : "eyJhbGciOiJSUzI1NiIsImlzcyI6Imh0dHBzOi8vYXV0aC10b2tlbi5kZXYuZGV2cmV2LWVuZy5haS8iLCJraWQiOiJzdHNfa2lkX3JzYSIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiamFudXMiXSwiZXhwIjoxNzA2ODUzMTIzLCJodHRwOi8vZGV2cmV2LmFpL2F1dGgwX3VzZXJfaWQiOiJnb29nbGUtb2F1dGgyfDExMDI1NjYxMDUwNDQ4NDU0MTg2NCIsImh0dHA6Ly9kZXZyZXYuYWkvZGV2b19kb24iOiJkb246aWRlbnRpdHk6ZHZydi11cy0xOmRldm8vOG00NmNwN1IiLCJodHRwOi8vZGV2cmV2LmFpL2Rldm9pZCI6IkRFVi04bTQ2Y3A3UiIsImh0dHA6Ly9kZXZyZXYuYWkvZGV2dWlkIjoiREVWVS0xIiwiaHR0cDovL2RldnJldi5haS9kaXNwbGF5bmFtZSI6ImktdmVkYW5zaC1zcml2YXN0YXZhIiwiaHR0cDovL2RldnJldi5haS9lbWFpbCI6ImktdmVkYW5zaC5zcml2YXN0YXZhQGRldnJldi5haSIsImh0dHA6Ly9kZXZyZXYuYWkvZnVsbG5hbWUiOiJWZWRhbnNoIFNyaXZhc3RhdmEiLCJodHRwOi8vZGV2cmV2LmFpL3Rva2VudHlwZSI6InVybjpkZXZyZXY6cGFyYW1zOm9hdXRoOnRva2VuLXR5cGU6cGF0IiwiaWF0IjoxNjc1MzE3MTIzLCJpc3MiOiJodHRwczovL2F1dGgtdG9rZW4uZGV2LmRldnJldi1lbmcuYWkvIiwianRpIjoiZG9uOmlkZW50aXR5OmR2cnYtdXMtMTpkZXZvLzhtNDZjcDdSOnRva2VuLzFDZnl4eENqdiIsIm9yZ19pZCI6Im9yZ19XblB4cEdtNDVlZUZhVlp4Iiwic3ViIjoiZG9uOmlkZW50aXR5OmR2cnYtdXMtMTpkZXZvLzhtNDZjcDdSOmRldnUvMSJ9.Z0HIwsAIKlNreIT0DBKIKwPFk06wMnkjBouLRZe9d9a8y8r5Opd1gpdiUGcEa0bxA4mlD0T1pPGrjLJ_NfTRrjlNyf4GQXD6dseRxvkjEiCXwJZrg2O9ELCWXT4JTmBTnuxz3j1yMwbuJu2KuvHFLcUqpUab58CMYrn8z72w-c14RnNW-yFnihVsJ9YtkJdyBwNokddrRKu9DM8XBBq8AuWDO684G4bjzOx4AAxmGT2wVpq22sg7_hUcqwoIE1xSWekVFf5z4HWjFPxM4-wLtO1yVZ7XmNN_DQht0ur2WeQdLOmImjvl_iMzV-t9meuW2xkQRiCM2KClJF1a6yq4hg"
  },
  redirect: 'follow'
};

const API_BASE = 'https://api.dev.devrev-eng.ai/';
let method = "parts.get";
let partID = "don:core:dvrv-us-1:devo/8m46cp7R:product/1"
let params = {
"id": partID,
};

let query = Object.keys(params)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');

let url = API_BASE + method + '?' + query;

const output = await fetch(url, requestOptions)
.then((response)=>(response.json()))
.then((result) => {
    let str = "";
    str = str + "@" + result.part.owned_by[0].display_name;
    for (let i = 1; i < (result.part.owned_by).length; i++) {
        str = str + ", @" + result.part.owned_by[i].display_name;
    }
    return str;
})
.catch(error => console.log('error', error));

console.log(output);

