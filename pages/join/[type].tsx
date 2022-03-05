import React from 'react';
import { useRouter } from 'next/dist/client/router';
import useInput from '../../hooks/useInput';
import { useState, useEffect } from 'react';
import CheckBox from '../../components/input/checkbox';

import useWidth from '../../hooks/useWitdh';
import MarginTop from '../../components/layout/margin-top';
import MarginBottom from '../../components/layout/margin-bottom';
import PcHeader from '../../layout/_pcHeader';
import MobileHeader from '../../layout/_mobileHeader';
import MobileFooter from '../../layout/_mobileFooter';
import Footer from '../../layout/_Footer';
import InputText from '../../components/input/inputText';
import Agree from '../../components/join/agree';
import Button from '../../components/input/button';

import { GetServerSideProps } from 'next';
import Axios from 'axios';
import API from '../../service/api';
import { join } from 'path/posix';
import axios from 'axios';
import UserMemberSingupRequestDataModel from '../../service/api/user/model/user-member-singup-request-data-model';

let authCount = 0;
const Join = (props: any) => {
  const router = useRouter();
  const { mediaQuery } = useWidth();
  const query = router.query.type;
  const [phone, setPhone] = useState<string>('');
  const [auth, setAuth] = useState<string>('');
  const [checkPhoneNumber, setCheckPhoneNumber] = useState<string>('');
  const [validTimer, setValidTimer] = useState<boolean>(false); // Validation Time
  const [validCount, setValidCount] = useState<number>(-1); // Validation
  const [validation, setValidation] = useState<boolean>(true);
  const [status, setStatus] = useState(0);

  // email , password , nickname , phone
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passCofirm, setPassCofirm] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');

  // error message
  const [emailMessage, setEmailMessage] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [passCofirmMessage, setPassCofirmMessage] = useState<string>('');
  const [nameMessage, setNameMessage] = useState<string>('');
  const [nicknameMessage, setNicknameMessage] = useState<string>('');
  const [errSingup, setErrSignup] = useState<boolean>(false);

  // 이메일 유효성 검사
  const onEmailCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.currentTarget.id;
    const value = (e.currentTarget.value as string) ?? '';
    const emailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    setEmail(value);
    if (id === 'join-email') {
      if (value === '') {
        setEmailMessage('이메일을 입력해주세요.');
        setValidation(!validation);
      } else if (!emailRegex.test(value)) {
        setEmailMessage('이메일 형식이 맞지 않습니다.');
        setValidation(!validation);
      } else {
        setValidation(!validation);
        setEmailMessage('');
        getCheckEmailMessage(email);
      }
    }
  };

  // 비밀번호 유효성 검사
  const onPassCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = (e.currentTarget.value as string) ?? '';
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,20}$/;
    setPassword(value);
    if (value === '') {
      alert('비밀번호를 입력해주세요.');
    } else if (!passwordRegex.test(value)) {
      setPasswordMessage('비밀번호는 6 ~ 20 사이로 특수문자를 포함하여 설정해주세요');
      setValidation(!validation);
    } else {
      setPasswordMessage('');
    }
  };

  // 비밀번호 확인
  const onPassConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordConfirmCurrent = e.target.value;
    setPassCofirm(passwordConfirmCurrent);
    if (password === passwordConfirmCurrent) {
      setPassCofirmMessage('');
      setValidation(!validation);
    } else {
      setPassCofirmMessage('비밀번호가 일치하지 않습니다.');
      setValidation(!validation);
    }
  };

  // 이름 유효성 검사
  const onChangeName = (e) => {
    setName(e.target.value);
    if (e.target.value.length < 2 || e.target.value.length > 5) {
      setNameMessage('2글자 이상 5글자 미만으로 입력해주세요.');
      setValidation(!validation);
    } else if (e.target.value <= 0) {
      alert('닉네임을 설정해주세요.');
      setValidation(!validation);
    } else {
      setNameMessage('');
      setValidation(!validation);
    }
  };

  // 닉네임 유효성 검사
  const onChangeNickName = (e) => {
    setNickname(e.target.value);
    if (e.target.value.length < 2 || e.target.value.length > 8) {
      setNicknameMessage('2글자 이상 8글자 미만으로 입력해주세요.');
      setValidation(!validation);
    } else if (e.target.value <= 0) {
      alert('닉네임을 설정해주세요.');
      setValidation(!validation);
    } else {
      setNicknameMessage('');
      getCheckNicknameMessage(nickname);
      setValidation(!validation);
    }
  };

  const Signup = () => {
    API.user
      .Singup({
        adultOk: true,
        authId: 'dkladci239fjerwkfg!R',
        collectionOfMarketingInfoOk: true,
        collectionOfPersonalInfoOk: true,
        email: 'sexking223@naver.com',
        nickname: '헤응헤으으으응',
        password: 'yasyas!!@33',
        phoneNum: '01011111111',
        serviceOk: true,
        snsType: 'D',
        username: '김두한',
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        //캐치는 통신이 안된 상황에 주는 메세지
        console.log(error);
      });
  };

  // router.push('/join/complete');
  //성공시
  //then 통신이 일단은 성공
  //에러가 일어날시에 백엔드에서 명시해주는 상황으로
  // if(res.data === 400) 이런식으로 백엔드에서 보내준 코드를 상황을 적어서 보여준다.

  const onClickPhoneAuth = () => {
    authCount++;
    setStatus(1);
  };

  const stateChange = () => {
    if (status === 0) {
      if (checkPhoneNumber === '') {
        // 휴대폰 인증 API Function
        onClickPhoneAuth();
      }
      setValidCount(180); //------ 인증번호 체크 유효시간 // 3분
      setValidTimer(true);
    } else if (status === 1) {
      onClickResend();
      if (authCount < 3) {
        setValidCount(180); //------- 인증번호 체크 유효시간 // 3분
        setValidTimer(true); //------ 인증번호 체크 타이머 on/off
        setValidation(true); //------ 유효성 검사 validation
      }
    } else if (status === 2) {
      setStatus(0);
    }
  };

  // 인증번호 재발송
  const onClickResend = () => {
    if (authCount < 3) {
      // 휴대폰 인증 API Function
    } else {
      alert('휴대폰인증 재발송은 최대 3회 가능합니다.');
    }
  };

  // AuthTimer
  const authtimmer = () => {
    if (validCount > 0) {
      return `남은 시간 : ${parseInt('' + validCount / 60)}분
				${validCount % 60 < 10 ? '0' + (validCount % 60) : validCount % 60}초`;
    } else {
      return '인증시간이 만료 되었습니다.';
    }
  };

  // 인증번호 유효시간 TIMER
  useEffect(() => {
    if (!validTimer) return undefined;
    const vTick = setTimeout(() => {
      if (validCount > 0) {
        setValidCount(validCount - 1);
        setValidation(true);
      } else {
        setValidTimer(false);
        setValidation(false);
      }
    }, 1000);
    return () => {
      clearTimeout(vTick);
    };
  }, [validCount]);

  // 이메일 체크 API
  const getCheckEmailMessage = (checkEmail: string) => {
    API.user
      .checkEmail({ email: checkEmail })
      .then((res) => {
        const data = res.data;
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 닉네임 체크 API
  const getCheckNicknameMessage = (checkNickname: string) => {
    API.user
      .checkNickname({ nickname: checkNickname })
      .then((res) => {
        const data = res.data;
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    console.log(query);
  }, []);

  return (
    <>
      {mediaQuery === 'M' ? <MobileHeader /> : <PcHeader />}
      <MarginTop margin={160} />
      <section id='join'>
        <div className='join-container'>
          <h2 className='join-title'>회원가입</h2>
          <p className='join-text right'>
            <span className='required'>*</span>필수입력항목
          </p>
          <MarginBottom margin={1} />
          <div>
            <InputText
              required
              label='이메일'
              id='join-email'
              type='text'
              placeholder='goingbuying@gmail.com'
              error={emailMessage.length > 0 && emailMessage}
              value={email}
              onChange={(e) => onEmailCheck(e)}
            />
          </div>
          <MarginBottom margin={27} />
          <div>
            <InputText
              required
              label='비밀번호'
              id='join-password'
              type='password'
              placeholder='**********'
              value={password}
              onChange={onPassCheck}
            />
          </div>
          {password.length < 8 && <span className='error'>{passwordMessage}</span>}
          <MarginBottom margin={10} />
          <div>
            <InputText
              id='join-password2'
              type='password'
              placeholder='**********'
              // error={'비밀번호가 일치 하지 않습니다.'}
              value={passCofirm}
              onChange={onPassConfirm}
            />
            {passCofirm.length > 0 && <span className='error'>{passCofirmMessage}</span>}
          </div>
          <MarginBottom margin={27} />
          <div>
            <InputText required label='이름' id='join-name' type='text' placeholder='고잉바잉' value={name} onChange={onChangeName} />
            {name.length > 0 && <span className='error'>{nameMessage}</span>}
          </div>
          <MarginBottom margin={10} />
          <div>
            <InputText required label='닉네임' id='join-nickname' type='text' placeholder='닉네임' value={nickname} onChange={onChangeNickName} />
            {nickname.length > 0 && <span className='error'>{nicknameMessage}</span>}
          </div>
          <MarginBottom margin={27} />
          <div>
            {/* <InputText
              required
              label='휴대폰번호'
              id='join-phone'
              type='text'
              placeholder='010-1234-5678'
              max_length={13}
              value={phone}
              onChange={(e) => setPhone(e.currentTarget.value)}
              side_type='type1'
              side={
                <>
                  {phone?.length >= 11 ? (
                    <button type='button' className='second' onClick={stateChange}>
                      {status === 1 ? '재발송' : status === 2 ? '수정' : '인증번호 받기'}
                    </button>
                  ) : (
                    <button type='button' className='inactive' onClick={stateChange}>
                      인증번호 받기
                    </button>
                  )}
                </>
              }
            /> */}
            {/* {status === 1 && (
              <>
                <MarginBottom margin={10} />
                <InputText
                  name='auth'
                  type='text'
                  value={auth}
                  side_type='type1'
                  side={
                    <>
                      <button type='button' className={status === 1 ? `confirm` : 'inactive'} onClick={() => {}}>
                        인증확인
                      </button>
                    </>
                  }
                  error={`${authtimmer()}`}
                  onChange={(e) => setAuth(e.currentTarget.value)}
                  disabled={validation ? false : true}
                />
              </>
            )} */}
          </div>
          <div>
            <Agree props={props} />
          </div>
          <MarginBottom margin={10} />
          <div className='join-btn'>
            <Button className={`btn-join disabled`} label=' 회원가입' onClick={() => Signup()} />
          </div>
        </div>
      </section>
      <MarginBottom margin={100} />
      {mediaQuery === 'M' ? <MobileFooter /> : <Footer />}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const EmailCheck = async () => {
    const EmailApi = `http://3.37.125.107/api/v1/auth/check-email`;
    const res = await Axios.post(EmailApi);
    const data = res.data;
    console.log(data);
  };
  return { props: { type: context.query.type } };
};

export default Join;
