module.exports = (app) => {
  const events = require('./event.controller.js');  //contact.controller.js를 로딩
  const users = require('./user.controller.js');  //user.controller.js를 로딩
  const crawling = require('./EventCrawling.js');

  const authenticateUser = (req, res, next) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      console.log('인증 성공');
      next();
    } else {
      console.log('인증 실패');
      res.send({ code: 2 });
    }
  };

  app.get('/events', authenticateUser, events.findAll); //관리자페이지에서 볼 수 있음 이벤트 검색
  app.get('/userevents', events.findAll); // 사용자가 볼 수 있음
  app.get('/events/:eventNum', events.findOne);  //특정 이벤트 검색
  app.post('/events',authenticateUser, events.create); //새로운 이벤트 추가
  app.put('/events/:eventNum',authenticateUser, events.update);   //특정 이벤트 업데이트
  app.delete('/events/:eventNum',authenticateUser, events.delete); //특정 이벤트 삭제


  app.post('/users', users.create); //계정 추가
  app.get('/users',authenticateUser, users.findAll); //모든 계정 조회
  app.get('/users/:Id', users.findOne); //특정 계정 조회
  app.put('/users/:Id', users.update); //특정 계정 수정
  app.delete('/users/:Id', users.delete); //특정 계정 삭제

  app.get('/eventCrawling', crawling.eventCrawling); //크롤링한 데이터 res.send

}
