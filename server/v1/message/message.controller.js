
// const Schedule =  require('../../../modules/schedule.schema');
const { ObjectId } = require('mongodb');
// const { templatesData } = require('./messageTemplatesStaticData');
// const { templatesData }

const templatesData = [
    {
        subjectId: 'aced',
        category: 'Leave application',
        template: `<p>
                      Hello sir my name is
                      <input 
                         id='applicantName'
                         type='text' 
                         placeholder='Name'
                       />
                      &
                      <span>
                          <input
                              type='text'
                              placeholder='Gender'
                              class='tooltip__input'
                          />
                      </span>

                      i want to take leave from
                      <span>
                        <input 
                         id='applicationStartDate'
                         type='date' 
                         placeholder='Date'
                       />
                      </span>
                       to
                      <span>
                        <input
                         id='applicationEndDate'
                         type='date'
                         placeholder='Date'
                       />
                      </span>
                       the reason behind this is  ths
                      <span>
                       <select class="custom_selector__send_message__select select" id="select_for" name="reason">
                         <option class="option-style" value="medical">Medical</option>
                         <option  class="option-style" value="festival">Festival</option>
                         <option  class="option-style" value="work">Work</option>
                         <option  class="option-style" value="tour">Tour</option>
                        </select>
                      </span>
                  </p>`
    },
    {
        subjectId: 'aced1',
        category: 'Emergency meeting',
        template: `<p>
                      Hello Teams
                      <input 
                         id='applicantName'
                         type='text' 
                         placeholder='Name'
                       />
                      this message is regarding to the a meeting on
                      <span>
                        <input 
                         id='applicationStartDate'
                         type='date' 
                         placeholder='Date'
                       />
                      </span>
                     
                       the reason behind this is  ths
                      <span>
                       <select class="custom_selector__send_message__select select" id="select_for" name="reason">
                         <option class="option-style" value="project-discussion">Project discussion</option>
                         <option  class="option-style" value="hiring">Hiring</option>
                         <option  class="option-style" value="work">Work</option>
                        </select>
                      </span>
                  </p>`
    },
    {
        subjectId: 'aced3',
        category: 'Tour plan',
        template: `<p>
                      Hello Team
                      <input 
                         id='applicantName'
                         type='text' 
                         placeholder='Name'
                       />
                      this message is regarding to the company is planing the trip from 
                      <span>
                        <input 
                         id='applicationStartDate'
                         type='date' 
                         placeholder='Date'
                       />
                      </span>
                      to 
                      <span>
                        <input
                         id='applicationEndDate'
                         type='date'
                         placeholder='Date'
                       />
                      </span>
                     
                       these are the option available for you guys to select anyone from that
                       <select class="custom_selector__send_message__select select" id="select_for" name="reason">
                         <option class="option-style" value="jaipur">Jaipur</option>
                         <option  class="option-style" value="shimla">Shimla</option>
                         <option  class="option-style" value="tasken">Tasken</option>
                        </select>
                  </p>`
    }
];

const selectionOptions = [
    {
        category: 'Leave application',
        selectionOptions: [
            {
                label: 'Festival',
                value: 'festival'
            },
            {
                label: 'Work',
                value: 'work'
            },
            {
                label: 'Tour',
                value: 'tour'
            },
            {
                label: "Family's take care",
                value: "family's take care"
            },
            {
                label: "To attend a party",
                value: "to attend a party"
            }
        ],
        toolTipOptions: ["He", "She", "Other", "test1"]  
    },
    {
        category: 'Tour plan',
        selectionOptions: [
            {
                label: 'Jaipur',
                value: 'jaipur'
            },
            {
                label: 'Shimla',
                value: 'shimla'
            },
            {
                label: 'Tasken',
                value: 'tasken'
            },
            {
                label: 'Andman and nikobar',
                value: 'andman and nikobar'
            }
        ],
        typesOfTrip: [
            {
                label: 'Business',
                value: 'business'
            },
            {
                label: 'Fun',
                value: 'fun'
            },
            {
                label: 'Yearly tour',
                value: 'yearly-tour'
            }
        ]
    },
    {
        category: 'Emergency meeting',
        selectionOptions: [
            {
                label: 'Work',
                value: 'work'
            },
            {
                label: 'Project discussion',
                value: 'project-discussion'
            },
            {
                label: 'Hiring',
                value: 'hiring'
            }
        ],
        typesOfTrip: [
            {
                label: 'Business',
                value: 'business'
            },
            {
                label: 'Fun',
                value: 'fun'
            },
            {
                label: 'Yearly tour',
                value: 'yearly-tour'
            }
        ]
    },

]

