const axios = require('axios');
const cheerio = require('cheerio');

// 모든 이벤트 검색
exports.eventCrawling = async (req, res) => {
    try {
        let totalPages = 10;
        let events = [];

        for (let page = 1; page <= totalPages; page++) {
            const url = `https://www.mcst.go.kr/kor/s_culture/festival/festivalList.jsp?pSeq=&pRo=&pCurrentPage=${page}&pOrder=01up&pPeriod=&fromDt=&toDt=&pSido=&pSearchType=01&pSearchWord=#searchOrder`;

            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const $bodyList = $('ul.mediaWrap.color01').children('li');

            $bodyList.each(function (i, elem) {
                const imgSrc = $(this).find('img').attr('src');
                const fullImgSrc = `https://www.mcst.go.kr${imgSrc}`;

                events.push({
                    title: $(this).find('div.text > p').text(),
                    location: $(this).find('ul.detail_info li:nth-child(1)').text(),
                    period: $(this).find('ul.detail_info li:nth-child(2)').text(),
                    picture: fullImgSrc
                });
            });
        }

        const data = events.filter(event => event.title);

        if (data.length === 0) {
            return res.json({ error: '행사 데이터 크롤링 실패 혹은 데이터가 없습니다.' });
        }
        console.log('이벤트크롤링 데이터보냄', data);
        res.json({ events: data });
    } catch (error) {
        console.error('크롤링 에러:', error);
        res.status(500).json({ error: '서버 에러' });
    }
};
