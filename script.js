/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ClassTube - 우리 반 1인 1역할 배정기 (script.js)
 * Google YouTube 사이트 디자인 시스템 적용
 * 순수 HTML/CSS/JS로 제작되어 GitHub Pages에서 완벽하게 구동됩니다.
 */

// ============================================================================
// 1. 기본 예시 데이터 세팅 (학생 12명 & 학급 역할 12개)
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
    category: "cleaning",
    duration: "쉬는시간",
    theme: "theme-mint"
  },
  {
    id: "role-2",
    name: "급식 지도 크리에이터",
    emoji: "🍱",
    duty: "급식실에서 차례차례 줄을 서고 식탁을 닦아요.",
    category: "living",
    duration: "점심시간",
    theme: "theme-yellow"
  },
  {
    id: "role-3",
    name: "에너지 지킴이",
    emoji: "💡",
    duty: "교실을 비울 때 전등과 전자칠판 전원을 꺼요.",
    category: "living",
    duration: "이동수업",
    theme: "theme-blue"
  },
  {
    id: "role-4",
    name: "식물 사랑이",
    emoji: "🌱",
    duty: "학급 화분에 주기적으로 물을 주고 시든 잎을 살펴요.",
    category: "cleaning",
    duration: "아침시간",
    theme: "theme-mint"
  },
  {
    id: "role-5",
    name: "우유 배급 도우미",
    emoji: "🥛",
    duty: "우유 상자를 정리하고 친구들에게 안전하게 나누어 줘요.",
    category: "living",
    duration: "2교시후",
    theme: "theme-coral"
  },
  {
    id: "role-6",
    name: "줄서기 반장",
    emoji: "🚶",
    duty: "이동 수업 때 친구들이 두 줄로 바르게 줄을 서도록 도와요.",
    category: "living",
    duration: "이동수업",
    theme: "theme-purple"
  },
  {
    id: "role-7",
    name: "환기 마스터",
    emoji: "🪟",
    duty: "쉬는 시간마다 창문을 열어 맑은 공기로 교실을 환기해요.",
    category: "cleaning",
    duration: "쉬는시간",
    theme: "theme-blue"
  },
  {
    id: "role-8",
    name: "학급문고 도서관장",
    emoji: "📚",
    duty: "학급문고 책을 번호대로 가지런히 정리하고 대여를 도와요.",
    category: "learning",
    duration: "자율시간",
    theme: "theme-pink"
  },
  {
    id: "role-9",
    name: "분리수거 환경지킴이",
    emoji: "♻️",
    duty: "종이, 플라스틱, 캔을 올바르게 분리배출하도록 도와요.",
    category: "cleaning",
    duration: "청소시간",
    theme: "theme-mint"
  },
  {
    id: "role-10",
    name: "체육 활동 도우미",
    emoji: "⚽",
    duty: "체육 시간에 필요한 공과 기구를 챙기고 제자리에 반납해요.",
    category: "learning",
    duration: "체육시간",
    theme: "theme-yellow"
  },
  {
    id: "role-11",
    name: "아침 알림 방송반",
    emoji: "📢",
    duty: "학교 아침 방송을 집중해 듣고 중요한 알림을 전달해요.",
    category: "learning",
    duration: "아침조회",
    theme: "theme-purple"
  },
  {
    id: "role-12",
    name: "타임 알리미",
    emoji: "⏰",
    duty: "수업 시작 1분 전에 친구들에게 자리에 앉도록 안내해요.",
    category: "living",
    duration: "수업시작전",
    theme: "theme-coral"
  }
];

const THEME_CYCLE = ["theme-mint", "theme-yellow", "theme-blue", "theme-pink", "theme-purple", "theme-coral"];
const AVATAR_COLORS = [
  "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
  "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
  "linear-gradient(135deg, #10b981 0%, #84cc16 100%)",
  "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #eab308 100%)",
  "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)"
];

// ============================================================================
// 2. 애플리케이션 상태 (State) & 로컬 스토리지 연동
// ============================================================================

