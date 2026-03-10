class MentorPagination {
  constructor({ totalMentors, mentorsPerPage = 10, pagesPerGroup = 10 }) {
    this.totalMentors = totalMentors;
    this.mentorsPerPage = mentorsPerPage;
    this.pagesPerGroup = pagesPerGroup;

    this.totalPages = Math.ceil(totalMentors / mentorsPerPage);
    this.currentPage = 1;
    this.currentGroup = 1; // 현재 페이지 그룹 (10개 단위)

    this.pageNumberContainer = document.querySelector('#pageNumber ul');
    this.leftBtn = document.getElementById('left');
    this.rightBtn = document.getElementById('right');

    this._init();
  }

  /* ── 초기화 ── */
  _init() {
    this._render();
    this._bindArrows();
  }

  /* ── 현재 그룹의 시작/끝 페이지 계산 ── */
  _groupRange() {
    const start = (this.currentGroup - 1) * this.pagesPerGroup + 1;
    const end = Math.min(start + this.pagesPerGroup - 1, this.totalPages);
    return { start, end };
  }

  /* ── 총 그룹 수 ── */
  get totalGroups() {
    return Math.ceil(this.totalPages / this.pagesPerGroup);
  }

  /* ── 페이지 번호 렌더링 ── */
  _render() {
    const { start, end } = this._groupRange();

    // 화살표 요소 미리 저장 (remove 후 재삽입)
    const leftLi = this.leftBtn.parentElement || this._createArrow('left', '&lt;');
    const rightLi = this.rightBtn.parentElement || this._createArrow('right', '&gt;');

    // ul 초기화
    this.pageNumberContainer.innerHTML = '';

    // 왼쪽 화살표 (첫 페이지이면 숨김)
    const leftEl = this._buildArrow('left', '&lt;');
    leftEl.style.display = this.currentPage === 1 ? 'none' : 'inline-block';
    this.leftBtn = leftEl;
    this.pageNumberContainer.appendChild(leftEl);

    // 페이지 번호
    for (let i = start; i <= end; i++) {
      const li = document.createElement('li');
      li.textContent = i;
      if (i === this.currentPage) li.id = 'nowPage';
      li.addEventListener('click', () => this._goTo(i));
      this.pageNumberContainer.appendChild(li);
    }

    // 오른쪽 화살표 (마지막 페이지이면 숨김)
    const rightEl = this._buildArrow('right', '&gt;');
    rightEl.style.display = this.currentPage === this.totalPages ? 'none' : 'inline-block';
    this.rightBtn = rightEl;
    this.pageNumberContainer.appendChild(rightEl);

    // 화살표 이벤트 재바인딩
    this._bindArrows();

    // 콘텐츠 업데이트 (외부 콜백 호출)
    if (typeof this.onPageChange === 'function') {
      this.onPageChange(this.currentPage);
    }
  }

  /* ── 화살표 li 생성 ── */
  _buildArrow(id, html) {
    const li = document.createElement('li');
    li.id = id;
    li.innerHTML = html;
    return li;
  }

  /* ── 화살표 이벤트 바인딩 ── */
  _bindArrows() {
    if (this.leftBtn) {
      this.leftBtn.onclick = () => this._prevGroup();
    }
    if (this.rightBtn) {
      this.rightBtn.onclick = () => this._nextGroup();
    }
  }

  /* ── 특정 페이지로 이동 ── */
  _goTo(page) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.currentGroup = Math.ceil(page / this.pagesPerGroup);
    this._render();
  }

  /* ── 이전 그룹 (왼쪽 화살표) ── */
  _prevGroup() {
    if (this.currentGroup <= 1) return;
    this.currentGroup--;
    // 이전 그룹의 마지막 페이지로 이동
    const { end } = this._groupRange();
    this.currentPage = end;
    this._render();
  }

  /* ── 다음 그룹 (오른쪽 화살표) ── */
  _nextGroup() {
    if (this.currentGroup >= this.totalGroups) return;
    this.currentGroup++;
    // 다음 그룹의 첫 번째 페이지로 이동
    const { start } = this._groupRange();
    this.currentPage = start;
    this._render();
  }

  /* ── 총 멘토 수 업데이트 (동적 데이터 로드 시 사용) ── */
  update(totalMentors) {
    this.totalMentors = totalMentors;
    this.totalPages = Math.ceil(totalMentors / this.mentorsPerPage);
    this.currentPage = 1;
    this.currentGroup = 1;
    this._render();
  }
}

