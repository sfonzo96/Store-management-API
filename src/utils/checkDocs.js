// Checks if the user has already uploaded 3 documents
const checkDocs = async (user) => {
  return user.documents.length === 3 ? true : false;
};

export default checkDocs;
