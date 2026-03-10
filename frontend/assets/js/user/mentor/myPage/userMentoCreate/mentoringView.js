(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const raw = sessionStorage.getItem('mentoringData');

    if (!raw) {
      // 데이터 없으면 생성 페이지로 되돌아가기
      alert('멘토링 정보가 없습니다. 생성 페이지로 이동합니다.');
      window.location.href = '/html/user/mentor/myPage/userMentoCreate/mentoringCreate.html';
      return;
    }

    const data = JSON.parse(raw);

    // 각 필드에 값 출력
    const set = (id, value) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        el.value = value;
      } else {
        el.textContent = value;
      }
    };

    set('mentoringSubject', data.mentoringSubject || '');
    set('mentoringTitle',   data.mentoringTitle   || '');
    set('mentoringPurpose', data.mentoringPurpose || '');
    set('mentoringCurriculum', data.mentoringCurriculum || '');
    set('curriculumFile',   data.curriculumFileName || '첨부 파일 없음');

    // 삭제 버튼: sessionStorage 비우고 생성 페이지로 이동
    const deleteBtn = document.querySelector('button[type="button"]');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function () {
        if (confirm('멘토링을 삭제하시겠습니까?')) {
          sessionStorage.removeItem('mentoringData');
          window.location.href = '/html/user/mentor/myPage/userMentoCreate/mentoringCreate.html';
        }
      });
    }

    // 수정 버튼: 수정 페이지로 이동 (기존 데이터는 sessionStorage에 유지)
    const editBtn = document.querySelector('button[type="submit"]');
    if (editBtn) {
      editBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = '/html/user/mentor/myPage/userMentoCreate/mentoringModify.html';
      });
    }
  });
})();