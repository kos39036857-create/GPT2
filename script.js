/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 우리 반 1인 1역할 배정 웹 애플리케이션 (script.js)
 * 순수 JavaScript로 동작하며 GitHub Pages에 바로 호스팅 가능합니다.
 */

// ============================================================================
// 1. 기본 예시 데이터 세팅 (학생 12명, 학급 역할 12개)
// ============================================================================

const DEFAULT_STUDENTS = [
  "김민준", "이서연", "박도윤", "최지우",
  "정하은", "강시우", "윤서아", "임예준",
  "한유진", "송지호", "오수아", "배건우"
];

const DEFAULT_ROLES = [
  {
    id: "role-1",
    name: "칠판 도우미",
    emoji: "🧹",
    duty: "수업 후 칠판을 깨끗이 지우고 분필 가루를 털어요.",
    theme: "theme-mint"
  },
  {
    id: "role-2",
    name: "급식 지도",
    emoji: "🍱",
    duty: "급식실에서 차례차례 줄을 서고 식탁을 깨끗이 닦아요.",
    theme: "theme-yellow"
  },
  {
    id: "role-3",
    name: "에너지 지킴이",
    emoji: "💡",
    duty: "교실을 비울 때 전등과 전자칠판 전원을 꺼요.",
    theme: "theme-blue"
  },
  {
    id: "role-4",
    name: "식물 사랑이",
    emoji: "🌱",
    duty: "학급 화분에 주기적으로 물을 주고 맑은 사랑을 전해요.",
    theme: "theme-mint"
  },
  {
    id: "role-5",
    name: "우유 도우미",
    emoji: "🥛",
    duty: "우유 상자를 정리하고 친구들에게 안전하게 나누어 줘요.",
    theme: "theme-coral"
  },
  {
    id: "role-6",
    name: "줄서기 반장",
    emoji: "🚶",
    duty: "이동 수업 때 친구들이 두 줄로 바르게 줄을 서도록 도와요.",
    theme: "theme-purple"
  },
  {
    id: "role-7",
    name: "환기 도우미",
    emoji: "🪟",
    duty: "쉬는 시간마다 창문을 열어 맑은 공기로 교실을 환기해요.",
    theme: "theme-blue"
  },
  {
    id: "role-8",
    name: "학급문고 도서관장",
    emoji: "📚",
    duty: "학급문고 책을 번호대로 가지런히 정리하고 책을 아껴요.",
    theme: "theme-pink"
  },
  {
    id: "role-9",
    name: "분리수거 환경지킴이",
    emoji: "♻️",
    duty: "종이, 플라스틱, 캔을 올바르게 분리수거하도록 도와요.",
    theme: "theme-mint"
  },
  {
    id: "role-10",
    name: "체육 활동 도우미",
    emoji: "⚽",
    duty: "체육 시간에 필요한 공과 기구를 챙기고 정리해요.",
    theme: "theme-yellow"
  },
  {
    id: "role-11",
    name: "방송 및 알림 도우미",
    emoji: "📢",
    duty: "학교 아침 방송을 집중해 듣고 중요한 알림을 전달해요.",
    theme: "theme-purple"
  },
  {
    id: "role-12",
    name: "시간 알리미",
    emoji: "⏰",
    duty: "수업 시작 1분 전에 친구들에게 자리에 앉도록 안내해요.",
    theme: "theme-coral"
  }
];

const THEME_CYCLE = ["theme-mint", "theme-yellow", "theme-blue", "theme-pink", "theme-purple", "theme-coral"];
const AVATAR_EMOJIS = ["⭐", "🌟", "🐥", "🐻", "🐰", "🦊", "🐼", "🍀", "🌈", "🎈", "🐱", "🐶"];

// ============================================================================
// 2. 애플리케이션 상태 (State) & 로컬 스토리지 연동
// ============================================================================

const STORAGE_KEY = "classroom_role_allocator_v1";

