const mongoose = require('mongoose');


var courseSchema = mongoose.Schema({
    catalog_nbr:String,
    subject:String,
    className:String,
    course_info:[{
        class_nbr: Number,
        start_time: String,
        descrlong: String,
        end_time: String,
        campus: String,
        facility_ID: String,
        days: [String],
        instructors: [String],
        class_section: String,
        ssr_component: String,
        enrl_stat: String,
        descr:String,
        
    }],
    reviews:[{
        user:{id:mongoose.Schema.Types.ObjectId,name:String},
        hidden:String,
        content:String,
        ctime:{type:Date,default:Date.now}
    }],
    catalog_description:String,
    
}, {
    timestamps: true
});


var Course = mongoose.model("course",courseSchema);


module.exports = Course;