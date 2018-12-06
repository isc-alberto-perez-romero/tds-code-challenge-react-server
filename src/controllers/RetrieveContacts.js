'use strict';

import { EC2_SERVICE_URL } from '../config/config';

/**
* Retrieve contacts from the database.
*
* This function does not interact directly with a database, unless the
* responding web service is mounted into one. Instead, it just calls
* an API that will retrieve the information, and return it as an array
* of JSON objects.
*
* The API that will be called is defined in the (../config/config.js) file
* as EC2_SERVICE_URL.
*
* @author Alberto Pérez Romero
* @returns An array of JSON objects, representing the existing contacts.
*/
const RetrieveContacts = async() => {
	try {
		// Retrieve the contact list from the EC2_SERVICE_URL:
		const response = await fetch(EC2_SERVICE_URL);
		// Then, format it as JSON:
		const receivedJson = await response.json();
		// Return the JSON object.
		return receivedJson;
	} catch (err) {
		// An error happened.
		console.log('Error while retrieving contacts from db:' + err);
		throw err;
	}
};

export default RetrieveContacts;