let state = {
  classTitle: "3학년 2반 우리들의 소중한 역할",
  students: [...DEFAULT_STUDENTS],
  roles: JSON.parse(JSON.stringify(DEFAULT_ROLES)),
  // assignments: Array<{ roleId: string, studentName: string }>
  assignments: [],
  isAssigned: false,
  soundEnabled: true,
  appsScriptUrl: ""
};

// 로컬 스토리지에서 복원
function loadStateFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.students && Array.isArray(parsed.students)) state.students = parsed.students;
      if (parsed.roles && Array.isArray(parsed.roles)) state.roles = parsed.roles;
      if (parsed.assignments && Array.isArray(parsed.assignments)) state.assignments = parsed.assignments;
      if (typeof parsed.isAssigned === "boolean") state.isAssigned = parsed.isAssigned;
      if (parsed.classTitle) state.classTitle = parsed.classTitle;
      if (parsed.appsScriptUrl) state.appsScriptUrl = parsed.appsScriptUrl;
    }
  } catch (e) {
    console.warn("로컬 저장소 데이터를 불러오는 중 오류:", e);
  }
}

// 로컬 스토리지에 저장
function saveStateToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("로컬 저장소 저장 실패:", e);
  }
}

// ============================================================================
// 3. UI 렌더링 함수들
// ============================================================================

// 배정 현황 카드 그리드 렌더링
function renderRoleCards() {
  const container = document.getElementById("roleCardsGrid");
  if (!container) return;
  container.innerHTML = "";

  const assignedMap = new Map();
  state.assignments.forEach(a => {
    assignedMap.set(a.roleId, a.studentName);
  });

  state.roles.forEach((role, idx) => {
    const studentName = assignedMap.get(role.id) || "";
    const card = document.createElement("div");
    const themeClass = role.theme || THEME_CYCLE[idx % THEME_CYCLE.length];
    card.className = `role-card ${themeClass}`;
    card.id = `card-${role.id}`;

    const avatarEmoji = AVATAR_EMOJIS[idx % AVATAR_EMOJIS.length];

    card.innerHTML = `
      <div>
        <div class="card-top">
          <div class="role-main-info">
            <div class="role-icon-box" title="${role.name}">
              ${role.emoji || "✨"}
            </div>
            <div class="role-titles">
              <span class="role-title-text">${escapeHtml(role.name)}</span>
            </div>
          </div>
          <span class="card-badge-num">#${idx + 1}</span>
        </div>
        <p class="role-duty-desc">${escapeHtml(role.duty || "친구들을 돕고 솔선수범해요.")}</p>
      </div>

      <div class="assigned-student-box ${studentName ? 'is-assigned' : ''}" id="studentBox-${role.id}">
        <div class="student-tag-left">
          <span class="student-avatar">${avatarEmoji}</span>
          <span class="student-name-text ${studentName ? '' : 'empty'}" id="studentName-${role.id}">
            ${studentName ? escapeHtml(studentName) : "배정 대기 중"}
          </span>
        </div>
        ${studentName ? `
          <button class="btn-card-swap" data-role-id="${role.id}" title="다른 학생으로 변경">
            교체
          </button>
        ` : ''}
      </div>
    `;

    container.appendChild(card);
  });

  // 카드 내 수동 교체 버튼 이벤트 바인딩
  container.querySelectorAll(".btn-card-swap").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const roleId = e.currentTarget.getAttribute("data-role-id");
      promptStudentSwap(roleId);
    });
  });

  updateHeaderStatus();
  updatePrintTable();
}

