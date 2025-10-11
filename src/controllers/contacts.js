import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  const userId = req.user._id;
  
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const sortBy = req.query.sortBy || 'name';
  const sortOrder = req.query.sortOrder || 'asc';
  const type = req.query.type;
  const isFavourite = req.query.isFavourite === 'true' ? true : 
                       req.query.isFavourite === 'false' ? false : 
                       undefined;

  const result = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    type,
    isFavourite,
    userId,
  });
  
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  
  const contact = await getContactById(contactId, userId);
  
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const userId = req.user._id;
  
  const contactData = {
    ...req.body,
    photo: req.file ? req.file.path : null,
  };
  
  const contact = await createContact(contactData, userId);
  
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  
  const updateData = { ...req.body };
  if (req.file) {
    updateData.photo = req.file.path;
  }
  
  const contact = await updateContact(contactId, updateData, userId);
  
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  
  const contact = await deleteContact(contactId, userId);
  
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  
  res.status(204).send();
};