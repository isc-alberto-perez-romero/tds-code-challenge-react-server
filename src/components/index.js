import React from 'react';
import { Grid, PageHeader, Row } from 'react-bootstrap';

import ContactList from './ContactList';
import AddContactForm from './AddContactForm';
import Contact from '../controllers/Contact';
import RetrieveContacts from '../controllers/RetrieveContacts';

import defaultUserImage from '../defaultUserImage.png';

export class ContactListApp extends React.Component {

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

    componentDidMount() {
        this.retrieveContactList();
    }

    async retrieveContactList() {
        this.setState({ isLoading: true });
        let retrievedContacts = await RetrieveContacts();
        //console.log('retrievedContacts=' + retrievedContacts);
        //console.log(JSON.stringify(retrievedContacts));
        this.setState({ isLoading: false, contacts: retrievedContacts });
    }


    addContact = async(e) => {
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

        if ((firstName && firstName.length > 0) || (lastName && lastName.length > 0)) {
            // At the very least, the user is adding a part of a name, so go ahead.


            // If no image was uploaded, set default profile image.
            if (!img || img === null) {
                img = defaultUserImage;
                //console.log('Setting img to:' + img);
                this.imageExtension = 'png';
            }

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

            // Restore form elements
            e.target.elements.firstName.value = "";
            e.target.elements.lastName.value = "";
            e.target.elements.phone.value = "";
            this.image = null;

            this.dataSent = true;
            // Upload new contact information.
            const completeContact = await newContact.uploadContactInformation();
            //console.log('completeContact=' + JSON.stringify(completeContact));
            const contactList = this.state.contacts.slice();


            // Update contact list.
            this.setState({ contacts: contactList.concat(completeContact), errorMessage: null });
        } else {
            this.setState({ errorMessage: 'ERROR: Please enter at least one name' });
        }
    }

    handleImage = (e) => {
        this.image = e.target.files[0];
        if (this.image) {
            let cutName = this.image.name.split('.');
            this.imageExtension = cutName[cutName.length - 1];
            let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

            if (validExtensions.indexOf(this.imageExtension) < 0) {
                // Error
                this.setState({ errorMessage: 'ERROR: Uploaded file can only be of type: png, jpg, gif, or jpeg.' })
            }
        }
        //console.log(this.image);
    }

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
                        <p className = "error" > <b> { this.state.errorMessage } </b></p>
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
                        <ContactList contacts = { this.state.contacts }/>   
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
                        <p className = "error" > <b> { this.state.errorMessage } </b></p>
                    </Row>   
                    <Row>
                        <AddContactForm addContact = { this.addContact }/>   
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