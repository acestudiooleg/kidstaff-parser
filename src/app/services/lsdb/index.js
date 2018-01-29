import LocalStorageDB from 'localstoragedb';

const kidstaff = new LocalStorageDB('kidstaff', localStorage);

const artModel = [
  '_id',
  '_available',
  'picture',
  'model',
  'keywords',
  'description',
  'categoryId',
  'characteristics',
  'picture',
  'warranty',
  'price',
  'shopsection',
];

const myjsonModel = ['data'];

if (kidstaff.isNew()) {
  kidstaff.createTable('articles', artModel);
  kidstaff.createTable('myjson', myjsonModel);
  kidstaff.commit();
}


export default kidstaff;
