'use strict';

import { LAMBDA_SERVICE_URL } from '../config/config';

const FormData = require('form-data');

/**
* Contact class definition.
*
* A Contact has the following fields within itself:
*
* - A contact_id, provided by the database, and useful when mapping this
*		object as a part of the ContactList (defined in ../components/).
* - The contact's first_name, a String with a length of up to 64 characters.
* - The contact's last_name, a String with a length of up to 64 characters.
* - The contact's phone, a String with a length of up to 25 characters.
* - The contact's imageFile, an Image file retrieved from the form.
* - The contact's img_url, a String telling where in Amazon S3 the provided
*		image is saved, so that the ContactList can just reference it (via src)
*		in the HTML.
* - The contact's thumbnail_url, a String telling where in Amazon S3 is a
*		resized version of the image saved, so that the ContactList can just
*		reference it (via src) in the HTML. It is actually the resized image that
*		gets displayed in this app.
*
* Notice how the imageFile is the only field in camelCase, indicating that
* it is NOT to be saved in the database, unlike all of the other fields, which
*	are in snake_case.
*
* This object also contains the function to upload the information into a
*	web service. The URL for that is in the configuration file (found in the
* ../config/config.js path).
*
* @author Alberto Pérez Romero
*
* @see ContactList
*/
export class Contact {
	/**
	* Initializes this Contact object, setting all of its fields to what the
	* user has entered.
	*
	* @constructor
	* @param {String} contact_id This Contact's Id. It is actually assigned
	*															after database insertion, so if anything,
	*															assigning it in this constructor would only
	*															be a temporary measure.
	*	@param {String} first_name This Contact's first name.
	* @param {String} last_name This Contact's last name.
	* @param {String} phone This Contact's phone number.
	* @param {File} imageFile This Contact's picture.
	* @param {String} img_url The URL where this Contact's picture will be stored
	*													within Amazon S3.
	*	@param {String} thumbnail_url The URL where this Contact's resized picture
	*																will be stored.
	*/
	constructor(contact_id, first_name, last_name, phone, imageFile,
		img_url, thumbnail_url) {
		this.contact_id = contact_id;
		this.first_name = first_name;
		this.last_name = last_name;
		this.phone = phone;
		this.imageFile = imageFile;
		this.img_url = img_url;
		this.thumbnail_url = thumbnail_url;
	}

	/**
	* Uploads the Contact's information into a web service.
	*
	* The service URL is defined in the (../config/config.js) file as
	* LAMBDA_SERVICE_URL, which returns a JSON Object with all the Contact
	* information completed.
	*
	* @returns The complete Contact object as a JSON Object containing all of
	* 					the fields this Contact has, EXCEPT the image file. The URLs to
	*						such file are provided instead.
	*/
	async uploadContactInformation() {
		//console.log('this.imageFile=' + this.imageFile);
		//console.log('filename=' + this.imageFile.name);
		let imageExtension;

		if(this.imageFile && this.imageFile.name) {
			let cutName = this.imageFile.name.split('.');
			imageExtension = cutName[cutName.length - 1];
		} else {
			imageExtension = 'png';
		}

		// Send contact information into another service...
		let formData = new FormData();
		formData.append('contactPicFile', this.imageFile);

		// Option A (preferred): Send contact information as a JSON object,
		// and insert it into the FormData:
		let jsonToSend = JSON.stringify({
			'first_name': this.first_name,
			'last_name': this.last_name,
			'phone': this.phone,
		});
		//console.log('jsonToSend:' + jsonToSend);
		formData.append('contact', jsonToSend);

		let urlForPost = LAMBDA_SERVICE_URL + '?format=' + imageExtension;

		// Option B (proven in PROD): Send contact information in the query
		// String:
		/*let extraParam = '';

		if(this.first_name){
			extraParam  = encodeURIComponent(this.first_name);
			urlForPost += '&first_name='+extraParam;
		}
		if(this.last_name) {
			extraParam = encodeURIComponent(this.last_name);
			urlForPost += '&last_name='+extraParam;
		}
		if(this.phone) {
			extraParam = encodeURIComponent(this.phone);
			urlForPost += '&phone='+extraParam;
		}
		console.log('urlForPost=' + urlForPost);*/

		const response = await fetch(urlForPost, {
			method: 'POST',
			body: formData
		});
		const receivedJson = await response.json();

		//console.log('receivedJson=' + JSON.stringify(receivedJson));
		return receivedJson;
	}
}

export default Contact;
