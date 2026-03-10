
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    const fields = [
      {
        input: '#mentoringSubject',
        type: 'select',
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

    // 제출 시 유효성 검사
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // 모든 에러 초기화
      document.querySelectorAll('.error').forEach(a => a.style.display = 'none');

      let isValid = true;
      let firstInvalidEl = null;

      fields.forEach(({ input, type, getError }) => {
        const inputEl = document.querySelector(input);
        if (!inputEl) return;

        const isEmpty = type === 'select'
          ? !inputEl.value || inputEl.value === 'none'
          : !inputEl.value.trim();

        if (isEmpty) {
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

      // ✅ 유효성 통과 - 값을 sessionStorage에 저장
      const data = {};
      fields.forEach(({ input, type, key }) => {
        const inputEl = document.querySelector(input);
        if (!inputEl) return;
        // select는 선택된 option의 text(표시명)도 함께 저장
        if (type === 'select') {
          const selectedOption = inputEl.options[inputEl.selectedIndex];
          data[key] = selectedOption ? selectedOption.text : inputEl.value;
        } else {
          data[key] = inputEl.value.trim();
        }
      });

      // 파일명 저장
      const fileInput = document.querySelector('#curriculumFile');
      if (fileInput && fileInput.files.length > 0) {
        data['curriculumFileName'] = fileInput.files[0].name;
      } else {
        data['curriculumFileName'] = '';
      }

      sessionStorage.setItem('mentoringData', JSON.stringify(data));

      // 조회 페이지로 이동
      window.location.href = '/html/user/mentor/myPage/userMentoCreate/mentoringView.html';
    });
  });
})();