const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({   // 회원 계정 테이블
  name: { type: String, require: true },
  Id: { type: String, require: true },
  password: { type: String, require: true },
  location: { type: String, require: false },
  register_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema); //소문자화 후 복수형으로 바꾸어 devices 컬렉션이 됨