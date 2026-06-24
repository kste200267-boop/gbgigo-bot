/* =====================================================================
   neis.js — 나이스(NEIS) 교육정보 API로 경북기계금속고 급식 가져오기
   (회원님의 학교 통합시스템 코드 기반으로 챗봇용으로 정리)
   ===================================================================== */
window.Neis = (function () {
  var KEY = '090d1bde6d4d4e44a10ab8b7c1e43b39';
  var BASE = 'https://open.neis.go.kr/hub';
  var OFFICE = 'R10';                 // 경북교육청
  var SCHOOL_CODE = '8750667';        // 경북기계금속고등학교 (자동조회 캐시값)
  var SCHOOL_NAME = '경북기계금속고등학교';

  function pad(n) { return String(n).padStart(2, '0'); }
  function ymd(d) { return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()); }
  function cleanMenu(s) {
    return (s || '')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/\d+\.\d+|\d+/g, '')   // 알레르기 숫자 제거
      .replace(/[().]/g, '')
      .split('\n').map(function (x) { return x.trim(); }).filter(Boolean).join('\n');
  }

  // 기간 급식 조회 → Promise<[{date,type,menu}]>
  function getMeals(fromYmd, toYmd) {
    var url = BASE + '/mealServiceDietInfo?KEY=' + KEY + '&Type=json&pIndex=1&pSize=100'
      + '&ATPT_OFCDC_SC_CODE=' + OFFICE + '&SD_SCHUL_CODE=' + SCHOOL_CODE
      + '&MLSV_FROM_YMD=' + fromYmd + '&MLSV_TO_YMD=' + toYmd;
    return fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      try {
        return data.mealServiceDietInfo[1].row.map(function (r) {
          return { date: r.MLSV_YMD, type: r.MMEAL_SC_NM, menu: cleanMenu(r.DDISH_NM) };
        });
      } catch (e) { return []; }
    }).catch(function () { return []; });
  }

  // 오늘 기준 가장 가까운 급식일의 급식(조/중/석) → Promise<{dateLabel, meals:[{type,menu}]}|null>
  function getNextMeal() {
    var today = new Date();
    var to = new Date(); to.setDate(to.getDate() + 6);   // 오늘~6일 뒤
    return getMeals(ymd(today), ymd(to)).then(function (rows) {
      if (!rows.length) return null;
      // 가장 빠른 날짜 선택
      rows.sort(function (a, b) { return a.date.localeCompare(b.date); });
      var firstDate = rows[0].date;
      var meals = rows.filter(function (r) { return r.date === firstDate; });
      // 조식<중식<석식 순 정렬
      var order = { '조식': 0, '중식': 1, '석식': 2 };
      meals.sort(function (a, b) { return (order[a.type] || 9) - (order[b.type] || 9); });
      var y = firstDate.slice(0, 4), m = firstDate.slice(4, 6), d = firstDate.slice(6, 8);
      var isToday = firstDate === ymd(today);
      return { dateLabel: (isToday ? '오늘' : (m + '/' + d)) + ' (' + m + '/' + d + ')', meals: meals };
    });
  }

  return { getMeals: getMeals, getNextMeal: getNextMeal, ymd: ymd };
})();
