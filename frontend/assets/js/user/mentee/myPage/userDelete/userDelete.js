// 실제 서버 검증 대신 임시 더미 데이터
const VALID_ID = "hongdong11";
const VALID_PW = "password123";
const VALID_PHONE_CODE = "123456"; // 실제 환경에선 서버에서 발급

let idPassed       = false;
let pwPassed       = false;
let phoneSent      = false;
let codeVerified   = false;

// ── 헬퍼 ──
function showError(errorEl, msg) {
    errorEl.textContent = msg;
    updateDeleteBtn();
}

function clearError(errorEl) {
    errorEl.textContent = "";
    updateDeleteBtn();
}

function setBtn(btn, enabled) {
    if (!btn) return;
    btn.disabled      = !enabled;
    btn.style.opacity = enabled ? "1" : "0.5";
    btn.style.cursor  = enabled ? "pointer" : "not-allowed";
}

function updateDeleteBtn() {
    const deleteBtn = document.querySelector(".userDelete");
    const canSubmit = idPassed && pwPassed && codeVerified;
    setBtn(deleteBtn, canSubmit);
}

document.addEventListener("DOMContentLoaded", () => {

    const inputId    = document.getElementById("inputId");
    const inputPw    = document.getElementById("inputPw");
    const inputPhone = document.getElementById("inputPhone");
    const inputCode  = document.getElementById("inputCode");
    const sendBtn    = document.getElementById("sendBtn");
    const verifyBtn  = document.getElementById("verifyBtn");
    const deleteBtn  = document.querySelector(".userDelete");

    const idError    = document.getElementById("idError");
    const pwError    = document.getElementById("pwError");
    const phoneError = document.getElementById("phoneError");
    const codeError  = document.getElementById("codeError");

    // 초기 버튼 비활성화
    setBtn(deleteBtn, false);
    setBtn(verifyBtn, false);

    // ── 아이디 입력 시 실시간 초기화 ──
    inputId.addEventListener("input", () => {
        idPassed = false;
        clearError(idError);
    });

    // ── 비밀번호 입력 시 실시간 초기화 ──
    inputPw.addEventListener("input", () => {
        pwPassed = false;
        clearError(pwError);
    });

    // ── 인증번호 전송 버튼 ──
    sendBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const phone = inputPhone.value.trim();
        const phoneRegex = /^01[016789]\d{7,8}$/;

        if (!phone) {
            showError(phoneError, "전화번호를 입력해주세요.");
            return;
        }
        if (!phoneRegex.test(phone)) {
            showError(phoneError, "올바른 전화번호 형식이 아닙니다.");
            return;
        }

        // 성공: 인증번호 전송 처리
        clearError(phoneError);
        phoneSent = true;
        setBtn(verifyBtn, true);
        showError(phoneError, ""); 
        phoneError.style.color = "blue";
        phoneError.textContent = "인증번호가 전송되었습니다.";
        setTimeout(() => {
            phoneError.textContent = "";
            phoneError.style.color = "red";
        }, 3000);
    });

    // ── 인증 확인 버튼 ──
    verifyBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!phoneSent) {
            showError(codeError, "먼저 인증번호를 전송해주세요.");
            return;
        }
        if (inputCode.value.trim() !== VALID_PHONE_CODE) {
            showError(codeError, "인증번호가 일치하지 않습니다.");
            codeVerified = false;
        } else {
            clearError(codeError);
            codeVerified = true;
        }
        updateDeleteBtn();
    });

    inputCode.addEventListener("input", () => {
        codeVerified = false;
        clearError(codeError);
    });

    // ── 탈퇴 신청 버튼 (제출 시 아이디/비밀번호 검증) ──
    deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        let valid = true;

        // 아이디 확인
        if (inputId.value.trim() !== VALID_ID) {
            showError(idError, "정보가 맞지 않습니다. 다시 확인해주세요.");
            idPassed = false;
            valid = false;
        } else {
            clearError(idError);
            idPassed = true;
        }

        // 비밀번호 확인
        if (inputPw.value !== VALID_PW) {
            showError(pwError, "정보가 맞지 않습니다. 다시 확인해주세요.");
            pwPassed = false;
            valid = false;
        } else {
            clearError(pwError);
            pwPassed = true;
        }

        updateDeleteBtn();

        if (valid && codeVerified) {
            // form.submit(); // 실제 제출 시 활성화
            alert("탈퇴 신청이 완료되었습니다.");
        }
    });
});