const mongoose = require('mongoose');

var courseListSchema = mongoose.Schema({
    name:String,
    creator:{id:mongoose.Schema.Types.ObjectId,name:String},
    descr:String,
    pairs:[{subject:String,catalog_nbr:String}],
    course_IDs:[mongoose.Schema.Types.ObjectId],
    visibility:{type:String,default:"private"}
}, {
    timestamps: true
})
var CourseList = mongoose.model("courselist",courseListSchema); 

module.exports = CourseList;