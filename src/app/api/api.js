import ENVIRONMENT from "../config/Config";

const USER = {
  Live: "https://invapi.nlm.lk/api/users", // Live;
  Development: "http://localhost:5000/api/users", // Development;
};
const RECEIVER = {
  Live: "https://invapi.nlm.lk/api/receivers", // Live;
  Development: "http://localhost:5000/api/receivers", // Development;
};
const SUPPLIER = {
  Live: "https://invapi.nlm.lk/api/suppliers", // Live;
  Development: "http://localhost:5000/api/suppliers", // Development;
};
const LAST_SUP = {
  Live: "https://invapi.nlm.lk/api/suppliers/last_code", // Live;
  Development: "http://localhost:5000/api/suppliers/last_code", // Development;
};
const INVOICE_DATA = {
  Live: "https://invapi.nlm.lk/api/invoices", // Live;
  Development: "http://localhost:5000/api/invoices", // Development;
};
const LOGIN = {
  Live: "https://invapi.nlm.lk/api/login", // Live;
  Development: "http://localhost:5000/api/login", // Development;
};
const GETDATA = {
  Live: "https://invapi.nlm.lk/api/getFilteredInvoices", // Live;
  Development: "http://localhost:5000/api/getFilteredInvoices", // Development;
};
const GET_APPROVAL_DOCS = {
  Live: "https://invapi.nlm.lk/api/approval-docs",
  Development: "http://localhost:5000/api/approval-docs", // Development;
};
const UPDATE_APPROVAL = {
  Live: "https://invapi.nlm.lk/api/updateStatus",
  Development: "http://localhost:5000/api/updateStatus",
};
const USERS = {
  Live: "https://invapi.nlm.lk/api/getUsers",
  Development: "http://localhost:5000/api/getUsers",
};
const DEPARTMENTS = {
  Live: "https://invapi.nlm.lk/api/getDepartments",
  Development: "http://localhost:5000/api/getDepartments",
};
const PASSWORDRESET = {
  Live: "https://invapi.nlm.lk/api/users/<user_id>/reset-password",
  Development: "http://localhost:5000/api/users/<user_id>/reset-password",
};
const AUTHCODERESET = {
  Live: "https://invapi.nlm.lk/api/users/<user_id>/reset-auth-code",
  Development: "http://localhost:5000/api/users/<user_id>/reset-auth-code",
};
const TRACKER = {
  Live: "https://invapi.nlm.lk/api/getDocStatus",
  Development: "http://localhost:5000/api/getDocStatus",
};
const DOCSTATUS = {
  Live: "https://invapi.nlm.lk/api/getPendingDocCount",
  Development: "http://localhost:5000/api/getPendingDocCount",
};
const LASTDOCNO = {
  Live: "https://invapi.nlm.lk/api/invoices/last-doc-no",
  Development: "http://localhost:5000/api/invoices/last-doc-no",
};
const COLLECTIONSTATUS = {
  Live: "https://invapi.nlm.lk/api/updateCollectionStatus",
  Development: "http://localhost:5000/api/updateCollectionStatus",
};
const PENDINGCOLLECTIONS = {
  Live: "https://invapi.nlm.lk/api/getPendingCollections",
  Development: "http://localhost:5000/api/getPendingCollections",
};
const LASTPONO = {
  Live: "https://invapi.nlm.lk/api/po/last-po",
  Development: "http://localhost:5000/api/po/last-po",
};
const CREATEPO = {
  Live: "https://invapi.nlm.lk/api/po/create",
  Development: "http://localhost:5000/api/po/create",
};

const GETPO = {
  Live: "https://invapi.nlm.lk/api/po/approvals",
  Development: "http://localhost:5000/api/po/approvals",
};

const GETPODETAILS = {
  Live: "https://invapi.nlm.lk/api/po/details",
  Development: "http://localhost:5000/api/po/details",
};

const UPDATEPO = {
  Live: "https://invapi.nlm.lk/api/po/update-status",
  Development: "http://localhost:5000/api/po/update-status",
};
const GETPOBYID = {
  Live: "https://invapi.nlm.lk/api/po/approvals/{id}",
  Development: "http://localhost:5000/api/po/approvals/{id}",
};
const GETSUPPLIERBYID = {
  Live: "https://invapi.nlm.lk/api/suppliers/{id}",
  Development: "http://localhost:5000/api/suppliers/{id}",
};

const getApiUrl = (apiObject) => apiObject[ENVIRONMENT];

export {
  INVOICE_DATA,
  SUPPLIER,
  USER,
  LOGIN,
  LAST_SUP,
  RECEIVER,
  GETDATA,
  GET_APPROVAL_DOCS,
  UPDATE_APPROVAL,
  USERS,
  PASSWORDRESET,
  AUTHCODERESET,
  TRACKER,
  DOCSTATUS,
  LASTDOCNO,
  COLLECTIONSTATUS,
  PENDINGCOLLECTIONS,
  DEPARTMENTS,
  LASTPONO,
  CREATEPO,
  GETPO,
  GETPODETAILS,
  UPDATEPO,
  GETPOBYID,
  GETSUPPLIERBYID,
  getApiUrl,
};
