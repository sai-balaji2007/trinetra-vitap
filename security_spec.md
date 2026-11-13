# TRINETRA 2.0 Security Specification & Threat Model

## 1. Data Invariants
1. **Identity & Role Integrity**: Every user document in `users/{userId}` must have `uid == request.auth.uid` on creation, and self-registration is strictly restricted to `role == 'student'`. Only verified administrators (`isAdmin()`) may promote users to `instructor` or `admin`.
2. **PII Isolation**: Email addresses and sensitive verification state are stored in `users/{userId}/private/{docId}` or restricted strictly to `isOwner(userId) || isAdmin()`. Blanket `allow read: if isSignedIn()` is forbidden.
3. **Course Authoring Gate**: Only verified `instructor` or `admin` accounts can create, edit, or publish courses, modules, lessons, quizzes, and questions. Students cannot create or publish courses.
4. **Unpublished Course Protection**: Unpublished courses and their internal modules/lessons/questions are hidden from general student queries and only visible to the owning instructor and admins.
5. **Certificate Issuance Integrity**: Students cannot arbitrarily mint certificates for themselves (`verified: true`) without an actual `enrollments/{uid}_{courseId}` record AND a passing final `quizAttempts/{uid}_{quizId}` (`passed == true`) or explicit instructor/admin issuance.
6. **Temporal & Structural Boundaries**: All document IDs match `^[a-zA-Z0-9_\-]+$` (`<= 128` or `<= 260` for composite IDs), all strings enforce explicit `.size()` upper bounds, and all writes use explicit `keys().hasAll(...)` + `keys().hasOnly(...)` or `affectedKeys().hasOnly(...)` guards.

## 2. The "Dirty Dozen" Attack Payloads
1. **Privilege Escalation on Signup**: `{ "uid": "u1", "displayName": "Hacker", "role": "admin" }` -> `PERMISSION_DENIED` (self-registration must set `role == 'student'`).
2. **Role Self-Promotion Update**: `updateDoc(doc(db, 'users', 'u1'), { role: 'instructor' })` -> `PERMISSION_DENIED` (`role` not in student `affectedKeys().hasOnly()`).
3. **Cross-User PII Read**: `getDoc(doc(db, 'users', 'other_user', 'private', 'info'))` -> `PERMISSION_DENIED`.
4. **Student Publishing Course**: `createDoc(collection(db, 'courses'), { title: "Fake", published: true, instructorId: "student1" })` -> `PERMISSION_DENIED` (`isInstructor()` fails).
5. **Shadow Ghost Field Injection**: `updateDoc(doc(db, 'lessonProgress', 'u1_l1'), { completed: true, isAdmin: true })` -> `PERMISSION_DENIED` (`affectedKeys().hasOnly()` blocks ghost fields).
6. **Self-Awarded Certificate Without Passing Quiz**: `setDoc(doc(db, 'certificates', 'cert1'), { userId: "u1", courseId: "c1", quizId: "q_final", verified: true })` -> `PERMISSION_DENIED` (`quizAttempts/u1_q_final.passed == true` fails).
7. **ID Poisoning (>1KB ID)**: `setDoc(doc(db, 'courses', 'a'.repeat(500)), ...)` -> `PERMISSION_DENIED` (`isValidId()` fails).
8. **Cross-User Progress Tampering**: `updateDoc(doc(db, 'lessonProgress', 'other_l1'), { completed: true })` -> `PERMISSION_DENIED`.
9. **Spoofed Unverified Email Admin Claim**: Auth token has admin email but `email_verified: false` -> `PERMISSION_DENIED` (`isVerified()` requires `email_verified == true`).
10. **Deleting Published Course by Instructor**: `deleteDoc(doc(db, 'courses', 'published_course'))` by non-admin instructor -> `PERMISSION_DENIED` (`existing().published == false` required).
11. **Discussion Author Spoofing**: `createDoc(collection(db, 'discussions'), { authorId: "someone_else", ... })` -> `PERMISSION_DENIED`.
12. **Blanket List Scraping of Private Enrollments**: `getDocs(collection(db, 'enrollments'))` without `where('userId', '==', uid)` -> `PERMISSION_DENIED` (`allow list` requires `resource.data.userId == request.auth.uid || isAdmin()`).