// 헤더 상태 배지 및 명단 수량 업데이트
function updateHeaderStatus() {
  const studentCount = state.students.length;
  const roleCount = state.roles.length;

  document.getElementById("studentCountBadge").textContent = studentCount;
  document.getElementById("roleCountBadge").textContent = roleCount;
  document.getElementById("studentPill").textContent = `${studentCount}명`;
  document.getElementById("rolePill").textContent = `${roleCount}개`;

  const matchStatus = document.getElementById("matchStatusBadge");
  if (studentCount === roleCount && studentCount > 0) {
    matchStatus.textContent = "✨ 1:1 완벽 매칭 가능";
    matchStatus.className = "status-tag tag-match";
  } else if (studentCount > roleCount) {
    matchStatus.textContent = `⚠️ 학생이 ${studentCount - roleCount}명 더 많음`;
    matchStatus.className = "status-tag tag-roles";
  } else {
    matchStatus.textContent = `⚠️ 역할이 ${roleCount - studentCount}개 더 많음`;
    matchStatus.className = "status-tag tag-students";
  }

  const assignedNotice = document.getElementById("assignedCountNotice");
  if (state.isAssigned && state.assignments.length > 0) {
    assignedNotice.textContent = `🎉 ${state.assignments.length}명 배정 완료!`;
    assignedNotice.className = "badge-assigned active";
  } else {
    assignedNotice.textContent = "배정 대기 중";
    assignedNotice.className = "badge-assigned";
  }
}

// 학생 칩 리스트 렌더링
function renderStudentChips() {
  const container = document.getElementById("studentChipsList");
  if (!container) return;
  container.innerHTML = "";

  if (state.students.length === 0) {
    container.innerHTML = `<span style="font-size: 0.85rem; color: #94a3b8; padding: 0.5rem;">등록된 학생이 없습니다. 상단에서 추가해 주세요.</span>`;
    return;
  }

  state.students.forEach((name, index) => {
    const chip = document.createElement("div");
    chip.className = "chip-student";
    chip.innerHTML = `
      <span class="chip-number">${index + 1}.</span>
      <span>${escapeHtml(name)}</span>
      <button type="button" class="chip-delete" data-index="${index}" title="${name} 삭제">&times;</button>
    `;
    container.appendChild(chip);
  });

  container.querySelectorAll(".chip-delete").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-index"), 10);
      removeStudent(idx);
    });
  });
}

// 역할 관리 리스트 렌더링
function renderRolesList() {
  const container = document.getElementById("rolesList");
  if (!container) return;
  container.innerHTML = "";

  if (state.roles.length === 0) {
    container.innerHTML = `<li style="font-size: 0.85rem; color: #94a3b8; padding: 0.5rem;">등록된 역할이 없습니다. 상단에서 추가해 주세요.</li>`;
    return;
  }

  state.roles.forEach((role, index) => {
    const li = document.createElement("li");
    li.className = "role-item-row";
    li.innerHTML = `
      <div class="role-item-left">
        <span class="role-item-emoji">${role.emoji || "✨"}</span>
        <span class="role-item-name">${index + 1}. ${escapeHtml(role.name)}</span>
        <span class="role-item-duty">(${escapeHtml(role.duty || "임무 없음")})</span>
      </div>
      <button type="button" class="btn-mini text-danger role-delete-btn" data-id="${role.id}" title="역할 삭제">삭제</button>
    `;
    container.appendChild(li);
  });

  container.querySelectorAll(".role-delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const roleId = e.currentTarget.getAttribute("data-id");
      removeRole(roleId);
    });
  });
}

