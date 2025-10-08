import Contact from '../db/models/contact.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite,
  userId, 
}) => {
  const skip = (page - 1) * perPage;
  
 
  const filter = { userId };
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite;
  
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
  const contacts = await Contact.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(perPage);
    
  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;
  
  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (payload, userId) => {
  const contact = await Contact.create({ ...payload, userId });
  return contact;
};

export const updateContact = async (contactId, payload, userId) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true }
  );
  return contact;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
  return contact;
};