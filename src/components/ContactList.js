'use strict';

import React from 'react';
import { Grid, Row} from 'react-bootstrap';

/**
* List of existing contacts. Created with JSX.
* The list is populated with the provided properties (props).
*
* Notice that the displayed parameters use snake_case, as a reference
* of the Contact objects coming from the database.
*
* @author Alberto Pérez Romero
* @param {properties} props Properties object containing a map with Contact
*														objects.
*/
const ContactList = (props) => (
	<div>
		<Grid>
			<Row>
				<table className="table table-striped">
					<thead>
						<tr>
							<th scope="col">Picture</th>
							<th scope="col">First Name</th>
							<th scope="col">Last Name</th>
							<th scope="col">Phone Number</th>
						</tr>
					</thead>
					<tbody>
						{props.contacts.map( contact => (
							<tr key={contact.contact_id}>
								<td><img src={contact.thumbnail_url}
									alt={contact.first_name+contact.last_name}/></td>
								<td>{contact.first_name}</td>
								<td>{contact.last_name}</td>
								<td>{contact.phone}</td>
							</tr>
						))}
					</tbody>
				</table>
			</Row>
		</Grid>
	</div>
);

export default ContactList;
