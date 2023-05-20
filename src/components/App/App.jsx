import React, { Component } from 'react';
import {
  Title,
  Container,
  FormWrap,
  ContactWrap,
  SubTitle,
  Notification,
} from './App.styled';
import ContactForm from '../ContactForm';
import { nanoid } from 'nanoid';
import ContactList from '../ContactList';
import Filter from 'components/Filter/Filter';

class App extends Component {
  state = {
    contacts: this.props.data.contacts,
    filter: '',
  };
  /* -------------------------------------------------------------------------- */
  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }
  /* -------------------------------------------------------------------------- */
  componentDidUpdate(prevState) {
    const curContacts = this.state.contacts;
    const prevContacts = prevState.contacts;

    if (curContacts !== prevContacts) {
      localStorage.setItem('contacts', JSON.stringify(curContacts));
    }
  }
  /* -------------------------------------------------------------------------- */
  addContact = ({ name, number }) => {
    if (this.state.contacts.find(contact => contact.name === name)) {
      alert(`${name} is already in contacts!`);
    } else {
      const newContact = {
        id: nanoid(15),
        name: name,
        number: number,
      };
      this.setState(prevState => ({
        contacts: [newContact, ...prevState.contacts],
      }));
    }
  };
  /* -------------------------------------------------------------------------- */
  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };
  /* -------------------------------------------------------------------------- */
  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };
  /* -------------------------------------------------------------------------- */
  getFilteredContacts = () => {
    const { contacts, filter } = this.state;
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(({ name }) =>
      name.toLowerCase().includes(normalizedFilter)
    );
  };
  /* -------------------------------------------------------------------------- */
  render() {
    const { filter } = this.state;
    const filteredContacts = this.getFilteredContacts();
    return (
      <Container>
        <FormWrap>
          <Title>Phonebook</Title>
          <ContactForm onSubmit={this.addContact} />
        </FormWrap>
        <div>
          <SubTitle>Contacts</SubTitle>
          <Filter filter={filter} onChange={this.changeFilter} />
          {filteredContacts.length > 0 ? (
            <ContactWrap>
              <ContactList
                contacts={filteredContacts}
                onClick={this.deleteContact}
              ></ContactList>
            </ContactWrap>
          ) : (
            <Notification>You don't have contacts</Notification>
          )}
        </div>
      </Container>
    );
  }
}
export default App;