async function searchAutoCompleteSubject(req, res) {
    try {
        const queryString = req.query;
        const mongo = req.app.get('db');

        if (!queryString.subject) {
            return res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `unable to filter the subjects details from Database`
                },
                "data": [],
            })
        } 

        const filterQuery = {
            subject: {
                $regex: queryString.subject,
                // $options: 'i'
            }
        };

        const filteredSubjects = await mongo.collection('message').find(filterQuery).toArray();
        if (filteredSubjects){
            return res.status(201).json({
                "meta": {
                    "success": true,
                    "message": `Subjects successfully filtered from the Database`
                },
                "data": filteredSubjects,
            })
        }

    } catch (error) {
        return res.status(500).json({
            "meta": {
                "success": false,
                "message": `Internal server error ${error}`
            },
            "data": null,
        })
        console.log("Error", error)
    }
};

async function addMessage(req, res) {
    try {
        const mongo = req.app.get('db');
        const createdAt = new Date();
        const dataToAdd = {
           ...req.body, 
           createdAt
        } 

        const newMessage = await mongo.collection('message').insertOne(dataToAdd);

        const insertedMessage = await mongo.collection('message').findOne({ _id: newMessage.insertedId });

        if (!newMessage) {
            return res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `unable to save new message details to Database`
                },
                "data": null,
            })
        } else {
            return res.status(201).json({
                "meta": {
                    "success": true,
                    "message": `Message successfully cerated to the Database`
                },
                "data": insertedMessage,
            })
        }

    } catch (error) {
        return res.status(500).json({
            "meta": {
                "success": false,
                "message": `Internal server error ${error}`
            },
            "data": null,
        })
        console.log("Error", error)
    }
};


async function messageTemplates(req, res){
    try {
        const queryString = req.query;
        if (!queryString.subjectTitle) {
            return res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `templated can be get by the subjectTitle`
                },
                "data": {},
            })
        }
       
       

        const selectedTemplates = templatesData.find((_template) =>  _template.category.toLowerCase() === queryString.subjectTitle.toLowerCase())
        if (selectedTemplates) {
            return res.status(201).json({
                "meta": {
                    "success": true,
                    "message": `Subjects successfully filtered from the Database`
                },
                "data": selectedTemplates,
            })
        }

    } catch (error) {
        return res.status(500).json({
            "meta": {
                "success": false,
                "message": `Internal server error ${error}`
            },
            "data": null,
        })
        console.log("Error", error)
    }
}

async function messageSelectedTemplateSelectionOptions(req, res){
    try {
        const queryString = req.query;
        if (!queryString.subjectTitle) {
            return res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `Options can be get by the subjectTitle`
                },
                "data": {},
            })
        }

        const selectedOption = selectionOptions.find((_option) => _option.category.toLowerCase() === queryString.subjectTitle.toLowerCase());
        if (selectedOption) {
            return res.status(201).json({
                "meta": {
                    "success": true,
                    "message": `Options successfully filtered from the Database`
                },
                "data": selectedOption,
            })
        }

    } catch (error) {
        return res.status(500).json({
            "meta": {
                "success": false,
                "message": `Internal server error ${error}`
            },
            "data": null,
        })
        console.log("Error", error)
    }
}

async function getAllMessage(req, res){
    try {
        const mongo = req.app.get('db');
       
        const messages = await mongo.collection('message').find().toArray();

        if (!messages) {
            return res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `unable to get message details from Database`
                },
                "data": null,
            })
        } else {
            return res.status(201).json({
                "meta": {
                    "success": true,
                    "message": `Message successfully get from the Database`
                },
                "data": messages,
            })
        }

    } catch (error) {
        return res.status(500).json({
            "meta": {
                "success": false,
                "message": `Internal server error ${error}`
            },
            "data": null,
        })
    }
}

async function getMessage(req, res){
    try {
        const mongo = req.app.get('db');
        const { messageId } = req.params;

        const message = await mongo.collection('message').findOne({ _id: new ObjectId(messageId)});

        if (!message) {
            return res.status(400).json({
                "meta": {
                    "success": false,
                    "message": `unable to get message details from Database`
                },
                "data": null,
            })
        } else {
            return res.status(201).json({
                "meta": {
                    "success": true,
                    "message": `Message successfully get from the Database`
                },
                "data": message,
            })
        }

    } catch (error) {
        return res.status(500).json({
            "meta": {
                "success": false,
                "message": `Internal server error ${error}`
            },
            "data": null,
        })
    } 
}

module.exports = {
    searchAutoCompleteSubject,
    addMessage,
    messageTemplates,
    messageSelectedTemplateSelectionOptions,
    getAllMessage,
    getMessage
}
