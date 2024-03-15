const mongoose = require('mongoose');

var EventSchema = mongoose.Schema({   //스키마(Schema) 설정
  eventNum: { type: Number, require: true, unique: true },
  eventName: { type: String, require: true },
  eventLocation: { type: String, require: true },
  eventStartDay: { type: Date, require: true },
  eventEndDay: { type: Date, require: true },
  eventContent: { type: String, require: true },
  register_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('event', EventSchema); //소문자화 후 복수형으로 바꾸어 컬렉션이 됨
