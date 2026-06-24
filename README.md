# 경북기계금속고 안내봇 (agent)

학생·학부모가 **선택형 + 직접 입력**으로 물어보면 챗봇이 답하는 정적 사이트입니다.
서버·API 키 없이 **GitHub Pages에 무료**로 올라갑니다. 답변 내용은 **MD 파일**에 들어 있어요.

## 폴더 구성
```
agent/
├─ index.html        ← 챗봇 (학생들이 보는 페이지)
├─ edit.html         ← 🛠️ 수정 모드 (질문/답변 편집 → 파일 내보내기)
├─ kb-loader.js      ← md 파일을 읽어오는 로더 (수정 X)
├─ kb.js             ← md 백업본(로컬에서 열 때 사용). 수정모드가 자동 생성
├─ manifest.json     ← 읽어올 md 파일 목록
└─ md/               ← ★ 실제 질문/답변 내용 (10개 유형 × 5문항)
   ├─ 01-학과.md
   ├─ 02-입학전형.md
   └─ ... 10-기본정보.md
```

## 내용(질문/답변) 수정하는 2가지 방법
**A) 수정 모드 (쉬움, 추천)**
1. `edit.html`을 브라우저로 열기
2. 질문/답변 추가·수정·삭제
3. **[전체 내보내기]** 클릭 → `md` 파일들 + `kb.js` + `manifest.json` 다운로드
4. 다운로드된 파일을 GitHub 저장소의 같은 위치에 **덮어쓰기(commit)**

**B) md 파일 직접 편집**
- `md/` 안의 `.md` 파일을 메모장/VS Code로 열어 수정
- 형식: 맨 위 `# 제목`, `<!-- icon: ⚙️ -->`, 그다음 `## 질문` 줄 + 아래에 답변
- 새 유형(.md)을 추가하면 `manifest.json`에도 파일 경로를 넣어주세요
- 직접 편집했다면, 수정모드를 한 번 열어 [전체 내보내기]로 `kb.js`도 갱신하면 로컬 미리보기도 맞아요

## GitHub Pages로 무료 배포 (5분)
1. <https://github.com/new> 에서 새 저장소 생성 (예: `gbgigo-bot`, **Public**)
2. `agent/` 폴더의 **모든 파일/폴더**를 업로드 (md 폴더 포함) → Commit
   - 업로드 주소: `https://github.com/<아이디>/<저장소>/upload/main`
3. 저장소 → **Settings → Pages** → Source: `Deploy from a branch`, Branch: `main` / `/(root)` → Save
4. 1~2분 뒤 접속: `https://<아이디>.github.io/<저장소>/`
   - 챗봇: `.../index.html`  · 수정모드: `.../edit.html`

> 로컬에서 더블클릭으로 열면 보안정책 때문에 md를 못 읽어 `kb.js` 백업으로 동작해요(정상).
> 인터넷(GitHub Pages)에 올리면 md 파일을 직접 읽습니다.

## 참고
- 모든 정보는 학교 홍보 브로셔·공개 자료 기반 비공식 안내용입니다.
- 정확한 전형/입학 정보: 학교 ☎ 053-859-3800 · <http://school.gyo6.net/gbgigo>