// A4 인쇄용 테이블 렌더링
function updatePrintTable() {
  const tableBody = document.getElementById("printTableBody");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  const assignedMap = new Map();
  state.assignments.forEach(a => {
    assignedMap.set(a.roleId, a.studentName);
  });

  const now = new Date();
  const dateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
  document.getElementById("printDate").textContent = dateStr;
  document.getElementById("printStudentCount").textContent = `${state.students.length}명`;
  document.getElementById("printClassTitle").textContent = state.classTitle || "우리 반 1인 1역할 조직표";

  state.roles.forEach((role, idx) => {
    const student = assignedMap.get(role.id) || "(미배정)";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td class="print-role-cell">${role.emoji || ""} ${escapeHtml(role.name)}</td>
      <td class="print-student-cell">${escapeHtml(student)}</td>
      <td class="print-duty-cell">${escapeHtml(role.duty || "-")}</td>
      <td class="print-sign-box">인</td>
    `;
    tableBody.appendChild(tr);
  });
}

// ============================================================================
// 4. 무작위 배정 로직 (Fisher-Yates Shuffle & Slot Machine Roll)
// ============================================================================

// Fisher-Yates 셔플 알고리즘
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 역할 배정 실행 (애니메이션 포함)
function assignRolesWithAnimation() {
  if (state.students.length === 0) {
    showToast("⚠️ 학생 명단이 비어 있습니다. 먼저 학생을 추가해 주세요!", "⚠️");
    return;
  }
  if (state.roles.length === 0) {
    showToast("⚠️ 학급 역할이 비어 있습니다. 먼저 역할을 추가해 주세요!", "⚠️");
    return;
  }

  const assignBtn = document.getElementById("btnAssignRoles");
  assignBtn.classList.add("is-rolling");
  assignBtn.disabled = true;

  // 1. 공정 무작위 셔플 생성
  const shuffledStudents = shuffleArray(state.students);
  const newAssignments = [];

  const minCount = Math.min(state.roles.length, shuffledStudents.length);
  for (let i = 0; i < minCount; i++) {
    newAssignments.push({
      roleId: state.roles[i].id,
      studentName: shuffledStudents[i]
    });
  }

  // 남은 역할이 있는 경우(역할 > 학생) 빈 상태 처리
  if (state.roles.length > shuffledStudents.length) {
    for (let i = shuffledStudents.length; i < state.roles.length; i++) {
      newAssignments.push({
        roleId: state.roles[i].id,
        studentName: "(미배정)"
      });
    }
  }

  // 2. 롤링 룰렛 애니메이션 효과 (약 1.2초)
  const rollDuration = 1200;
  const rollInterval = 60;
  const startTime = Date.now();

  const nameElements = state.roles.map(r => document.getElementById(`studentName-${r.id}`));
  nameElements.forEach(el => {
    if (el) {
      el.classList.remove("empty");
      el.classList.add("rolling");
    }
  });

  const timer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    if (elapsed < rollDuration) {
      // 롤링 중 임의의 이름 표시
      nameElements.forEach(el => {
        if (el) {
          const randIndex = Math.floor(Math.random() * state.students.length);
          el.textContent = state.students[randIndex];
        }
      });
    } else {
      // 롤링 종료: 최종 배정 반영
      clearInterval(timer);
      state.assignments = newAssignments;
      state.isAssigned = true;
      saveStateToStorage();

      renderRoleCards();
      assignBtn.classList.remove("is-rolling");
      assignBtn.disabled = false;

      // 팡파레 축하 효과
      playChimeSound();
      triggerConfetti();
      showToast(`🎉 총 ${newAssignments.length}개의 1인 1역할이 멋지게 배정되었습니다!`, "🎲");
      
      const noticeText = document.getElementById("noticeText");
      if (noticeText) {
        noticeText.innerHTML = `<strong>배정 완료!</strong> 상단의 <strong>[🖨️ A4 게시판 인쇄]</strong>로 교실에 부착하거나 <strong>[💾 시트에 결과 저장]</strong>으로 동기화하세요.`;
      }
    }
  }, rollInterval);
}

// 수동 학생 교체 다이얼로그
function promptStudentSwap(roleId) {
  const role = state.roles.find(r => r.id === roleId);
  if (!role) return;

  const currentAssignment = state.assignments.find(a => a.roleId === roleId);
  const currentName = currentAssignment ? currentAssignment.studentName : "";

  const availableOptions = state.students.map(s => `${s}`).join(", ");
  const chosenName = prompt(
    `[${role.name}]의 담당 학생을 변경합니다.\n현재 담당: ${currentName || "미배정"}\n\n배정할 학생 이름을 입력하세요:\n(가능한 명단: ${availableOptions})`,
    currentName
  );

  if (chosenName && chosenName.trim()) {
    const trimmed = chosenName.trim();
    if (currentAssignment) {
      currentAssignment.studentName = trimmed;
    } else {
      state.assignments.push({ roleId: role.id, studentName: trimmed });
    }
    saveStateToStorage();
    renderRoleCards();
    showToast(`'${role.name}'의 담당이 '${trimmed}' 학생으로 변경되었습니다.`, "✏️");
  }
}

// ============================================================================
// 5. 학생 및 역할 명단 조작 (CRUD)
// ============================================================================

function addStudent(name) {
  const cleanName = name.trim();
  if (!cleanName) return;
  if (state.students.includes(cleanName)) {
    showToast(`이미 명단에 있는 이름입니다: ${cleanName}`, "⚠️");
    return;
  }
  state.students.push(cleanName);
  saveStateToStorage();
  renderStudentChips();
  updateHeaderStatus();
  showToast(`학생 '${cleanName}' 추가 완료!`, "👧");
}

function removeStudent(index) {
  const removed = state.students.splice(index, 1);
  saveStateToStorage();
  renderStudentChips();
  updateHeaderStatus();
  showToast(`'${removed[0]}' 학생이 명단에서 제외되었습니다.`, "🗑️");
}

function addRole(name, emoji, duty) {
  const cleanName = name.trim();
  if (!cleanName) return;

  const newId = `role-${Date.now()}`;
  const theme = THEME_CYCLE[state.roles.length % THEME_CYCLE.length];

  state.roles.push({
    id: newId,
    name: cleanName,
    emoji: emoji.trim() || "✨",
    duty: duty.trim() || "친구들을 돕고 솔선수범해요.",
    theme: theme
  });

  saveStateToStorage();
  renderRolesList();
  renderRoleCards();
  showToast(`새 역할 '${cleanName}' 추가 완료!`, "📋");
}

function removeRole(roleId) {
  state.roles = state.roles.filter(r => r.id !== roleId);
  state.assignments = state.assignments.filter(a => a.roleId !== roleId);
  saveStateToStorage();
  renderRolesList();
  renderRoleCards();
  showToast("역할이 삭제되었습니다.", "🗑️");
}

function resetToDefaultStudents() {
  if (confirm("학생 명단을 기본 12명 예시로 되돌리시겠습니까?")) {
    state.students = [...DEFAULT_STUDENTS];
    saveStateToStorage();
    renderStudentChips();
    updateHeaderStatus();
    showToast("학생 명단이 기본 12명으로 재설정되었습니다.", "🔄");
  }
}

function resetToDefaultRoles() {
  if (confirm("학급 역할을 기본 12개 예시로 되돌리시겠습니까?")) {
    state.roles = JSON.parse(JSON.stringify(DEFAULT_ROLES));
    state.assignments = [];
    state.isAssigned = false;
    saveStateToStorage();
    renderRolesList();
    renderRoleCards();
    showToast("학급 역할이 기본 12개로 재설정되었습니다.", "🔄");
  }
}

function clearAllStudents() {
  if (confirm("학생 명단을 모두 비우시겠습니까?")) {
    state.students = [];
    state.assignments = [];
    state.isAssigned = false;
    saveStateToStorage();
    renderStudentChips();
    renderRoleCards();
    showToast("학생 명단을 비웠습니다.", "🧹");
  }
}

function clearAllRoles() {
  if (confirm("모든 학급 역할을 삭제하시겠습니까?")) {
    state.roles = [];
    state.assignments = [];
    state.isAssigned = false;
    saveStateToStorage();
    renderRolesList();
    renderRoleCards();
    showToast("모든 역할을 삭제했습니다.", "🧹");
  }
}

function resetAssignmentOnly() {
  state.assignments = [];
  state.isAssigned = false;
  saveStateToStorage();
  renderRoleCards();
  showToast("배정 결과가 초기화되었습니다. 다시 배정해 보세요!", "🧹");
}

// ============================================================================
// 6. 구글 스프레드시트(Apps Script) 연동 모달 및 로직
// ============================================================================

function setupSheetIntegration() {
  const btnSheetLoad = document.getElementById("btnSheetLoad");
  const btnSheetSave = document.getElementById("btnSheetSave");
  const modalLoad = document.getElementById("sheetLoadModal");
  const modalSave = document.getElementById("sheetSaveModal");

  const inputGetUrl = document.getElementById("scriptGetUrl");
  const inputPostUrl = document.getElementById("scriptPostUrl");

  // 저장된 URL 복원
  if (state.appsScriptUrl) {
    if (inputGetUrl) inputGetUrl.value = state.appsScriptUrl;
    if (inputPostUrl) inputPostUrl.value = state.appsScriptUrl;
  }

  // 모달 열기
  btnSheetLoad.addEventListener("click", () => {
    modalLoad.classList.remove("hidden");
  });

  btnSheetSave.addEventListener("click", () => {
    updateSavePreview();
    modalSave.classList.remove("hidden");
  });

  // 모달 닫기 버튼들
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const targetId = e.currentTarget.getAttribute("data-close");
      const targetModal = document.getElementById(targetId);
      if (targetModal) targetModal.classList.add("hidden");
    });
  });

  // 배경 클릭시 닫기
  [modalLoad, modalSave].forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  });

  // [시트에서 실시간 불러오기] 버튼 클릭
  document.getElementById("btnFetchFromAppsScript").addEventListener("click", async () => {
    const url = inputGetUrl.value.trim();
    if (!url) {
      alert("Google Apps Script 웹 앱 URL을 먼저 입력해 주세요!");
      return;
    }

    state.appsScriptUrl = url;
    saveStateToStorage();
    showToast("구글 스프레드시트에서 데이터를 가져오는 중...", "🔄");

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP 상태 코드: ${response.status}`);
      const data = await response.json();

      // 스프레드시트 데이터 포맷 파싱
      // 기대 구조: 2D 배열 [[학생, 역할, 이모지, 하는일], ...] 또는 객체 배열
      if (Array.isArray(data)) {
        parseSheetData(data);
        modalLoad.classList.add("hidden");
        showToast("🎉 스프레드시트에서 학생 및 역할을 성공적으로 불러왔습니다!", "✅");
      } else {
        throw new Error("올바른 배열 데이터 형식이 아닙니다.");
      }
    } catch (err) {
      console.error(err);
      alert(`시트 데이터를 불러오지 못했습니다:\n${err.message}\n\n스프레드시트 배포 시 '웹 앱 액세스 권한: 모든 사용자(Anyone)'로 설정되었는지 확인해 주세요.`);
    }
  });

  // [기본 12명 예시 데이터 채우기] 버튼
  document.getElementById("btnLoadSampleData").addEventListener("click", () => {
    state.students = [...DEFAULT_STUDENTS];
    state.roles = JSON.parse(JSON.stringify(DEFAULT_ROLES));
    saveStateToStorage();
    renderStudentChips();
    renderRolesList();
    renderRoleCards();
    modalLoad.classList.add("hidden");
    showToast("기본 예시 데이터(12명/12역할)로 세팅되었습니다.", "🌱");
  });

  // [스프레드시트로 전송] 버튼 클릭
  document.getElementById("btnPostToAppsScript").addEventListener("click", async () => {
    const url = inputPostUrl.value.trim();
    if (!url) {
      alert("Google Apps Script 웹 앱 URL을 입력해 주세요!");
      return;
    }

    state.appsScriptUrl = url;
    saveStateToStorage();
    showToast("스프레드시트에 배정 결과를 기록 중...", "💾");

    const payload = generateExportData();

    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "no-cors", // Apps Script 웹앱 리다이렉션 특성상 no-cors가 일반적
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      modalSave.classList.add("hidden");
      showToast("🚀 스프레드시트로 배정 결과가 전송되었습니다!", "✅");
    } catch (err) {
      console.error(err);
      alert(`전송 중 오류가 발생했습니다: ${err.message}`);
    }
  });

  // [CSV 다운로드] 버튼 (모달 및 메인 화면)
  const downloadCSV = () => {
    const csvContent = generateCSV();
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.classTitle || "우리반"}_1인1역할_배정결과.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV 파일이 다운로드되었습니다.", "📥");
  };

  document.getElementById("btnDownloadCSVModal").addEventListener("click", downloadCSV);
  document.getElementById("btnExportCSV").addEventListener("click", downloadCSV);

  // [클립보드 복사] 버튼
  const copyTableToClipboard = () => {
    const text = generateTextSummary();
    navigator.clipboard.writeText(text).then(() => {
      showToast("배정 결과가 클립보드에 복사되었습니다! (시트에 붙여넣기 가능)", "📋");
    }).catch(err => {
      showToast("복사 실패: 수동으로 미리보기 텍스트를 복사해 주세요.", "⚠️");
    });
  };

  document.getElementById("btnCopyResultModal").addEventListener("click", copyTableToClipboard);
  document.getElementById("btnCopyResult").addEventListener("click", copyTableToClipboard);
}

