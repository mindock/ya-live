import FirebaseAdmin from '../commons/firebase_admin.model';
import { QuizParticipant } from './interface/I_quiz_participant';

async function participantFind(args: { user_id: string; quiz_id: string }) {
  const ref = FirebaseAdmin.getInstance()
    .Firestore.collection('quiz')
    .doc(args.quiz_id)
    .collection('participants');
  try {
    const userInfoSnap = await ref.doc(args.user_id).get();
    // 정보가 존재하지 않으면 null 반환
    if (userInfoSnap.exists === false) {
      return null;
    }
    return userInfoSnap.data() as QuizParticipant;
  } catch (err) {
    return null;
  }
}

async function updateParticipant(args: {
  user_id: string;
  quiz_id: string;
  info: Partial<QuizParticipant>;
}) {
  const ref = FirebaseAdmin.getInstance()
    .Firestore.collection('quiz')
    .doc(args.quiz_id)
    .collection('participants');
  try {
    const userInfoSnap = await ref.doc(args.user_id).get();
    // 정보가 존재하지 않으면 null 반환
    if (userInfoSnap.exists === false) {
      return null;
    }
    const oldData = userInfoSnap.data() as QuizParticipant;
    const updateData = { ...oldData, ...args.info };
    await ref.doc(args.user_id).set(updateData);
    return updateData;
  } catch (err) {
    return null;
  }
}

async function addBulkParticipant(args: { quiz_id: string; currentQuizID: string }) {
  try {
    const ref = FirebaseAdmin.getInstance()
      .Firestore.collection('quiz')
      .doc(args.quiz_id)
      .collection('participants');

    const batch = FirebaseAdmin.getInstance().Firestore.batch();
    for (let i = 1; i <= 130; i++) {
      const iString = i.toString();
      batch.set(ref.doc(iString), {
        alive: true,
        currentQuizID: args.currentQuizID,
        displayName: iString,
        id: iString,
        join: '2019-12-09T16:04:49.878+09:00',
        select: Math.floor(Math.random() * (4 - 1)) + 1,
      });
    }

    await batch.commit();

    return { reuslt: true };
  } catch (err) {
    console.log('[bulk 데이터 삽입 실패] ', err);
    return { result: false };
  }
}

export default { participantFind, updateParticipant, addBulkParticipant: addBulkParticipant };