const STORAGE_KEY = "classtube_role_allocator_v2";

let state = {
  classTitle: "3학년 2반 우리들의 소중한 역할",
  students: [...DEFAULT_STUDENTS],
  roles: JSON.parse(JSON.stringify(DEFAULT_ROLES)),
  assignments: [],
  isAssigned: false,
  soundEnabled: true,
  appsScriptUrl: "",
  theme: "light",
  currentFilter: "all",
  searchKeyword: ""
};

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
      if (parsed.theme) state.theme = parsed.theme;
    }
  } catch (e) {
    console.warn("로컬 스토리지 불러오기 실패:", e);
  }
}

function saveStateToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("로컬 스토리지 저장 실패:", e);
  }
}

// 테마 적용 (Light / Dark)
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  const themeIcon = document.getElementById("themeIcon");
  if (themeIcon) {
    themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  }
  saveStateToStorage();
}

// ============================================================================
// 3. YouTube 비디오 카드 렌더링 & UI 제어
// ============================================================================

function renderRoleCards() {
  const container = document.getElementById("roleCardsGrid");
  if (!container) return;
  container.innerHTML = "";

  const assignedMap = new Map();
  state.assignments.forEach(a => assignedMap.set(a.roleId, a.studentName));

  // 검색어 및 카테고리 필터링
  const filteredRoles = state.roles.filter(role => {
    // 1. 카테고리 필터
    if (state.currentFilter !== "all" && role.category && role.category !== state.currentFilter) {
      return false;
    }
    // 2. 검색어 필터
    if (state.searchKeyword) {
      const kw = state.searchKeyword.toLowerCase();
      const student = (assignedMap.get(role.id) || "").toLowerCase();
      const roleName = role.name.toLowerCase();
      const duty = (role.duty || "").toLowerCase();
      return roleName.includes(kw) || student.includes(kw) || duty.includes(kw);
    }
    return true;
  });

  if (filteredRoles.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 16px; color: var(--yt-text-secondary);">
        <p style="font-size: 32px; margin-bottom: 8px;">🔍</p>
        <p style="font-size: 16px; font-weight: 700;">검색 결과가 없습니다.</p>
        <p style="font-size: 13px; margin-top: 4px;">다른 검색어를 입력하거나 필터를 '전체'로 변경해 보세요.</p>
      </div>
    `;
    return;
  }

  filteredRoles.forEach((role, idx) => {
    const studentName = assignedMap.get(role.id) || "";
    const card = document.createElement("div");
    const themeClass = role.theme || THEME_CYCLE[idx % THEME_CYCLE.length];
    card.className = `yt-video-card ${themeClass}`;
    card.id = `yt-card-${role.id}`;

    // 학생 아바타 이니셜 (예: 김민준 -> 민준 또는 첫 글자)
    const initialText = studentName ? (studentName.length > 2 ? studentName.slice(-2) : studentName) : "미정";
    const avatarGradient = AVATAR_COLORS[idx % AVATAR_COLORS.length];

    card.innerHTML = `
      <!-- 16:9 YouTube Thumbnail -->
      <div class="yt-thumbnail-wrapper" title="${escapeHtml(role.name)} 자세히 보기">
        <div class="yt-thumbnail-content">
          <div class="yt-thumb-center">
            <span class="yt-thumb-emoji">${role.emoji || "✨"}</span>
            <span class="yt-thumb-title">${escapeHtml(role.name)}</span>
          </div>
          <span class="yt-card-index-badge">#${idx + 1}</span>
          <span class="yt-duration-badge">${escapeHtml(role.duration || "상시 활동")}</span>
          <div class="yt-thumb-progress"></div>
        </div>
      </div>

      <!-- Video Details & Student Creator Row -->
      <div class="yt-video-details">
        <div class="yt-channel-avatar-circle" style="background: ${avatarGradient};" title="${studentName || '미배정 학생'}">
          ${initialText}
        </div>
        <div class="yt-meta-content">
          <h3 class="yt-video-title" title="${escapeHtml(role.duty || '')}">
            ${role.emoji || ""} ${escapeHtml(role.name)} - ${escapeHtml(role.duty || '우리 반을 위해 솔선수범해요')}
          </h3>
          <div class="yt-creator-row">
            <span class="yt-creator-name ${studentName ? '' : 'empty'}" id="studentName-${role.id}">
              ${studentName ? escapeHtml(studentName) : "배정 대기 중 🕒"}
            </span>
            ${studentName ? `
              <svg viewBox="0 0 24 24" class="yt-check-icon" title="역할 임명 완료 크리에이터">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM9.8 17.3l-4.2-4.1 1.4-1.4 2.8 2.7 7.4-7.4 1.4 1.4-8.8 8.8z"></path>
              </svg>
            ` : ''}
          </div>
          <div class="yt-views-row">
            <span>조회수 12회</span>
            <span>•</span>
            <span>${studentName ? '배정 완료' : '미배정'}</span>
          </div>
        </div>
        <button class="yt-card-menu-btn" data-role-id="${role.id}" title="담당 학생 수동 교체">⋮</button>
      </div>
    `;

    container.appendChild(card);
  });

  // 카드 메뉴 버튼 (학생 교체) 이벤트 바인딩
  container.querySelectorAll(".yt-card-menu-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const roleId = e.currentTarget.getAttribute("data-role-id");
      promptStudentSwap(roleId);
    });
  });

  updateHeaderStatus();
  updatePrintTable();
}

// 상단 배너 및 사이드바 수치 업데이트
function updateHeaderStatus() {
  const studentCount = state.students.length;
  const roleCount = state.roles.length;

  const sCount = document.getElementById("studentCountBadge");
  const rCount = document.getElementById("roleCountBadge");
  const sPill = document.getElementById("studentPill");
  const rPill = document.getElementById("rolePill");
  const sideS = document.getElementById("sideStudentCount");
  const sideR = document.getElementById("sideRoleCount");

  if (sCount) sCount.textContent = studentCount;
  if (rCount) rCount.textContent = roleCount;
  if (sPill) sPill.textContent = `${studentCount}명`;
  if (rPill) rPill.textContent = `${roleCount}개`;
  if (sideS) sideS.textContent = studentCount;
  if (sideR) sideR.textContent = roleCount;

  const matchStatus = document.getElementById("matchStatusBadge");
  if (matchStatus) {
    if (studentCount === roleCount && studentCount > 0) {
      matchStatus.textContent = "1:1 매칭 준비 완료";
      matchStatus.style.color = "#10b981";
    } else if (studentCount > roleCount) {
      matchStatus.textContent = `학생이 ${studentCount - roleCount}명 더 많음`;
      matchStatus.style.color = "#ef4444";
    } else {
      matchStatus.textContent = `역할이 ${roleCount - studentCount}개 더 많음`;
      matchStatus.style.color = "#f59e0b";
    }
  }

  const assignedNotice = document.getElementById("assignedCountNotice");
  if (assignedNotice) {
    if (state.isAssigned && state.assignments.length > 0) {
      assignedNotice.textContent = `🎉 ${state.assignments.length}명 전원 배정 완료!`;
      assignedNotice.className = "yt-feed-badge active";
    } else {
      assignedNotice.textContent = "배정 대기 중";
      assignedNotice.className = "yt-feed-badge";
    }
  }

  // 사이드바 미니 학생 리스트 렌더링
  const sidebarList = document.getElementById("sidebarStudentsList");
  if (sidebarList) {
    sidebarList.innerHTML = "";
    state.students.forEach((name, i) => {
      const item = document.createElement("div");
      item.className = "yt-sub-item";
      item.innerHTML = `
        <span class="yt-sub-avatar">${name.slice(0, 1)}</span>
        <span>${escapeHtml(name)}</span>
      `;
      sidebarList.appendChild(item);
    });
  }
}

// 학생 칩 리스트 (스튜디오 패널 내)
function renderStudentChips() {
  const container = document.getElementById("studentChipsList");
  if (!container) return;
  container.innerHTML = "";

  state.students.forEach((name, index) => {
    const chip = document.createElement("div");
    chip.className = "yt-chip-tag";
    chip.innerHTML = `
      <span>${index + 1}. ${escapeHtml(name)}</span>
      <button type="button" data-index="${index}" title="${name} 삭제">&times;</button>
    `;
    container.appendChild(chip);
  });

  container.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-index"), 10);
      removeStudent(idx);
    });
  });
}

// 역할 리스트 (스튜디오 패널 내)
function renderRolesList() {
  const container = document.getElementById("rolesList");
  if (!container) return;
  container.innerHTML = "";

  state.roles.forEach((role, index) => {
    const item = document.createElement("div");
    item.className = "yt-role-row-item";
    item.innerHTML = `
      <span>${role.emoji || "✨"} <strong>${index + 1}. ${escapeHtml(role.name)}</strong> (${escapeHtml(role.duty || '')})</span>
      <button type="button" class="yt-btn-small yt-btn-danger" data-id="${role.id}">삭제</button>
    `;
    container.appendChild(item);
  });

  container.querySelectorAll(".yt-btn-danger").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const roleId = e.currentTarget.getAttribute("data-id");
      removeRole(roleId);
    });
  });
}

// A4 교실 게시판 인쇄용 테이블 렌더링
function updatePrintTable() {
  const tableBody = document.getElementById("printTableBody");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  const assignedMap = new Map();
  state.assignments.forEach(a => assignedMap.set(a.roleId, a.studentName));

  const now = new Date();
  const dateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
  const printDateEl = document.getElementById("printDate");
  const printCountEl = document.getElementById("printStudentCount");
  const printTitleEl = document.getElementById("printClassTitle");

  if (printDateEl) printDateEl.textContent = dateStr;
  if (printCountEl) printCountEl.textContent = `${state.students.length}명`;
  if (printTitleEl) printTitleEl.textContent = state.classTitle || "우리 반 1인 1역할 조직표";

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
// 4. 무작위 1:1 배정 로직 & YouTube 버퍼링 애니메이션
// ============================================================================

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function assignRolesWithYouTubeAnimation() {
  if (state.students.length === 0) {
    showToast("⚠️ 학생 명단이 비어 있습니다. 학생을 먼저 추가해 주세요!", "⚠️");
    return;
  }
  if (state.roles.length === 0) {
    showToast("⚠️ 학급 역할이 비어 있습니다. 역할을 먼저 추가해 주세요!", "⚠️");
    return;
  }

  const assignBtn = document.getElementById("btnAssignRoles");
  const loadingBar = document.getElementById("ytLoadingBar");

  // YouTube 상단 버퍼링 바 활성화
  if (loadingBar) loadingBar.classList.add("active");
  if (assignBtn) {
    assignBtn.classList.add("is-rolling");
    assignBtn.disabled = true;
  }

  // 1:1 무작위 셔플
  const shuffledStudents = shuffleArray(state.students);
  const newAssignments = [];
  const minCount = Math.min(state.roles.length, shuffledStudents.length);

  for (let i = 0; i < minCount; i++) {
    newAssignments.push({
      roleId: state.roles[i].id,
      studentName: shuffledStudents[i]
    });
  }

  if (state.roles.length > shuffledStudents.length) {
    for (let i = shuffledStudents.length; i < state.roles.length; i++) {
      newAssignments.push({
        roleId: state.roles[i].id,
        studentName: "(미배정)"
      });
    }
  }

  // 1.2초간 이름 롤링 효과
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
      nameElements.forEach(el => {
        if (el) {
          const randIndex = Math.floor(Math.random() * state.students.length);
          el.textContent = state.students[randIndex];
        }
      });
    } else {
      clearInterval(timer);
      state.assignments = newAssignments;
      state.isAssigned = true;
      saveStateToStorage();

      renderRoleCards();

      if (loadingBar) loadingBar.classList.remove("active");
      if (assignBtn) {
        assignBtn.classList.remove("is-rolling");
        assignBtn.disabled = false;
      }

      playYouTubeChime();
      triggerConfetti();
      showToast(`🎬 [ClassTube] 12개 역할 배정이 성공적으로 스트리밍되었습니다!`, "🎉");
    }
  }, rollInterval);
}

// 수동 학생 교체 다이얼로그
function promptStudentSwap(roleId) {
  const role = state.roles.find(r => r.id === roleId);
  if (!role) return;

  const currentAssignment = state.assignments.find(a => a.roleId === roleId);
  const currentName = currentAssignment ? currentAssignment.studentName : "";

  const availableOptions = state.students.join(", ");
  const chosenName = prompt(
    `[${role.name}]의 담당 학생 크리에이터를 변경합니다.\n현재 담당: ${currentName || "미배정"}\n\n배정할 학생 이름을 입력하세요:\n(학생 명단: ${availableOptions})`,
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
// 5. 학생 및 역할 관리 (CRUD)
// ============================================================================

function addStudent(name) {
  const clean = name.trim();
  if (!clean) return;
  if (state.students.includes(clean)) {
    showToast(`이미 등록된 학생입니다: ${clean}`, "⚠️");
    return;
  }
  state.students.push(clean);
  saveStateToStorage();
  renderStudentChips();
  updateHeaderStatus();
  showToast(`학생 '${clean}' 등록 완료!`, "👧");
}

function removeStudent(index) {
  const removed = state.students.splice(index, 1);
  saveStateToStorage();
  renderStudentChips();
  updateHeaderStatus();
  showToast(`'${removed[0]}' 학생이 삭제되었습니다.`, "🗑️");
}

function addRole(name, emoji, duty) {
  const clean = name.trim();
  if (!clean) return;

  const newId = `role-${Date.now()}`;
  const theme = THEME_CYCLE[state.roles.length % THEME_CYCLE.length];

  state.roles.push({
    id: newId,
    name: clean,
    emoji: emoji.trim() || "✨",
    duty: duty.trim() || "친구들을 돕고 솔선수범해요.",
    category: "living",
    duration: "상시 활동",
    theme: theme
  });

  saveStateToStorage();
  renderRolesList();
  renderRoleCards();
  showToast(`새 역할 '${clean}' 생성 완료!`, "📋");
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
  if (confirm("학생 명단을 기본 12명으로 복원하시겠습니까?")) {
    state.students = [...DEFAULT_STUDENTS];
    saveStateToStorage();
    renderStudentChips();
    updateHeaderStatus();
    showToast("기본 학생 12명으로 복원되었습니다.", "🔄");
  }
}

function resetToDefaultRoles() {
  if (confirm("학급 역할을 기본 12개로 복원하시겠습니까?")) {
    state.roles = JSON.parse(JSON.stringify(DEFAULT_ROLES));
    state.assignments = [];
    state.isAssigned = false;
    saveStateToStorage();
    renderRolesList();
    renderRoleCards();
    showToast("기본 학급 역할 12개로 복원되었습니다.", "🔄");
  }
}

function clearAllStudents() {
  if (confirm("모든 학생을 삭제하시겠습니까?")) {
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
  if (confirm("모든 역할을 삭제하시겠습니까?")) {
    state.roles = [];
    state.assignments = [];
    state.isAssigned = false;
    saveStateToStorage();
    renderRolesList();
    renderRoleCards();
    showToast("학급 역할을 비웠습니다.", "🧹");
  }
}

function resetAssignmentOnly() {
  state.assignments = [];
  state.isAssigned = false;
  saveStateToStorage();
  renderRoleCards();
  showToast("배정이 초기화되었습니다. 다시 배정해 보세요!", "🧹");
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

  if (state.appsScriptUrl) {
    if (inputGetUrl) inputGetUrl.value = state.appsScriptUrl;
    if (inputPostUrl) inputPostUrl.value = state.appsScriptUrl;
  }

  btnSheetLoad.addEventListener("click", () => modalLoad.classList.remove("hidden"));
  btnSheetSave.addEventListener("click", () => {
    updateSavePreview();
    modalSave.classList.remove("hidden");
  });

  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const targetId = e.currentTarget.getAttribute("data-close");
      const targetModal = document.getElementById(targetId);
      if (targetModal) targetModal.classList.add("hidden");
    });
  });

  [modalLoad, modalSave].forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  });

  // [시트에서 실시간 불러오기]
  document.getElementById("btnFetchFromAppsScript").addEventListener("click", async () => {
    const url = inputGetUrl.value.trim();
    if (!url) {
      alert("Apps Script 웹 앱 URL을 입력해 주세요!");
      return;
    }
    state.appsScriptUrl = url;
    saveStateToStorage();
    showToast("스프레드시트에서 데이터를 동기화하는 중...", "🔄");

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP 상태 코드: ${response.status}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        parseSheetData(data);
        modalLoad.classList.add("hidden");
        showToast("🎉 스프레드시트와 성공적으로 동기화되었습니다!", "✅");
      } else {
        throw new Error("올바른 배열 형식이 아닙니다.");
      }
    } catch (err) {
      alert(`불러오기 실패: ${err.message}\nApps Script 배포 시 '웹 앱 액세스: 모든 사용자(Anyone)' 권한을 확인하세요.`);
    }
  });

  // [기본 12명 예시 채우기]
  document.getElementById("btnLoadSampleData").addEventListener("click", () => {
    state.students = [...DEFAULT_STUDENTS];
    state.roles = JSON.parse(JSON.stringify(DEFAULT_ROLES));
    saveStateToStorage();
    renderStudentChips();
    renderRolesList();
    renderRoleCards();
    modalLoad.classList.add("hidden");
    showToast("기본 12명 데이터로 리셋되었습니다.", "🌱");
  });

  // [시트로 전송]
  document.getElementById("btnPostToAppsScript").addEventListener("click", async () => {
    const url = inputPostUrl.value.trim();
    if (!url) {
      alert("Apps Script 웹 앱 URL을 입력해 주세요!");
      return;
    }
    state.appsScriptUrl = url;
    saveStateToStorage();
    showToast("스프레드시트로 배정 결과를 업로드하는 중...", "💾");

    const payload = generateExportData();
    try {
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      modalSave.classList.add("hidden");
      showToast("🚀 스프레드시트에 결과가 성공적으로 전송되었습니다!", "✅");
    } catch (err) {
      alert(`전송 실패: ${err.message}`);
    }
  });

  // CSV 다운로드 핸들러
  const downloadCSV = () => {
    const csvContent = generateCSV();
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.classTitle || "ClassTube"}_1인1역할_배정결과.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV 파일 다운로드 완료!", "📥");
  };

  document.getElementById("btnDownloadCSVModal").addEventListener("click", downloadCSV);
  document.getElementById("btnExportCSV").addEventListener("click", downloadCSV);

  // 클립보드 복사 핸들러
  const copyTableToClipboard = () => {
    const text = generateTextSummary();
    navigator.clipboard.writeText(text).then(() => {
      showToast("배정 결과가 복사되었습니다! (스프레드시트에 바로 붙여넣기 가능)", "📋");
    }).catch(() => {
      showToast("복사 실패: 수동으로 복사해 주세요.", "⚠️");
    });
  };

  document.getElementById("btnCopyResultModal").addEventListener("click", copyTableToClipboard);
  document.getElementById("btnCopyResult").addEventListener("click", copyTableToClipboard);
}

function parseSheetData(rows) {
  const newStudents = new Set();
  const newRoles = [];

  rows.forEach((row, index) => {
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
        category: "living",
        duration: "상시 활동",
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

function generateExportData() {
  const assignedMap = new Map();
  state.assignments.forEach(a => assignedMap.set(a.roleId, a.studentName));

  return {
    classTitle: state.classTitle,
    platform: "ClassTube",
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

function generateCSV() {
  const assignedMap = new Map();
  state.assignments.forEach(a => assignedMap.set(a.roleId, a.studentName));

  let csv = "번호,역할명,이모지,담당학생(크리에이터),활동내용\n";
  state.roles.forEach((r, idx) => {
    const student = assignedMap.get(r.id) || "미배정";
    const cleanDuty = (r.duty || "").replace(/"/g, '""');
    csv += `${idx + 1},"${r.name}","${r.emoji}","${student}","${cleanDuty}"\n`;
  });
  return csv;
}

function generateTextSummary() {
  const assignedMap = new Map();
  state.assignments.forEach(a => assignedMap.set(a.roleId, a.studentName));

  let text = `[ ClassTube 🎬 ${state.classTitle} 1인 1역할 배정표 ]\n`;
  text += `배정일: ${new Date().toLocaleDateString("ko-KR")}\n`;
  text += "--------------------------------------------------\n";
  state.roles.forEach((r, idx) => {
    const student = assignedMap.get(r.id) || "미배정";
    text += `${idx + 1}. ${r.emoji} ${r.name} ➔ ${student} (${r.duty})\n`;
  });
  text += "--------------------------------------------------\n";
  return text;
}

function updateSavePreview() {
  const preview = document.getElementById("saveDataPreview");
  if (preview) preview.value = generateTextSummary();
}

// ============================================================================
// 7. 사운드, Confetti, 유틸리티
// ============================================================================

function triggerPrint() {
  updatePrintTable();
  window.print();
}

function playYouTubeChime() {
  if (!state.soundEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
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
  } catch (e) {}
}

function triggerConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ["#ff0000", "#cc0000", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

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
      p.vy += 0.4;
      p.vx *= 0.98;
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
// 8. 초기 이벤트 바인딩 및 앱 실행
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  loadStateFromStorage();
  applyTheme(state.theme || "light");

  // 테마 토글 버튼
  const btnThemeToggle = document.getElementById("btnThemeToggle");
  if (btnThemeToggle) {
    btnThemeToggle.addEventListener("click", () => {
      const nextTheme = state.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      showToast(`${nextTheme === 'dark' ? '다크 모드' : '라이트 모드'}로 전환되었습니다.`, nextTheme === 'dark' ? '🌙' : '☀️');
    });
  }

  // 사이드바 토글 (햄버거 메뉴)
  const btnToggleSidebar = document.getElementById("btnToggleSidebar");
  const sidebar = document.getElementById("ytSidebar");
  if (btnToggleSidebar && sidebar) {
    btnToggleSidebar.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  // 검색창 바인딩
  const searchInput = document.getElementById("searchInput");
  const btnClearSearch = document.getElementById("btnClearSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchKeyword = e.target.value.trim();
      if (btnClearSearch) {
        btnClearSearch.classList.toggle("hidden", state.searchKeyword.length === 0);
      }
      renderRoleCards();
    });
  }
  if (btnClearSearch) {
    btnClearSearch.addEventListener("click", () => {
      searchInput.value = "";
      state.searchKeyword = "";
      btnClearSearch.classList.add("hidden");
      renderRoleCards();
    });
  }

  // 마이크 버튼 (음성 또는 빠른 가이드 안내)
  const btnVoiceSearch = document.getElementById("btnVoiceSearch");
  if (btnVoiceSearch) {
    btnVoiceSearch.addEventListener("click", () => {
      showToast("💡 검색창에 학생 이름(예: 김민준)이나 역할(예: 칠판)을 입력해 보세요!", "🎙️");
    });
  }

  // 상단 YouTube Chips 필터링 및 빠른 액션
  document.querySelectorAll(".yt-chip").forEach(chip => {
    chip.addEventListener("click", (e) => {
      const filter = e.currentTarget.getAttribute("data-filter");
      const action = e.currentTarget.getAttribute("data-action");

      if (filter) {
        document.querySelectorAll(".yt-chip[data-filter]").forEach(c => c.classList.remove("active"));
        e.currentTarget.classList.add("active");
        state.currentFilter = filter;
        renderRoleCards();
      } else if (action === "assign") {
        assignRolesWithYouTubeAnimation();
      } else if (action === "shuffle") {
        assignRolesWithYouTubeAnimation();
      } else if (action === "reset") {
        resetAssignmentOnly();
      } else if (action === "toggle-manage") {
        const panel = document.getElementById("settingsPanel");
        panel.classList.toggle("collapsed");
      }
    });
  });

  // 학급 명칭 수정
  const titleInput = document.getElementById("classTitleInput");
  if (titleInput) {
    titleInput.value = state.classTitle;
    titleInput.addEventListener("input", (e) => {
      state.classTitle = e.target.value;
      saveStateToStorage();
      updatePrintTable();
    });
  }

  // 관리 스튜디오 패널 열기/닫기
  const btnToggleSettings = document.getElementById("btnToggleSettings");
  const btnCloseSettings = document.getElementById("btnCloseSettings");
  const settingsPanel = document.getElementById("settingsPanel");
  if (btnToggleSettings) {
    btnToggleSettings.addEventListener("click", () => settingsPanel.classList.toggle("collapsed"));
  }
  if (btnCloseSettings) {
    btnCloseSettings.addEventListener("click", () => settingsPanel.classList.add("collapsed"));
  }

  // 네비게이션 아이템 액션 바인딩
  const navAssign = document.getElementById("navAssign");
  if (navAssign) {
    navAssign.addEventListener("click", (e) => {
      e.preventDefault();
      assignRolesWithYouTubeAnimation();
    });
  }
  const navStudents = document.getElementById("navStudents");
  if (navStudents) {
    navStudents.addEventListener("click", (e) => {
      e.preventDefault();
      settingsPanel.classList.remove("collapsed");
      document.getElementById("newStudentInput")?.focus();
    });
  }
  const navRoles = document.getElementById("navRoles");
  if (navRoles) {
    navRoles.addEventListener("click", (e) => {
      e.preventDefault();
      settingsPanel.classList.remove("collapsed");
      document.getElementById("newRoleTitle")?.focus();
    });
  }
  const navPrint = document.getElementById("navPrint");
  if (navPrint) {
    navPrint.addEventListener("click", (e) => {
      e.preventDefault();
      triggerPrint();
    });
  }

  // 핵심 액션: [🎲 역할 배정하기]
  const btnAssignRoles = document.getElementById("btnAssignRoles");
  if (btnAssignRoles) {
    btnAssignRoles.addEventListener("click", assignRolesWithYouTubeAnimation);
  }

  document.getElementById("btnShuffleAgain").addEventListener("click", assignRolesWithYouTubeAnimation);
  document.getElementById("btnPrint").addEventListener("click", triggerPrint);

  // 학생 추가 폼
  const addStudentForm = document.getElementById("addStudentForm");
  const newStudentInput = document.getElementById("newStudentInput");
  if (addStudentForm && newStudentInput) {
    addStudentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (newStudentInput.value.trim()) {
        addStudent(newStudentInput.value.trim());
        newStudentInput.value = "";
      }
    });
  }

  document.getElementById("btnResetStudents").addEventListener("click", resetToDefaultStudents);
  document.getElementById("btnClearStudents").addEventListener("click", clearAllStudents);

  // 역할 추가 폼
  const addRoleForm = document.getElementById("addRoleForm");
  const newRoleTitle = document.getElementById("newRoleTitle");
  const newRoleEmoji = document.getElementById("newRoleEmoji");
  const newRoleDuty = document.getElementById("newRoleDuty");

  if (addRoleForm && newRoleTitle) {
    addRoleForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (newRoleTitle.value.trim()) {
        addRole(newRoleTitle.value.trim(), newRoleEmoji.value.trim(), newRoleDuty.value.trim());
        newRoleTitle.value = "";
        newRoleDuty.value = "";
      }
    });
  }

  document.getElementById("btnResetRoles").addEventListener("click", resetToDefaultRoles);
  document.getElementById("btnClearRoles").addEventListener("click", clearAllRoles);

  // 구글 스프레드시트 연동
  setupSheetIntegration();

  // 첫 화면 렌더링
  renderStudentChips();
  renderRolesList();
  renderRoleCards();
});
