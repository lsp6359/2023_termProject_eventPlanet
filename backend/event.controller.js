const eventData = require('./event.model.js');

// 새로운 이벤트 만들기
exports.create = (req, res) => {
  $socket.emit('newEvent', {         //새로운 데이터가 업로드되면 소켓을 이용하여 클라이언트에 전달
    eventNum: req.body.eventNum,
    eventName: req.body.eventName,
    eventLocation: req.body.eventLocation,
    eventStartDay: req.body.eventStartDay,
    eventEndDay: req.body.eventEndDay,
    eventContent: req.body.eventContent
  });
  const contact = new eventData({
    eventNum: req.body.eventNum,
    eventName: req.body.eventName,
    eventLocation: req.body.eventLocation,
    eventStartDay: req.body.eventStartDay,
    eventEndDay: req.body.eventEndDay,
    eventContent: req.body.eventContent
  });

  //데이터베이스에 새로운 이벤트 저장하기 
  contact.save()
    .then(data => { res.send(data); })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};


//모든 이벤트 검색
exports.findAll = (req, res) => {
  eventData.find()
    .then(contacts => {
      res.send(contacts);
      console.log(contacts)	//test log
      $socket.emit('getDbTable', contacts);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

//특정한 이벤트 검색
exports.findOne = (req, res) => {
  eventData.find({ eventNum: req.params.eventNum })
    .then(contact => {
      if (!contact) {
        return res.status(404).send({
          message: req.params.eventNum + "에 해당하는 축제가 없습니다."
        });
      }
      res.send(contact);
    }).catch(err => {
      return res.status(500).send({ message: req.params.eventNum + " 로 검색 중 에러 발생" });
    });
};

//특정 이벤트 업데이트
exports.update = (req, res) => {
  eventData.findOneAndUpdate({ eventNum: req.params.eventNum },
    { eventNum: req.body.eventNum, eventName: req.body.eventName, eventLocation: req.body.eventLocation, eventStartDay: req.body.eventStartDay, eventEndDay: req.body.eventEndDay, eventContent: req.body.eventContent },
    { new: true }
  )
    .then(contact => {
      if (!contact) {
        return res.status(404).send({
          message: req.params.eventNum +
            "에 해당하는 축제가 없습니다."
        })
      }
      res.send(contact);
      $socket.emit('newEvent', {         //새로운 데이터가 업로드되면 소켓을 이용하여 클라이언트에 전달
        eventNum: req.body.eventNum,
        eventName: req.body.eventName,
        eventLocation: req.body.eventLocation,
        eventStartDay: req.body.eventStartDay,
        eventEndDay: req.body.eventEndDay,
        eventContent: req.body.eventContent
      });
    }).catch(err => {
      return res.status(500).send({ message: err.message });
    });
};

//특정 이벤트 삭제
exports.delete = (req, res) => {
  eventData.findOneAndDelete({ eventNum: req.params.eventNum })
    .then(contact => {
      if (!contact) {
        return res.status(404).send({ message: req.params.eventNum + "에 해당하는 축제가 없습니다." })
      }

      // 소켓을 사용하여 클라이언트에게 이벤트 삭제를 알림
      $socket.emit('deleteEvent', { eventNum: req.params.eventNum });

      res.send({ message: "정상적으로 " + req.params.eventNum + " 장치가 삭제되었습니다." })
    })
    .catch(err => {
      return res.status(500).send({ message: err.message });
    });
};
