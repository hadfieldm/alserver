import mongoose from 'mongoose';
import es6Promise from 'es6-promise';
import connections from './connections';

let sessionSchema = new mongoose.Schema ({
    _id     : {type: String, required: true},
    session : {
        cookie:
            {originalMaxAge: {type: Date, required : true},
            expires: { type: Date ,required : true},
            httpOnly: {type: Boolean, required : true},
            path : { type: String, required : true},
            },
        passport:
            {user:
                {
                _id: { type: mongoose.Schema.Types.ObjectId, required : true},
                __v: { type : Number, required : true},
                google:
                    {
                        id: {type: mongoose.Schema.Types.ObjectId, required : true},
                     //   token: { type: String,required : true},
                        email:{ type: String,required : true},
                        name: { type: String,required : true}
                    }
                }
            }
    },
    expires : {type: Date, required: true}
});   

mongoose.Promise = es6Promise.Promise;
//export default mongoose.model('fesessions', sessionSchema);
export default connections.feSessionConn.model('fesessions', sessionSchema, 'sessions');