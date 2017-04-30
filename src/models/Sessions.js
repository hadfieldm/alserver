import mongoose from 'mongoose';
import es6Promise from 'es6-promise';
import connections from './connections';

let sessionSchema = new mongoose.Schema ({
    _id      : {type: String, required: true},
    session : {type: String, required: true},
    expires : {type: Date, required: true}
});

mongoose.Promise = es6Promise.Promise;
//export default mongoose.model('fesessions', sessionSchema);
export default connections.feSessionConn.model('fesessions', sessionSchema, 'sessions');