// 스프레드시트 2D 배열 데이터 파싱 함수
function parseSheetData(rows) {
  const newStudents = new Set();
  const newRoles = [];

  rows.forEach((row, index) => {
    // 첫 행이 헤더인 경우 스킵
    if (index === 0 && (row[0] === "학생" || row[0] === "이름" || row[1] === "역할")) return;

    const student = (row[0] || "").toString().trim();
    const roleName = (row[1] || "").toString().trim();
    const emoji = (row[2] || "").toString().trim() || "✨";
    const duty = (row[3] || "").toString().trim();

    if (student) newStudents.add(student);
    if (roleName) {
      newRoles.push({
        id: `role-sheet-${index}`,
        name: roleName,
        emoji: emoji,
        duty: duty || "학급을 위해 봉사해요.",
        theme: THEME_CYCLE[newRoles.length % THEME_CYCLE.length]
      });
    }
  });

  if (newStudents.size > 0) state.students = Array.from(newStudents);
  if (newRoles.length > 0) state.roles = newRoles;

  state.assignments = [];
  state.isAssigned = false;
  saveStateToStorage();
  renderStudentChips();
  renderRolesList();
  renderRoleCards();
}

// 저장용 JSON 데이터 생성
function generateExportData() {
  const assignedMap = new Map();
  state.assignments.forEach(a => assignedMap.set(a.roleId, a.studentName));

  return {
    classTitle: state.classTitle,
    assignedAt: new Date().toISOString(),
    totalStudents: state.students.length,
    results: state.roles.map((r, idx) => ({
      index: idx + 1,
      roleName: r.name,
      emoji: r.emoji,
      duty: r.duty,
      studentName: assignedMap.get(r.id) || "미배정"
    }))
  };
}

