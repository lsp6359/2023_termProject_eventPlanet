const userData = require('./user.model.js');

// 새로운 계정 만들기
exports.create = (req, res) => {
  const user = new userData({
    name: req.body.name,
    Id: req.body.Id,
    password: req.body.password,
    location: req.body.location
  });
  console.log("유저 데이터 생성 완료");
  console.log(user)
  //데이터베이스에 새로운 연락처 저장하기 
  user.save()
    .then(data => { res.send(data); 
      console.log('디버그');
    })
    .catch(err => {
      console.log(err);
      //res.status(500).send({ message: err.message });
    });
};


//모든 계정 조회
exports.findAll = (req, res) => {
  userData.find()
    .then(samples => {
      res.send(samples);
      console.log(samples)	//test log
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

//특정 아이디 계정 검색
exports.findOne = (req, res) => {
  userData.find({ Id: req.params.Id })
    .then(samples => {
      if (!samples) {
        return res.status(404).send({
          message: req.params.Id + "에 해당하는 계정이 없습니다."
        });
      }
      res.send(samples);
    }).catch(err => {
      return res.status(500).send({ message: req.params.Id + " 로 검색 중 에러 발생" });
    });
};

//업데이트
exports.update = (req, res) => {
  userData.findOneAndUpdate({ Id: req.params.Id },
    { name: req.body.name, 
      Id: req.body.Id, 
      password: req.body.password, 
      location: req.body.location,
    },
    { new: true }
  )
    .then(contact => {
      if (!contact) {
        return res.status(404).send({
          message: req.params.Id +
            "에 해당하는 계정이 발견되지 않았습니다."
        })
      }
      res.send(contact);
    }).catch(err => {
      return res.status(500).send({ message: err.message });
    });
};

//삭제
exports.delete = (req, res) => {
  userData.findOneAndDelete({ Id: req.params.Id })
    .then(contact => {
      if (!contact) {
        return res.status(404).send({ message: req.params.Id + "에 해당하는 계정이 없습니다." })
      }
      res.send({ message: "정상적으로 " + req.params.Id + " 계정이 삭제되었습니다." })
    })
    .catch(err => {
      return res.status(500).send({ message: err.message });
    });
};