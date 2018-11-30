import { EC2_SERVICE_URL } from '../config/config';

const RetrieveContacts = async() => {
    try {
        const response = await fetch(EC2_SERVICE_URL);
        const receivedJson = await response.json();
        return receivedJson;
    } catch (err) {
        console.log('Error while retrieving contacts from db:' + err);
        throw err;
    }
};

export default RetrieveContacts;