// CSV 문자열 생성
function generateCSV() {
  const assignedMap = new Map();
  state.assignments.forEach(a => assignedMap.set(a.roleId, a.studentName));

  let csv = "번호,역할명,이모지,담당학생,주요역할및임무\n";
  state.roles.forEach((r, idx) => {
    const student = assignedMap.get(r.id) || "미배정";
    const cleanDuty = (r.duty || "").replace(/"/g, '""');
    csv += `${idx + 1},"${r.name}","${r.emoji}","${student}","${cleanDuty}"\n`;
  });
  return csv;
}

// 텍스트 요약본 생성
function generateTextSummary() {
  const assignedMap = new Map();
  state.assignments.forEach(a => assignedMap.set(a.roleId, a.studentName));

  let text = `[ ${state.classTitle} 1인 1역할 배정 결과 ]\n`;
  text += `배정일: ${new Date().toLocaleDateString("ko-KR")}\n`;
  text += "--------------------------------------\n";
  state.roles.forEach((r, idx) => {
    const student = assignedMap.get(r.id) || "미배정";
    text += `${idx + 1}. ${r.emoji} ${r.name} ➔ ${student} (${r.duty})\n`;
  });
  text += "--------------------------------------\n";
  return text;
}

function updateSavePreview() {
  const preview = document.getElementById("saveDataPreview");
  if (preview) {
    preview.value = generateTextSummary();
  }
}

// ============================================================================
// 7. 기타 편의 기능 (인쇄, 사운드, 축하 애니메이션)
// ============================================================================

// A4 교실 게시판 인쇄 실행
function triggerPrint() {
  updatePrintTable();
  window.print();
}

// 부드러운 웹 오디오 차임벨 사운드
function playChimeSound() {
  if (!state.soundEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // 맑은 아르페지오 음계 (도, 미, 솔, 높은도)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.6);
    });
  } catch (e) {
    // AudioContext blocked by browser autoplay policy if user hasn't interacted
  }
}

