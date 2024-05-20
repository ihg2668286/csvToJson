const fs = require('fs');
const csvParser = require('csv-parser');
const path = require('path');

// CSV 파일 경로 설정
const csvFilePath = path.join(__dirname, 'data.csv');

// 결과를 저장할 빈 배열 정의
const results = [];

// 파일 스트림 생성 및 파싱
fs.createReadStream(csvFilePath)
  .pipe(csvParser())
  .on('data', (row) => {
    const phoneNumberKey = Object.keys(row).find((key) =>
      key.includes('업무 전화번호')
    );
    const companyLogoKey = Object.keys(row).find((key) =>
      key.includes('회사 로고 이미지')
    );
    const profileImageKey = Object.keys(row).find((key) =>
      key.includes('프로필 이미지')
    );
    const companyAddrKey = Object.keys(row).find((key) =>
      key.includes('회사 주소지')
    );
    const emailKey = Object.keys(row).find((key) =>
      key.includes('이메일 주소')
    );

    // 새 객체를 만들고 필요한 속성만 할당
    const obj = {
      userId: row['Submission ID'],
      companyName: row['회사명'],
      companyLogo: row[companyLogoKey],
      name: row['성함'],
      position: row['직함 및 직위'],
      phoneNumber: row[phoneNumberKey],
      email: row[emailKey],
      companyAddr: row[companyAddrKey],
      profileImage: row[profileImageKey],
      message: row['한 줄 소개글'],
      companyEmail: row['회사 이메일'],
    };

    // 링크를 추출하고 'links' 배열에 저장
    obj.links = Object.keys(row)
      .filter(
        (key) =>
          key.includes(
            '디지털 명함에 넣을 개인 링크를 입력해 주세요. (최대 5개 선택)'
          ) ||
          key.includes('링크를 입력해 주세요') ||
          key.startsWith('https://1') ||
          key.startsWith('https://2') ||
          key.startsWith('https://3') ||
          key.startsWith('https://4')
      )
      .map((key) => {
        const link = row[key];
        // 링크가 비어있지 않으면 객체로 변환하여 반환, 비어있다면 null 반환
        return link ? { title: link, href: link } : null;
      })
      .filter(Boolean); // null을 제거하여 빈 링크 제거

    // 링크가 없을 경우 빈 배열 할당
    if (obj.links.length === 0) {
      obj.links = [];
    }

    // 결과 배열에 추가
    results.push(obj);
  })
  .on('end', () => {
    // 모든 데이터가 처리된 후에 결과 출력
    // console.log(results);

    // 선택적: 결과를 js 파일로 저장
    fs.writeFile(
      'output.js',
      JSON.stringify(results, null, 2).replace(/"([^"]+)":/g, '$1:'),
      (err) => {
        if (err) throw err;
        console.log('output.js 파일이 생성되었습니다.');
      }
    );
  });
