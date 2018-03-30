var mongoose = require('mongoose');

const UniqueUserSchema = new mongoose.Schema({});

const ChildSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    parent_id: {
        type: String,
        required: true
    },
    schedule: {
        Timetable: [[String]],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    score: Number,
    //IDs :
    allowedArticles: [String],
    enrolledActivities: [String],
    name: {
        firstName: { type: String, required: true },
        middleName: { type: String },
        lastName: { type: String, required: true } //Can be passed in the backend as his parent's name
    },
    birthday: Date,
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    photo: String
});


const UserSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'Parent', 'Teacher']
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true //Will be trimmed in the frontend as well while sending the request.
    },
    name: {
        firstName: { type: String, required: true },
        middleName: { type: String },
        lastName: { type: String, required: true }
    },
    birthday: Date,
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    photo: String,
    phone: String,
    address: {
        street: String,
        city: String,
        state: String,
        zip: Number
    },

    myItems: [String],
    cart: [String],
    //////////////////////////// Teacher:
    fees: Number,
    schedule: {
        Timetable: [[String]],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    about: String,
    qualifications: [String],
    students: [String]

});

// Override the transform function of the schema to delete the password before it returns the object

if (!UserSchema.options.toObject) {
    UserSchema.options.toObject = {};
}

UserSchema.options.toObject.transform = (document, transformedDocument) => {
    delete transformedDocument.password;
    return transformedDocument;
};

if (!ChildSchema.options.toObject) {
    ChildSchema.options.toObject = {};
}

ChildSchema.options.toObject.transform = (document, transformedDocument) => {
    delete transformedDocument.password;
    return transformedDocument;
};

mongoose.model('Child', ChildSchema);
mongoose.model('User', UserSchema);
mongoose.model('UniqueUser', UniqueUserSchema);
