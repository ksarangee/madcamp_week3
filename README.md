### ⚒️ 개발환경

**Front-end**: React Native (TypeScript)

**Back-end**: NestJS, MongoDB

**API**: ETRI 발음평가 API

---

### 💪🏻 팀원
이화여대 20학번 김사랑

KAIST 20학번 이수민

---

## 📱 Overview

### 1️⃣ 메인 화면

- 움직이는 앱 아이콘과 함께 플레이 화면 혹은 랭킹 화면으로 이동할 수 있어요.
- 플레이 버튼을 누르면 게임이 바로 시작되고, 랭킹 화면으로 이동 시 오늘 플레이한 유저들의 랭킹 차트를 한 눈에 볼 수 있어요.

https://github.com/user-attachments/assets/b06f044b-cadd-47e3-9824-3182e5ea15c5

- 메인화면

https://github.com/user-attachments/assets/5929a61a-a831-4b93-bae0-9ef735532c0c

- 플레이 버튼

https://github.com/user-attachments/assets/23752292-96cd-46ef-a97c-c4aa13dbfa82

- 랭킹 버튼

### 2️⃣ 플레이 화면

- 시간 제한 안에 주어진 단어 여섯개를 올바르게 발음해야 해요!
- 발음이 자주 틀리는 우리말 단어 여러개를 저장해둔 DB에서 쉬운 레벨의 단어 3개, 어려운 레벨의 단어 3개를 랜덤으로 불러와요.
- 각 라운드마다 발음이 끝나면, 녹음파일을 base64로 인코딩 후 발음평가 API를 통해 발음 점수를 저장해요.

https://github.com/user-attachments/assets/307fe810-de72-435b-800c-69e4996e870d

- 6라운드 전체

https://github.com/user-attachments/assets/832038cd-5554-4750-8f92-c7fda4a46559

- 게임 진행 취소
    - 상단 좌측 뒤로가기
    - 안드로이드 뒤로가기

### 3️⃣ 스코어 화면

- 각 라운드에서 저장한 발음 점수의 평균을 내어 총 점수를 보여줘요. 플레이어는 자신의 라운드별 점수도 확인할 수 있어요.
- 점수대별로 나타나는 코멘트가 달라요.
- 자신의 점수가 마음에 든다면, 랭킹 차트의 자신의 기록을 추가할 수 있어요. 점수가 마음에 들지 않는다면, 메인 화면으로 돌아가 다시 플레이를 할 수 있어요.

https://github.com/user-attachments/assets/97734a68-86ec-4ecf-82be-acbb86b8dd10

- 낮은점수
    - 국어 공부를 하셨군요!

https://github.com/user-attachments/assets/2eacf90f-e9bc-4fbd-9e2d-9d56c1fb60fa

- 높은 점수
    - 세종대왕님이 기뻐하시네요!

https://github.com/user-attachments/assets/d9c73178-9ca8-4e56-a215-403ae133344e

- 마음에 들지 않는 점수 기록하지 않기

### 4️⃣ 랭킹 화면

- 스코어 화면에서 랭킹 화면으로 이동 시 오늘 플레이한 유저들의 랭킹 차트를 확인할 수 있고, 이름을 입력해 자신의 플레이 기록을 남길 수 있어요. 이후 자신의 기록이 반영된 랭킹 차트를 볼 수 있어요.
- 날짜가 바뀌면 이전에 플레이한 기록은 사라지고, 초기화된 랭킹 차트를 보게 돼요.

https://github.com/user-attachments/assets/769eee94-eef4-494f-9cb1-f3e3a653952c
