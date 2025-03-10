import { ParsedUrlQuery } from 'querystring';

import { Button } from 'antd';
import { DateTime } from 'luxon';
import { NextPage } from 'next';
import React from 'react';

import { useAuth } from '../../../components/auth/hooks/auth_hooks';
import { useStoreDoc } from '../../../components/auth/hooks/firestore_hooks';
import Container from '../../../components/common/Container';
import SlLayout from '../../../components/layout';
import getStringValueFromQuery from '../../../controllers/etc/get_value_from_query';
import { EN_QUIZ_STATUS } from '../../../models/quiz/interface/EN_QUIZ_STATUS';
import { QuizOperation } from '../../../models/quiz/interface/I_quiz_operation';

interface Props {
  query: ParsedUrlQuery;
  id: string;
}

const initData: QuizOperation = {
  status: EN_QUIZ_STATUS.INIT,
  title: '데이터 수신 중',
  total_participants: 0,
  alive_participants: 0,
};

/** 참가확인용 */
const QuizJoin: NextPage<Props> = ({ id }) => {
  const { docValue: info, docRef } = useStoreDoc({ collectionPath: 'quiz', docPath: id });
  const { initializing, haveUser, user } = useAuth();
  // const { docValue: participant } = useStoreDoc({
  //   collectionPath: 'quiz/participants',
  //   docPath: id,
  // });

  const operationInfo: QuizOperation = (() => {
    if (info === undefined) {
      return initData;
    }
    const dataFromFireStore = info.data();
    if (dataFromFireStore) {
      return dataFromFireStore as QuizOperation;
    }
    return initData;
  })();

  // 사용자 정보 초기화 중인지 확인
  if (initializing) {
    return <SlLayout>loading...</SlLayout>;
  }

  // 사용자가 가입된 상태인지 확인한다.
  if (haveUser === false) {
    return (
      <SlLayout>
        <p>참가하려면 로그인해야합니다</p>
        <Button href={`/signin?redirect=/quiz/${id}/join`}>로그인 페이지로 이동</Button>
      </SlLayout>
    );
  }

  if (operationInfo.status === EN_QUIZ_STATUS.INIT) {
    return <SlLayout>정보 확인중</SlLayout>;
  }

  if (operationInfo.status === EN_QUIZ_STATUS.PREPARE && haveUser && user) {
    return (
      <SlLayout>
        참가 가능
        <Button
          onClick={async () => {
            await docRef
              .collection('participants')
              .doc(user.uid)
              .set({
                join: DateTime.local().toISO(),
                alive: true,
              });
            window.location.href = `/quiz/${id}/client/${user.uid}`;
          }}
        >
          참가 신청
        </Button>
      </SlLayout>
    );
  }

  return <Container>hihi</Container>;
};

QuizJoin.getInitialProps = async (ctx) => {
  const id = getStringValueFromQuery({ query: ctx.query, field: 'id' });
  return {
    id: id || 'none',
    query: ctx.query,
  };
};

export default QuizJoin;
