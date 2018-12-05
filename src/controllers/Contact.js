import { LAMBDA_SERVICE_URL } from '../config/config';
import defaultUserImage from '../defaultUserImage.png';

const FormData = require('form-data');
const fs = require('fs');

export class Contact {
    constructor(contact_id, first_name, last_name, phone, imageFile, img_url, thumbnail_url) {
        this.contact_id = contact_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone = phone;
        this.imageFile = imageFile;
        this.img_url = img_url;
        this.thumbnail_url = thumbnail_url;
    }
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
            "first_name": this.first_name,
            "last_name": this.last_name,
            "phone": this.phone,
        });
        console.log('jsonToSend:' + jsonToSend);
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