// 색종이 가루(Confetti) 축하 효과
function triggerConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ["#f43f5e", "#ec4899", "#d946ef", "#a855f7", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b"];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height * 0.4,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  let animationFrame;
  function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // 중력
      p.vx *= 0.98; // 공기 저항
      p.rotation += p.vRot;
      p.opacity -= 0.012;

      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx.restore();
      }
    });

    if (alive) {
      animationFrame = requestAnimationFrame(updateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  cancelAnimationFrame(animationFrame);
  updateConfetti();
}

// 토스트 메시지 출력
let toastTimer = null;
function showToast(message, icon = "✨") {
  const toast = document.getElementById("toastNotification");
  const msgEl = document.getElementById("toastMessage");
  const iconEl = document.getElementById("toastIcon");

  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  if (iconEl) iconEl.textContent = icon;

  toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 3200);
}

// HTML 엔티티 이스케이프 유틸
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ============================================================================
// 8. 초기 이벤트 바인딩 및 앱 시작
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  loadStateFromStorage();

  // 학급 명칭 입력 필드
  const titleInput = document.getElementById("classTitleInput");
  if (titleInput) {
    titleInput.value = state.classTitle;
    titleInput.addEventListener("input", (e) => {
      state.classTitle = e.target.value;
      saveStateToStorage();
      updatePrintTable();
    });
  }

  // 명단 편집 패널 토글
  const btnToggleSettings = document.getElementById("btnToggleSettings");
  const settingsPanel = document.getElementById("settingsPanel");
  const settingsToggleText = document.getElementById("settingsToggleText");
  btnToggleSettings.addEventListener("click", () => {
    settingsPanel.classList.toggle("collapsed");
    const isCollapsed = settingsPanel.classList.contains("collapsed");
    settingsToggleText.textContent = isCollapsed ? "열기" : "접기";
  });

  // 핵심 액션 버튼: [🎲 역할 배정하기]
  const btnAssignRoles = document.getElementById("btnAssignRoles");
  btnAssignRoles.addEventListener("click", assignRolesWithAnimation);

  // 보조 액션 버튼들
  document.getElementById("btnShuffleAgain").addEventListener("click", assignRolesWithAnimation);
  document.getElementById("btnResetAssignment").addEventListener("click", resetAssignmentOnly);
  document.getElementById("btnPrint").addEventListener("click", triggerPrint);

  // 효과음 토글
  const soundToggle = document.getElementById("soundToggle");
  soundToggle.checked = state.soundEnabled;
  soundToggle.addEventListener("change", (e) => {
    state.soundEnabled = e.target.checked;
  });

  // 학생 추가 폼
  const addStudentForm = document.getElementById("addStudentForm");
  const newStudentInput = document.getElementById("newStudentInput");
  addStudentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (newStudentInput.value.trim()) {
      addStudent(newStudentInput.value.trim());
      newStudentInput.value = "";
    }
  });

  // 학생 초기화 및 비우기
  document.getElementById("btnResetStudents").addEventListener("click", resetToDefaultStudents);
  document.getElementById("btnClearStudents").addEventListener("click", clearAllStudents);

  // 역할 추가 폼
  const addRoleForm = document.getElementById("addRoleForm");
  const newRoleTitle = document.getElementById("newRoleTitle");
  const newRoleEmoji = document.getElementById("newRoleEmoji");
  const newRoleDuty = document.getElementById("newRoleDuty");

  addRoleForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (newRoleTitle.value.trim()) {
      addRole(newRoleTitle.value.trim(), newRoleEmoji.value.trim(), newRoleDuty.value.trim());
      newRoleTitle.value = "";
      newRoleDuty.value = "";
    }
  });

  // 역할 초기화 및 비우기
  document.getElementById("btnResetRoles").addEventListener("click", resetToDefaultRoles);
  document.getElementById("btnClearRoles").addEventListener("click", clearAllRoles);

  // 구글 스프레드시트 연동 셋업
  setupSheetIntegration();

  // 첫 화면 렌더링
  renderStudentChips();
  renderRolesList();
  renderRoleCards();
});
