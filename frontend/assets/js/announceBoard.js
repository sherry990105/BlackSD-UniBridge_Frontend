document.addEventListener("DOMContentLoaded", function () {
  // 1. 헤더 가져오기
  fetch('./header/header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('headerContainer').innerHTML = data;
    })
    .catch(error => console.error('헤더를 불러오는 중 오류 발생:', error));

  // 2. 푸터 가져오기
  fetch('./footer/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footerContainer').innerHTML = data;
    })
    .catch(error => console.error('푸터를 불러오는 중 오류 발생:', error));

  // 3. 페이지네이션
  const pageBtns = document.querySelectorAll('.announcePageBtn');
  pageBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('announcePageNext')) return;
      pageBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      // loadAnnouncePage(btn.dataset.page);
    });
  });

  // 4. 행 클릭 → 상세 페이지 이동
  const announceRows = document.querySelectorAll('.announceRow');
  announceRows.forEach((row) => {
    row.addEventListener('click', () => {
      const announceId = row.dataset.announceId;
      if (announceId) {
        window.location.href = `./announceBoardDetail.html?announceId=${announceId}`;
      }
    });
  });
});