/* ════════════════════════════════════════
   실제 멘토 카드 렌더링 예시
   (실제 프로젝트에서는 API 데이터로 교체)
════════════════════════════════════════ */

// 더미 멘토 데이터 (실제 환경에서는 서버 API로 대체)
const DUMMY_MENTORS = Array.from({ length: 47 }, (_, i) => ({
  id: i + 1,
  name: `멘토${i + 1}`,
  subject: ['국어', '영어', '수학', 'C언어', 'Java', 'Python'][i % 6],
  purpose: '멘토링 목적 설명입니다. 함께 성장해요!',
  university: '코딩대학교',
  major: '컴퓨터공학과',
  date: '2026.03.10(화)',
  img: '/frontend/assets/img/user/userProfile/ex1.png',
}));

/**
 * 멘토 카드 HTML 생성
 */
function createMentoCard(mentor) {
  return `
    <div class="mentoInfo">
      <div class="mentoName">${mentor.name}</div>
      <div class="mentoCard">
        <div class="mentoCardHead">
          <div class="mentoSubject">${mentor.subject}</div>
          <div class="mentoCardMain">
            <div class="mentoFront">
              <img src="${mentor.img}" alt="멘토 사진">
              <button type="button" class="matching" data-id="${mentor.id}">매칭</button>
            </div>
            <div class="mentoBack">
              <div class="mentoringPurpose">${mentor.purpose}</div>
              <div>
                <div class="mentoUniSchool">대학교 : ${mentor.university}</div>
                <div class="mentoMajor">학과 : ${mentor.major}</div>
              </div>
              <div class="mentoringDay">${mentor.date}</div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

/**
 * 페이지에 해당하는 멘토 목록 렌더링
 */
function renderMentors(page, mentorsPerPage = 10) {
  const contentsEl = document.querySelector('.contents');
  contentsEl.innerHTML = ''; // 초기화

  const start = (page - 1) * mentorsPerPage;
  const end = Math.min(start + mentorsPerPage, DUMMY_MENTORS.length);
  const pageData = DUMMY_MENTORS.slice(start, end);

  // 2열 레이아웃: mentoList 행마다 2개씩
  for (let i = 0; i < pageData.length; i += 2) {
    const row = document.createElement('div');
    row.className = 'mentoList';
    row.innerHTML = createMentoCard(pageData[i]);
    if (pageData[i + 1]) row.innerHTML += createMentoCard(pageData[i + 1]);
    contentsEl.appendChild(row);
  }


//매칭 버튼에 대한 이벤트
const mentoInfo = document.querySelectorAll(".mentoInfo")
const matching = document.querySelectorAll(".matching");

mentoInfo.forEach((mentoInfo,index)=>{

matching[index].addEventListener("click", () => {
  
  location.href = "/frontend/html/user/mentorSearch/mentorDetail/MentorDetail.html";
})
})


}

/* ── DOM 준비 후 실행 ── */
document.addEventListener('DOMContentLoaded', () => {
  const pagination = new MentorPagination({
    totalMentors: DUMMY_MENTORS.length, // 실제 환경: API 응답값으로 교체
    mentorsPerPage: 10,
    pagesPerGroup: 10,
  });

  // 페이지 변경 시 멘토 목록 갱신
  pagination.onPageChange = (page) => {
    renderMentors(page, 10);
  };

  // 초기 렌더링
  renderMentors(1, 10);
});