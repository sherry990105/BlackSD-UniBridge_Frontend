// =============================================
// 회원탈퇴 폼 유효성 검사 및 오류 메시지 처리
// =============================================

// 각 input-group 아래에 오류 메시지 span을 동적으로 추가
function createErrorElements() {
  const inputGroups = document.querySelectorAll('.input-group');
  inputGroups.forEach(group => {
    // 이미 error span이 있으면 추가하지 않음
    if (!group.querySelector('.error-msg')) {
      const errorSpan = document.createElement('span');
      errorSpan.classList.add('error-msg');
      errorSpan.style.cssText = `
        display: none;
        color: red;
        font-size: 14px;
        font-weight: 600;
        margin-top: 4px;
        margin-left: 150px; /* label 너비만큼 들여쓰기 */
      `;
      // input-group 다음 형제로 삽입 (input-group 내부가 아닌 바로 아래)
      group.insertAdjacentElement('afterend', errorSpan);
    }
  });
}

// 특정 input-group에 오류 메시지 표시
function showError(inputGroup, message) {
  const errorSpan = inputGroup.nextElementSibling;
  if (errorSpan && errorSpan.classList.contains('error-msg')) {
    errorSpan.textContent = message;
    errorSpan.style.display = 'block';
  }
}

// 특정 input-group의 오류 메시지 숨기기
function clearError(inputGroup) {
  const errorSpan = inputGroup.nextElementSibling;
  if (errorSpan && errorSpan.classList.contains('error-msg')) {
    errorSpan.textContent = '';
    errorSpan.style.display = 'none';
  }
}

// 모든 오류 메시지 초기화
function clearAllErrors() {
  document.querySelectorAll('.error-msg').forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });
}

// =============================================
// 인증번호 전송 상태 관리
// =============================================
let isCodeSent = false;
let isCodeVerified = false;
const MOCK_CODE = '12345'; // 실제 서버 연동 시 교체

// =============================================
// 실시간 유효성 검사 (입력 시 오류 제거)
// =============================================
function attachRealtimeValidation() {
  const inputs = document.querySelectorAll('.userInput');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const group = input.closest('.input-group');
      clearError(group);
    });
  });
}

// =============================================
// 인증번호 전송 버튼
// =============================================
function handleSendCode() {
  const phoneGroup = document.querySelectorAll('.input-group')[2]; // 전화번호 group
  const phoneInput = phoneGroup.querySelector('input');
  const phoneValue = phoneInput.value.trim();

  clearError(phoneGroup);

  // 전화번호 형식 검사 (숫자만, 10~11자리)
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneValue) {
    showError(phoneGroup, '전화번호를 입력해주세요.');
    return;
  }
  if (!phoneRegex.test(phoneValue)) {
    showError(phoneGroup, '올바른 전화번호 형식으로 입력해주세요. (숫자만, 10~11자리)');
    return;
  }

  // 전송 성공 처리 (실제 서버 연동 시 API 호출)
  isCodeSent = true;
  isCodeVerified = false;
  alert('인증번호가 전송되었습니다. (테스트 코드: 12345)');
}

// =============================================
// 인증번호 확인 버튼
// =============================================
function handleVerifyCode() {
  const codeGroup = document.querySelectorAll('.input-group')[3]; // 인증번호 group
  const codeInput = codeGroup.querySelector('input');
  const codeValue = codeInput.value.trim();

  clearError(codeGroup);

  if (!isCodeSent) {
    showError(codeGroup, '먼저 인증번호를 전송해주세요.');
    return;
  }
  if (!codeValue) {
    showError(codeGroup, '인증번호를 입력해주세요.');
    return;
  }
  if (codeValue !== MOCK_CODE) {
    showError(codeGroup, '인증번호가 일치하지 않습니다.');
    isCodeVerified = false;
    return;
  }

  isCodeVerified = true;
  alert('인증이 완료되었습니다.');
}

// =============================================
// 폼 제출 유효성 검사
// =============================================
function handleFormSubmit(e) {
  e.preventDefault();
  clearAllErrors();

  const inputGroups = document.querySelectorAll('.input-group');
  const idGroup       = inputGroups[0];
  const pwGroup       = inputGroups[1];
  const phoneGroup    = inputGroups[2];
  const codeGroup     = inputGroups[3];

  const idValue    = idGroup.querySelector('input').value.trim();
  const pwValue    = pwGroup.querySelector('input').value.trim();
  const phoneValue = phoneGroup.querySelector('input').value.trim();
  const codeValue  = codeGroup.querySelector('input').value.trim();

  let hasError = false;

  // 아이디 검사
  if (!idValue) {
    showError(idGroup, '아이디를 입력해주세요.');
    hasError = true;
  }

  // 비밀번호 검사
  if (!pwValue) {
    showError(pwGroup, '비밀번호를 입력해주세요.');
    hasError = true;
  }

  // 전화번호 검사
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneValue) {
    showError(phoneGroup, '전화번호를 입력해주세요.');
    hasError = true;
  } else if (!phoneRegex.test(phoneValue)) {
    showError(phoneGroup, '올바른 전화번호 형식으로 입력해주세요.');
    hasError = true;
  }

  // 인증번호 검사
  if (!isCodeSent) {
    showError(codeGroup, '인증번호 전송 후 인증을 완료해주세요.');
    hasError = true;
  } else if (!isCodeVerified) {
    showError(codeGroup, '인증번호 확인을 완료해주세요.');
    hasError = true;
  }

  // 정보 불일치 오류 (서버 응답 시뮬레이션: 아이디/비밀번호 틀림)
  // 실제 서버 연동 시 아래 블록을 API 응답 처리로 교체하세요
  if (!hasError) {
    const MOCK_ID = 'test';
    const MOCK_PW = '1234';

    if (idValue !== MOCK_ID || pwValue !== MOCK_PW) {
      // 이미지처럼 아이디 그룹 위에 "정보가 맞지 않습니다" 표시
      showError(idGroup, '정보가 맞지 않습니다. 다시 확인해주세요.');
      return;
    }

    // 모든 검사 통과 → 탈퇴 처리
    if (confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      alert('탈퇴가 완료되었습니다.');
      // window.location.href = '/main.html'; // 실제 연동 시 활성화
    }
  }
}

// =============================================
// 초기화
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  // 오류 메시지 엘리먼트 생성
  createErrorElements();

  // 실시간 유효성 검사 연결
  attachRealtimeValidation();

  // 인증번호 전송 버튼
  const sendBtn = document.querySelectorAll('.duplication')[0];
  sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleSendCode();
  });

  // 인증 확인 버튼
  const verifyBtn = document.querySelectorAll('.duplication')[1];
  verifyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleVerifyCode();
  });

  // 폼 제출
  const form = document.getElementById('delete');
  form.addEventListener('submit', handleFormSubmit);
});