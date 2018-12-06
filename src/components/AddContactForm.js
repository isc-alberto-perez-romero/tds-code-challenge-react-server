'use strict';

import React from 'react';
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap';
/**
* Form to be filled to add a contact. Created with JSX.
*
* Notice how the parameters are in camelCase when retrieving them.
* They will be switched to snake_case before sending the contact, to
* emphasize that they are the database parameters to be inserted.
*
* @author Alberto Pérez Romero
* @param {properties} props Properties object containing the addContact()
*														and handleImage() functions (both defined in
*														the ContactListApp class, located at
*														./index.js).
*/
const AddContactForm = (props) => (
	<Form inline onSubmit={props.addContact} encType="multipart/form-data">
		<FormGroup>
			<p>Add new contact:</p>
			<table className="table">
				<thead>
					<tr>
						<th>Picture</th>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Phone Number</th>
						<th> </th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<FormControl
								type="file"
								name="img"
								placeholder="Upload a picture"
								onChange={props.handleImage}
							/>
						</td>
						<td>
							<FormControl
								type="text"
								size="15"
								maxLength="64"
								name="firstName"
								placeholder="First Name"
							/>
						</td>
						<td>
							<FormControl
								type="text"
								size="15"
								maxLength="64"
								name="lastName"
								placeholder="Last Name"
							/>
						</td>
						<td>
							<FormControl
								type="text"
								size="15"
								maxLength="25"
								name="phone"
								placeholder="Phone number"
							/>
						</td>
						<td>
							<Button type="submit">Add Contact</Button>
						</td>
					</tr>
				</tbody>
			</table>
		</FormGroup>
	</Form>
);

export default AddContactForm;
