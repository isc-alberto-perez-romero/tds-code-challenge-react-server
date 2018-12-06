'use strict';

import React from 'react';
import { Grid, PageHeader, Row } from 'react-bootstrap';

import ContactList from './ContactList';
import AddContactForm from './AddContactForm';
import Contact from '../controllers/Contact';
import RetrieveContacts from '../controllers/RetrieveContacts';

/**
* Main Contact List App class.
*
* This class contains the main logic in the React SPA for this project.
*
* It handles an array of Contact objects (defined in ../controllers/Contact),
* which are displayed via the ContactList method. These are retrieved from
* the database.
*
* The AddContactForm method includes all the code to input a new contact,
* for which a new Contact object is created, a picture file is taken, and
* such information is sent to the Back end API. The object in charge of
* handling that request is the newly created Contact itself.
*
* Notice that the incoming parameters are in camelCase, showing that
* they come from the coded contact form (AddContactForm).
*
* @author Alberto Pérez Romero
*
* @see Contact
* @see ContactList
* @see AddContactForm
*/
export class ContactListApp extends React.Component {

	/**
	* Initializes this class by setting:
	* 	- An empty array for the contact list,
	* 	- a boolean telling if the list is loading (to show a "Loading" message),
	* 	- an error message variable (to be displayed to the user if needed),
	* 	- an image variable that will store the picture file to be uploaded,
	* 	- a boolean stating whether the information has been sent (passed to the
	*			AddContactForm for whatever updates it needs), and
	* 	- a String with the image extension (which is a preliminary way to
	*			validate that the uploaded file is indeed a picture). // TODO: this
	*			validation should be improved in a future Sprint.
	*
	* @constructor
	* @param {properties} props Properties object sent to this object's parent
	*														class.
	*/
	constructor(props) {
		super(props);
		this.state = {
			contacts: [],
			isLoading: false,
			errorMessage: null,
		};
		this.image = null;
		this.dataSent = false;
		this.imageExtension = null;
	}

	/**
	* Ensures that the contact list is retrieved from the database as
	* soon as this component is mounted.
	*
	* @see retrieveContactList()
	*/
	componentDidMount() {
		this.retrieveContactList();
	}

	/**
	* Retrieves the contact list from the database.
	*
	* This calls the RetrieveContacts function in the ../controllers folder,
	* which handles the interaction with the service to get the list. The
	* received list is in JSON format, and translated into an array of Contact
	* objects, which is updated into the state of this object, and will then be
	* displayed to the user.
	*
	* @see RetrieveContacts
	*/
	async retrieveContactList() {
		this.setState({ isLoading: true });
		let retrievedContacts = await RetrieveContacts();

		//console.log(JSON.stringify(retrievedContacts));
		if(retrievedContacts.results && retrievedContacts.results.length <1) {
			// If there are no contacts yet, server returns:
			// {"resultCount":0,"results":[]}
			retrievedContacts = [];
		}
		// Else, it returns an array of Contact objects as JSON,
		// but not the resultCount nor result fields.
		this.setState({ isLoading: false, contacts: retrievedContacts });
	}


	/**
	* Adds a new contact to the list.
	*
	* To do so, this function follows these steps:
	* 1. Takes the parameters from the filled AddContactForm.
	* 2. Creates a new Contact object (defined in ../controllers/Contact.js) and
	*		 populates it with the provided parameters and image file.
	* 3. Calls the uploadContactInformation() function from the newly created
	*		 Contact and waits for its addition to the database, and
	* 4. Finally, adds the new Contact (now complete) to the contact list.
	*
	* @param {Event} e The event that invoked this function, coming from the
	*								AddContactForm.
	* @see Contact.uploadContactInformation()
	*/
	async addContact (e) {
		// Prevent the app from reloading the page...
		e.preventDefault();

		// Retrieve information from form.
		const firstName = e.target.elements.firstName.value;
		const lastName = e.target.elements.lastName.value;
		const phone = e.target.elements.phone.value;
		let img = this.image;

		//console.log('firstName=' + firstName);
		//console.log('lastName=' + lastName);
		//console.log('phone=' + phone);
		//console.log('img=' + img);

		if ((firstName && firstName.length > 0) ||
              (lastName && lastName.length > 0)) {
			// At the very least, the user is adding a first name or last name,
			// so go ahead.

			// Create a new contact.
			let newContact = new Contact(
				null,
				firstName,
				lastName,
				phone,
				img,
				null,
				null
			);
			//console.log('newContact=' + JSON.stringify(newContact));

			// Restore form elements:
			e.target.elements.firstName.value = '';
			e.target.elements.lastName.value = '';
			e.target.elements.phone.value = '';
			e.target.files[0].name = '';
			this.image = null;
			this.dataSent = true;

			// Upload new contact information.
			const completeContact =
                          await newContact.uploadContactInformation();
			//console.log('completeContact=' + JSON.stringify(completeContact));
			//console.log('contacts='+JSON.stringify(this.state.contacts));

			// Update contact list.
			const contactList = this.state.contacts.slice();
			this.setState({
				contacts: contactList.concat(completeContact),
				errorMessage: null
			});
		} else {
			// The user needs to enter, at the very least, the first or last names.
			this.setState({
				errorMessage: 'ERROR: Please enter at least one name.'
			});
		}
	}

	/**
	* Sets the image to be sent as the one the user selected.
	* This is invoked as soon as an image file is picked.
	*
	* @param {Event} e The event that invoked this function, which would be
	*										attached to an onChange listener in the AddContactForm.
	*/
	handleImage (e) {
		this.image = e.target.files[0];
		if (this.image) {

			// Basic image validation. // TODO: Improve this on future Sprints.

			//console.log('image name=' + this.image.name);
			let cutName = this.image.name.split('.');
			//console.log('cutName=' + cutName);
			this.imageExtension = cutName[cutName.length - 1];
			let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];
			if (validExtensions.indexOf(this.imageExtension) < 0) {
				// The file name does not obviously state that it's an image.
				this.setState({
					errorMessage: 'ERROR: Uploaded file can only be of type: '+
                                'png, jpg, gif, or jpeg.'
				});
			}
		}
		//console.log(this.image);
	}

	/**
	* Basic overriden function from the React.Component object.
	*
	* Renders this object as HTML to be displayed.
	* @returns A String to be processed by React to display pure HTML to the
	*						user.
	*/
	render() {
		if (this.state.isLoading) {
			return <p> Loading... </p>;
		}
		if (this.state.contacts && this.state.contacts.length > 0) {
			return (
				<Grid>
					<Row>
						<PageHeader> Contact List Application </PageHeader>
					</Row>
					<Row>
						<p className = "error">
							<b> { this.state.errorMessage } </b>
						</p>
					</Row>
					<Row>
						<AddContactForm addContact = { this.addContact }
							handleImage = { this.handleImage }
							dataSent = { this.dataSent }
						/>
					</Row>
					<Row>
					</Row>
					<Row>
						<ContactList contacts = { this.state.contacts }
						/>
					</Row>
				</Grid>
			);
		} else {
			return (
				<Grid>
					<Row>
						<PageHeader> Contact List Application </PageHeader>
					</Row>
					<Row>
						<p className = "error">
							<b> { this.state.errorMessage } </b>
						</p>
					</Row>
					<Row>
						<AddContactForm addContact = { this.addContact }
							handleImage = { this.handleImage }
							dataSent = { this.dataSent }
						/>
					</Row>
					<Row>
					</Row>
					<Row>
                    There are no contacts to display.
					</Row>
				</Grid>
			);
		}
	}
}

export default ContactListApp;
