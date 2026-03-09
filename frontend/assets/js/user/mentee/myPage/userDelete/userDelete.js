document.addEventListener("DOMContentLoaded", () => {
    const deleteForm = document.getElementById("delete");
    const userId = document.getElementById("userId");
    const userPw = document.getElementById("userPw");
    const userPhone = document.getElementById("userPhone");
    const authCode = document.getElementById("authCode");
    const submitBtn = document.getElementById("submitBtn");
    
    const loginError = document.getElementById("login-error");
    const authError = document.getElementById("auth-error");
    const verifyBtn = document.getElementById("verifySms");

    // 테스트용 데이터
    const TEST_ID = "test";
    const TEST_PW = "1234";
    const TEST_AUTH = "12345";

    let isAuthVerified = false; // 인증 성공 여부

    // 모든 입력 필드와 인증 여부를 확인하여 버튼 활성화
    const validateForm = () => {
        const allFilled = userId.value.trim() !== "" && 
                          userPw.value.trim() !== "" && 
                          userPhone.value.trim() !== "" && 
                          authCode.value.trim() !== "";
        
        submitBtn.disabled = !(allFilled && isAuthVerified);
    };

    // 실시간 입력 감지
    [userId, userPw, userPhone, authCode].forEach(input => {
        input.addEventListener("input", validateForm);
    });

    // 인증 확인 버튼 클릭
    verifyBtn.addEventListener("click", () => {
        if (authCode.value === TEST_AUTH) {
            authError.textContent = ""; // 메시지 삭제
            isAuthVerified = true;
            alert("인증에 성공하였습니다.");
            authCode.readOnly = true; // 인증 성공 시 수정 불가 처리 (선택사항)
        } else {
            authError.textContent = "인증번호가 일치하지 않습니다.";
            isAuthVerified = false;
        }
        validateForm();
    });

    // 탈퇴 신청 버튼 클릭 (최종 제출)
    deleteForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // 아이디 및 비밀번호 검증
        if (userId.value === TEST_ID && userPw.value === TEST_PW) {
            loginError.textContent = "";
            if(confirm("정말로 탈퇴하시겠습니까?")) {
                alert("탈퇴 신청이 완료되었습니다.");
                // 실제 탈퇴 로직(서버 전송 등) 실행
            }
        } else {
            loginError.textContent = "정보가 맞지 않습니다. 다시 확인해주세요.";
        }
    });
});