(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const raw = sessionStorage.getItem('mentoringData');

    if (!raw) {
      alert('멘토링 정보가 없습니다. 조회 페이지로 이동합니다.');
      window.location.href = '/html/user/mentor/myPage/userMentoCreate/mentoringView.html';
      return;
    }

    const data = JSON.parse(raw);

    // 기존 값을 각 필드에 채우기
    const set = (id, value) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        el.value = value;
      }
    };

    set('mentoringSubject',    data.mentoringSubject    || '');
    set('mentoringTitle',      data.mentoringTitle      || '');
    set('mentoringPurpose',    data.mentoringPurpose    || '');
    set('mentoringCurriculum', data.mentoringCurriculum || '');

    const fields = [
      {
        input: '#mentoringSubject',
        type: 'text',
        key: 'mentoringSubject',
        getError: () => document.querySelector('#mentoringSubject ~ .error'),
      },
      {
        input: '#mentoringTitle',
        type: 'text',
        key: 'mentoringTitle',
        getError: () => document.querySelector('#mentoringTitle ~ .error'),
      },
      {
        input: '#mentoringPurpose',
        type: 'textarea',
        key: 'mentoringPurpose',
        getError: () => document.querySelector('#mentoringPurpose ~ .error'),
      },
      {
        input: '#mentoringCurriculum',
        type: 'textarea',
        key: 'mentoringCurriculum',
        getError: () => document.querySelector('label[for="mentoringCurriculum"] ~ .error'),
      },
    ];

    const form = document.querySelector('form');

    // 확인(submit) 버튼 - 유효성 검사 후 저장 & 조회 페이지로 이동
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      document.querySelectorAll('.error').forEach(el => el.style.display = 'none');

      let isValid = true;
      let firstInvalidEl = null;

      fields.forEach(({ input, getError }) => {
        const inputEl = document.querySelector(input);
        if (!inputEl) return;

        if (!inputEl.value.trim()) {
          const errorEl = getError();
          if (errorEl) errorEl.style.display = 'inline';
          isValid = false;
          if (!firstInvalidEl) firstInvalidEl = inputEl;
        }
      });

      if (!isValid) {
        firstInvalidEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalidEl.focus();
        return;
      }

      // 수정된 값 sessionStorage에 저장
      const updated = {};
      fields.forEach(({ input, key }) => {
        const inputEl = document.querySelector(input);
        if (inputEl) updated[key] = inputEl.value.trim();
      });

      // 파일이 새로 선택됐으면 교체, 아니면 기존 유지
      const fileInput = document.querySelector('#curriculumFile');
      if (fileInput && fileInput.files.length > 0) {
        updated['curriculumFileName'] = fileInput.files[0].name;
      } else {
        updated['curriculumFileName'] = data.curriculumFileName || '';
      }

      sessionStorage.setItem('mentoringData', JSON.stringify(updated));

      // 조회 페이지로 이동
      window.location.href = '/html/user/mentor/myPage/userMentoCreate/mentoringView.html';
    });

    // 취소 버튼 - 저장 없이 조회 페이지로 이동
    const cancelBtn = document.querySelector('button[type="button"]');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        window.location.href = '/html/user/mentor/myPage/userMentoCreate/mentoringView.html';
      });
    }
  });
})();